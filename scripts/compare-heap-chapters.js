#!/usr/bin/env node
/**
 * Compare core-class instance counts across all .heapsnapshot files in memory/.
 * Prints a matrix sorted by max growth (last - first among ordered snapshots).
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const MEMORY_DIR = path.join(__dirname, "..", "memory");
const CORE_DIR = path.join(__dirname, "..", "src", "core");
const CLASS_RE = /\b(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_][A-Za-z0-9_]*)/g;

function walkFiles(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, exts, out);
    else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function discoverCoreClasses() {
  const names = new Set();
  for (const file of walkFiles(CORE_DIR, new Set([".ts", ".tsx"]))) {
    const text = fs.readFileSync(file, "utf8");
    CLASS_RE.lastIndex = 0;
    let m;
    while ((m = CLASS_RE.exec(text))) names.add(m[1]);
  }
  return [...names];
}

function countMany(heap, classNames) {
  const nodeFields = heap.snapshot.meta.node_fields;
  const nodeTypes = heap.snapshot.meta.node_types[0];
  const fieldCount = nodeFields.length;
  const typeIdx = nodeFields.indexOf("type");
  const nameIdx = nodeFields.indexOf("name");
  const objectType = nodeTypes.indexOf("object");
  const { nodes, strings } = heap;
  const nodeCount = heap.snapshot.node_count;

  const wanted = new Set(classNames);
  const indexToName = new Map();
  for (let i = 0; i < strings.length; i++) {
    if (wanted.has(strings[i])) indexToName.set(i, strings[i]);
  }

  const counts = Object.create(null);
  for (const n of classNames) counts[n] = 0;

  for (let n = 0; n < nodeCount; n++) {
    const base = n * fieldCount;
    const className = indexToName.get(nodes[base + nameIdx]);
    if (!className) continue;
    if (nodes[base + typeIdx] !== objectType) continue;
    counts[className]++;
  }
  return counts;
}

function shortLabel(filename) {
  return filename
    .replace(/\.heapsnapshot$/i, "")
    .replace(/^Chapter_/i, "Ch");
}

function main() {
  const series = process.argv[2]; // "arabic" | "roman" | "all"
  const all = fs
    .readdirSync(MEMORY_DIR)
    .filter((f) => f.endsWith(".heapsnapshot"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const arabic = all.filter((f) => /^Chapter_\d/.test(f));
  const roman = all.filter((f) => /^Chapter_[IVX]+/.test(f));

  let files;
  if (series === "arabic") files = arabic;
  else if (series === "roman") files = roman;
  else if (series === "all") files = all;
  else {
    // default: run both series separately
    console.log("=== Arabic (Chapter_1..5) ===\n");
    process.argv[2] = "arabic";
    main();
    console.log("\n=== Roman (Chapter_I..V) ===\n");
    process.argv[2] = "roman";
    main();
    return;
  }

  if (files.length === 0) {
    console.error("No snapshots for series:", series);
    process.exit(1);
  }

  const classNames = discoverCoreClasses();
  /** @type {Map<string, Record<string, number>>} */
  const bySnap = new Map();
  const totals = [];

  for (const file of files) {
    const full = path.join(MEMORY_DIR, file);
    const mb = (fs.statSync(full).size / (1024 * 1024)).toFixed(1);
    process.stderr.write(`Loading ${file} (${mb} MB)...\n`);
    const heap = JSON.parse(fs.readFileSync(full, "utf8"));
    const counts = countMany(heap, classNames);
    bySnap.set(file, counts);
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    totals.push({ file, nodes: heap.snapshot.node_count, sum, mb });
    // free heap ASAP
  }

  const labels = files.map(shortLabel);
  const first = files[0];
  const last = files[files.length - 1];

  // rows: class -> counts per snap + delta
  const rows = classNames.map((name) => {
    const vals = files.map((f) => bySnap.get(f)[name] || 0);
    const delta = vals[vals.length - 1] - vals[0];
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const range = max - min;
    return { name, vals, delta, range, max };
  });

  // suspicious: grew from first to last, or range > 0 while not obviously scene-local
  const growing = rows
    .filter((r) => r.delta > 0 || r.range > 0)
    .sort((a, b) => b.delta - a.delta || b.range - a.range || a.name.localeCompare(b.name));

  const stableNonZero = rows
    .filter((r) => r.range === 0 && r.max > 0)
    .sort((a, b) => b.max - a.max || a.name.localeCompare(b.name));

  console.log("File sizes / total core instances / nodes:");
  for (const t of totals) {
    console.log(
      `  ${shortLabel(t.file).padEnd(8)}  ${t.mb.padStart(5)} MB  coreObjs=${String(t.sum).padStart(4)}  nodes=${t.nodes.toLocaleString("en-US")}`
    );
  }

  const nameW = Math.max(5, ...growing.map((r) => r.name.length), ...stableNonZero.slice(0, 5).map((r) => r.name.length));
  const colW = Math.max(5, ...labels.map((l) => l.length));

  function printRows(title, list) {
    console.log(`\n${title}`);
    if (list.length === 0) {
      console.log("  (none)");
      return;
    }
    const head =
      "Class".padEnd(nameW) +
      "  " +
      labels.map((l) => l.padStart(colW)).join("  ") +
      "  " +
      "Δ".padStart(4) +
      "  " +
      "rng".padStart(3);
    console.log(head);
    console.log("-".repeat(head.length));
    for (const r of list) {
      console.log(
        r.name.padEnd(nameW) +
          "  " +
          r.vals.map((v) => String(v).padStart(colW)).join("  ") +
          "  " +
          String(r.delta >= 0 ? `+${r.delta}` : r.delta).padStart(4) +
          "  " +
          String(r.range).padStart(3)
      );
    }
  }

  printRows("Classes that changed across snapshots (sorted by Δ last−first):", growing);
  printRows("Stable non-zero (same count every snapshot):", stableNonZero);

  // Highlight Chapter_III specifically if in series
  const iii = files.find((f) => /III|3/.test(f) && f.includes("Chapter"));
  if (iii && files.indexOf(iii) > 0) {
    const idx = files.indexOf(iii);
    const prev = files[idx - 1];
    const next = files[idx + 1];
    console.log(`\nFocus: ${shortLabel(iii)} vs neighbors`);
    const spikes = classNames
      .map((name) => {
        const cur = bySnap.get(iii)[name] || 0;
        const p = bySnap.get(prev)[name] || 0;
        const n = next ? bySnap.get(next)[name] || 0 : cur;
        return { name, prev: p, cur, next: n, up: cur - p, down: n - cur };
      })
      .filter((r) => r.up !== 0 || r.down !== 0)
      .sort((a, b) => Math.abs(b.up) - Math.abs(a.up));
    if (spikes.length === 0) {
      console.log("  No class-count differences vs neighbors.");
    } else {
      for (const r of spikes) {
        console.log(
          `  ${r.name.padEnd(nameW)}  ${shortLabel(prev)}=${r.prev}  ${shortLabel(iii)}=${r.cur}  ${next ? shortLabel(next) + "=" + r.next : ""}  (Δprev ${r.up >= 0 ? "+" : ""}${r.up})`
        );
      }
    }
  }
}

main();
