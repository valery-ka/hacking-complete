#!/usr/bin/env node
/**
 * Count object instances for core classes in a Chrome/V8 .heapsnapshot.
 *
 * By default scans src/core for `class Name` declarations and reports all of them.
 *
 * Usage:
 *   node scripts/count-heap-class.js
 *   node scripts/count-heap-class.js path/to/file.heapsnapshot
 *   node scripts/count-heap-class.js --class SmartArray
 *   node scripts/count-heap-class.js --class Player,EnemySphere
 *   node scripts/count-heap-class.js --zero          # also print classes with 0 instances
 *   node scripts/count-heap-class.js --list          # only list discovered core class names
 *
 * Default snapshot: newest *.heapsnapshot in ./memory
 */

const fs = require("fs");
const path = require("path");

const MEMORY_DIR = path.join(__dirname, "..", "memory");
const CORE_DIR = path.join(__dirname, "..", "src", "core");

const CLASS_RE = /\b(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_][A-Za-z0-9_]*)/g;

function printUsageAndExit(code = 1) {
  console.error(`Usage: node scripts/count-heap-class.js [heapsnapshot] [options]
  --class Name[,Name...]   count only these class names (skip core scan)
  --zero                   include classes with 0 instances
  --list                   print discovered core class names and exit
  -h, --help               show help`);
  process.exit(code);
}

function newestHeapSnapshot(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Memory folder not found: ${dir}`);
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".heapsnapshot"))
    .map((f) => {
      const full = path.join(dir, f);
      return { full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error(`No .heapsnapshot files in ${dir}`);
  }
  return files[0].full;
}

function walkFiles(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, exts, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

/** Collect unique class names declared under src/core. */
function discoverCoreClasses(coreDir = CORE_DIR) {
  if (!fs.existsSync(coreDir)) {
    throw new Error(`Core folder not found: ${coreDir}`);
  }

  const files = walkFiles(coreDir, new Set([".ts", ".tsx", ".js", ".jsx"]));
  const names = new Set();

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    CLASS_RE.lastIndex = 0;
    let m;
    while ((m = CLASS_RE.exec(text)) !== null) {
      names.add(m[1]);
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    printUsageAndExit(0);
  }

  const showZero = args.includes("--zero");
  const listOnly = args.includes("--list");

  let classFilter = null;
  const classFlagIdx = args.indexOf("--class");
  if (classFlagIdx >= 0) {
    const raw = args[classFlagIdx + 1];
    if (!raw || raw.startsWith("-")) {
      console.error("--class requires a name or comma-separated list");
      process.exit(1);
    }
    classFilter = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const positional = args.filter((a, i) => {
    if (a.startsWith("-")) return false;
    if (classFlagIdx >= 0 && i === classFlagIdx + 1) return false;
    return true;
  });

  const snapshotPath = positional[0]
    ? path.resolve(positional[0])
    : newestHeapSnapshot(MEMORY_DIR);

  return { snapshotPath, classFilter, showZero, listOnly };
}

/**
 * Single pass over nodes: count object instances for every watched class name.
 * @returns {Map<string, { instances: number, selfSizeBytes: number, inStrings: boolean }>}
 */
function countMany(heap, classNames) {
  const meta = heap.snapshot.meta;
  const nodeFields = meta.node_fields;
  const nodeTypes = meta.node_types[0];
  const fieldCount = nodeFields.length;

  const typeIdx = nodeFields.indexOf("type");
  const nameIdx = nodeFields.indexOf("name");
  const selfSizeIdx = nodeFields.indexOf("self_size");

  if (typeIdx < 0 || nameIdx < 0) {
    throw new Error("Unexpected heapsnapshot meta.node_fields");
  }

  const objectType = nodeTypes.indexOf("object");
  const { nodes, strings } = heap;
  const nodeCount = heap.snapshot.node_count;

  const wanted = new Set(classNames);
  /** @type {Map<number, string>} stringIndex -> className */
  const indexToName = new Map();
  for (let i = 0; i < strings.length; i++) {
    const s = strings[i];
    if (wanted.has(s)) {
      indexToName.set(i, s);
    }
  }

  const namesInStrings = new Set(indexToName.values());
  /** @type {Map<string, { instances: number, selfSizeBytes: number, inStrings: boolean }>} */
  const counts = new Map();
  for (const name of classNames) {
    counts.set(name, {
      instances: 0,
      selfSizeBytes: 0,
      inStrings: namesInStrings.has(name),
    });
  }

  for (let n = 0; n < nodeCount; n++) {
    const base = n * fieldCount;
    const className = indexToName.get(nodes[base + nameIdx]);
    if (!className) continue;
    if (nodes[base + typeIdx] !== objectType) continue;

    const row = counts.get(className);
    row.instances += 1;
    if (selfSizeIdx >= 0) {
      row.selfSizeBytes += nodes[base + selfSizeIdx];
    }
  }

  return counts;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function printTable(rows) {
  const nameW = Math.max(5, ...rows.map((r) => r.name.length));
  const countW = Math.max(5, ...rows.map((r) => String(r.instances).length));
  const sizeW = Math.max(9, ...rows.map((r) => r.sizeLabel.length));

  const header =
    "Class".padEnd(nameW) +
    "  " +
    "Count".padStart(countW) +
    "  " +
    "Shallow".padStart(sizeW);
  console.log(header);
  console.log("-".repeat(header.length));

  for (const r of rows) {
    console.log(
      r.name.padEnd(nameW) +
        "  " +
        String(r.instances).padStart(countW) +
        "  " +
        r.sizeLabel.padStart(sizeW)
    );
  }
}

function main() {
  const { snapshotPath, classFilter, showZero, listOnly } = parseArgs(process.argv);

  const classNames = classFilter ?? discoverCoreClasses();

  if (listOnly) {
    console.log(`Core classes (${classNames.length}):`);
    for (const name of classNames) {
      console.log(name);
    }
    process.exit(0);
  }

  if (!fs.existsSync(snapshotPath)) {
    console.error(`File not found: ${snapshotPath}`);
    process.exit(1);
  }

  const sizeMb = (fs.statSync(snapshotPath).size / (1024 * 1024)).toFixed(1);
  process.stderr.write(
    `Loading ${path.basename(snapshotPath)} (${sizeMb} MB), watching ${classNames.length} classes...\n`
  );

  const heap = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
  const counts = countMany(heap, classNames);

  let rows = classNames.map((name) => {
    const c = counts.get(name);
    return {
      name,
      instances: c.instances,
      sizeLabel: formatBytes(c.selfSizeBytes),
      inStrings: c.inStrings,
    };
  });

  if (!showZero) {
    rows = rows.filter((r) => r.instances > 0);
  }

  rows.sort((a, b) => b.instances - a.instances || a.name.localeCompare(b.name));

  console.log(`Snapshot: ${snapshotPath}`);
  console.log(`Nodes:    ${heap.snapshot.node_count.toLocaleString("en-US")}`);
  console.log(
    `Classes:  ${rows.length} shown` +
      (showZero ? "" : ` (of ${classNames.length}; use --zero for empties)`)
  );
  console.log("");
  printTable(rows);

  const missing = classNames.filter((n) => !counts.get(n).inStrings);
  if (missing.length && classFilter) {
    console.log("");
    console.log(`Not in snapshot strings: ${missing.join(", ")}`);
  }
}

main();
