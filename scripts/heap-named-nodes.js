#!/usr/bin/env node
/**
 * Count Mesh / InstancedMesh / TransformNode / Material / Geometry / Texture
 * instances by their `.name` (or `.url`) property in a heapsnapshot.
 *
 * Usage:
 *   node --max-old-space-size=8192 scripts/heap-named-nodes.js memory/after_played/Chapter_1.heapsnapshot
 *   node --max-old-space-size=8192 scripts/heap-named-nodes.js --diff 1
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "memory");
const TARGETS = new Set([
  "Mesh",
  "InstancedMesh",
  "TransformNode",
  "Geometry",
  "StandardMaterial",
  "ShaderMaterial",
  "MultiMaterial",
  "Texture",
  "DynamicTexture",
  "RenderTargetTexture",
  "InternalTexture",
  "GlowLayer",
  "HighlightLayer",
  "PostProcess",
  "UniformBuffer",
  "VertexBuffer",
  "Buffer",
  "SubMesh",
  "UtilityLayerRenderer",
  "AdvancedDynamicTexture",
  "SolidParticleSystem",
  "ShadowGenerator",
  "DefaultRenderingPipeline",
  "Effect",
  "WebGLPipelineContext",
]);

function parseHeap(file) {
  const heap = JSON.parse(fs.readFileSync(file, "utf8"));
  const meta = heap.snapshot.meta;
  const nodeFields = meta.node_fields;
  const nodeTypes = meta.node_types[0];
  const edgeFields = meta.edge_fields;
  const edgeTypes = meta.edge_types[0];
  const fieldCount = nodeFields.length;
  const edgeFieldCount = edgeFields.length;
  const typeIdx = nodeFields.indexOf("type");
  const nameIdx = nodeFields.indexOf("name");
  const edgeCountIdx = nodeFields.indexOf("edge_count");
  const objectType = nodeTypes.indexOf("object");
  const propertyEdge = edgeTypes.indexOf("property");
  const { nodes, edges, strings } = heap;
  const nodeCount = heap.snapshot.node_count;

  const wanted = new Map();
  for (let i = 0; i < strings.length; i++) {
    if (TARGETS.has(strings[i])) wanted.set(i, strings[i]);
  }

  const nameStrIdx = [];
  const urlStrIdx = [];
  for (let i = 0; i < strings.length; i++) {
    if (strings[i] === "name") nameStrIdx.push(i);
    if (strings[i] === "url") urlStrIdx.push(i);
  }
  const nameSet = new Set(nameStrIdx);
  const urlSet = new Set(urlStrIdx);

  const stringType = nodeTypes.indexOf("string");
  const concatType = nodeTypes.indexOf("concatenated string");
  const slicedType = nodeTypes.indexOf("sliced string");

  function nodeString(nodeBase) {
    const t = nodes[nodeBase + typeIdx];
    if (t === stringType || t === concatType || t === slicedType) {
      return strings[nodes[nodeBase + nameIdx]] || "";
    }
    return null;
  }

  const counts = Object.create(null);
  let edgeOffset = 0;

  for (let n = 0; n < nodeCount; n++) {
    const base = n * fieldCount;
    const edgeCount = nodes[base + edgeCountIdx];
    const ctor = wanted.get(nodes[base + nameIdx]);
    if (ctor && nodes[base + typeIdx] === objectType) {
      let instName = "";
      let instUrl = "";
      for (let e = 0; e < edgeCount; e++) {
        const eb = (edgeOffset + e) * edgeFieldCount;
        if (edges[eb] !== propertyEdge) continue;
        const edgeName = edges[eb + 1];
        const to = edges[eb + 2];
        if (nameSet.has(edgeName)) {
          instName = nodeString(to) ?? instName;
        } else if (urlSet.has(edgeName)) {
          instUrl = nodeString(to) ?? instUrl;
        }
      }
      let label = instName || instUrl || "(unnamed)";
      if (label.startsWith("data:")) label = "data:(screenshot/base64)";
      const key = `${ctor}\t${label}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    edgeOffset += edgeCount;
  }

  return counts;
}

function printCounts(counts, title, limit = 60) {
  const rows = Object.entries(counts)
    .map(([k, v]) => {
      const [ctor, name] = k.split("\t");
      return { ctor, name, count: v };
    })
    .sort((a, b) => b.count - a.count || a.ctor.localeCompare(b.ctor) || a.name.localeCompare(b.name));

  console.log(`\n=== ${title} ===`);
  const ctorW = Math.max(8, ...rows.slice(0, limit).map((r) => r.ctor.length));
  for (const r of rows.slice(0, limit)) {
    console.log(String(r.count).padStart(6), r.ctor.padEnd(ctorW), r.name.slice(0, 80));
  }
  return rows;
}

function main() {
  const args = process.argv.slice(2);
  const diffIdx = args.indexOf("--diff");
  if (diffIdx >= 0) {
    const ch = args[diffIdx + 1];
    const before = path.join(ROOT, "before_played", `Chapter_${ch}.heapsnapshot`);
    const after = path.join(ROOT, "after_played", `Chapter_${ch}.heapsnapshot`);
    process.stderr.write(`Diff Chapter ${ch}\n`);
    process.stderr.write(`  before ${before}\n`);
    const b = parseHeap(before);
    if (global.gc) global.gc();
    process.stderr.write(`  after  ${after}\n`);
    const a = parseHeap(after);

    const keys = new Set([...Object.keys(b), ...Object.keys(a)]);
    const rows = [];
    for (const k of keys) {
      const d = (a[k] || 0) - (b[k] || 0);
      if (d === 0) continue;
      const [ctor, name] = k.split("\t");
      rows.push({ ctor, name, before: b[k] || 0, after: a[k] || 0, d });
    }
    rows.sort((x, y) => y.d - x.d);

    console.log(`\n=== Chapter ${ch} named-object Δ (after empty verse99 − before first verse) ===`);
    console.log("Δ".padStart(6), "before".padStart(6), "after".padStart(6), "ctor".padEnd(22), "name");
    for (const r of rows.filter((r) => r.d > 0).slice(0, 80)) {
      console.log(
        String(r.d).padStart(6),
        String(r.before).padStart(6),
        String(r.after).padStart(6),
        r.ctor.padEnd(22),
        r.name.slice(0, 90),
      );
    }
    console.log("\n--- shrinkers (expected: first-verse content gone) ---");
    for (const r of [...rows].filter((r) => r.d < 0).sort((x, y) => x.d - y.d).slice(0, 20)) {
      console.log(
        String(r.d).padStart(6),
        String(r.before).padStart(6),
        String(r.after).padStart(6),
        r.ctor.padEnd(22),
        r.name.slice(0, 90),
      );
    }
    return;
  }

  const file = args[0];
  if (!file) {
    console.error("pass a heapsnapshot path or --diff <chapter>");
    process.exit(1);
  }
  const counts = parseHeap(path.resolve(file));
  printCounts(counts, path.basename(file));
}

main();
