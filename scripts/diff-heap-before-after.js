#!/usr/bin/env node
/**
 * Compare before_played vs after_played heapsnapshots per chapter.
 * after is verse99 (empty) so count GROWTH is a leak/cache signal, not level content.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "memory");
const OUT = path.join(__dirname, "..", "memory", "heap-diff-report.json");

const CHAPTERS = ["1", "2", "3", "4", "5", "I", "II", "III", "IV", "V"];

function summarize(heap) {
  const meta = heap.snapshot.meta;
  const nodeFields = meta.node_fields;
  const nodeTypes = meta.node_types[0];
  const fieldCount = nodeFields.length;
  const typeIdx = nodeFields.indexOf("type");
  const nameIdx = nodeFields.indexOf("name");
  const selfSizeIdx = nodeFields.indexOf("self_size");
  const { nodes, strings } = heap;
  const nodeCount = heap.snapshot.node_count;

  const byName = Object.create(null);
  const byType = Object.create(null);
  let totalSelf = 0;

  for (let n = 0; n < nodeCount; n++) {
    const base = n * fieldCount;
    const typeName = nodeTypes[nodes[base + typeIdx]] || "?";
    const name = strings[nodes[base + nameIdx]] || "";
    const size = nodes[base + selfSizeIdx] || 0;
    totalSelf += size;

    const typeRow = (byType[typeName] ??= { count: 0, size: 0 });
    typeRow.count++;
    typeRow.size += size;

    const key = `${typeName}\t${name}`;
    const row = (byName[key] ??= { type: typeName, name, count: 0, size: 0 });
    row.count++;
    row.size += size;
  }

  return { nodeCount, totalSelf, byName, byType, stringCount: strings.length };
}

function loadSummary(file) {
  const full = path.join(ROOT, file);
  const mb = (fs.statSync(full).size / (1024 * 1024)).toFixed(1);
  process.stderr.write(`Loading ${file} (${mb} MB)...\n`);
  const heap = JSON.parse(fs.readFileSync(full, "utf8"));
  const summary = summarize(heap);
  process.stderr.write(
    `  nodes=${summary.nodeCount.toLocaleString()}  self=${(summary.totalSelf / 1024 / 1024).toFixed(1)} MB\n`,
  );
  if (global.gc) global.gc();
  return summary;
}

function diffSummaries(before, after) {
  const names = new Set([...Object.keys(before.byName), ...Object.keys(after.byName)]);
  const rows = [];
  for (const key of names) {
    const b = before.byName[key] || { type: key.split("\t")[0], name: key.split("\t")[1], count: 0, size: 0 };
    const a = after.byName[key] || { type: b.type, name: b.name, count: 0, size: 0 };
    const dCount = a.count - b.count;
    const dSize = a.size - b.size;
    if (dCount === 0 && dSize === 0) continue;
    rows.push({
      type: a.type || b.type,
      name: a.name || b.name,
      beforeCount: b.count,
      afterCount: a.count,
      dCount,
      beforeSize: b.size,
      afterSize: a.size,
      dSize,
    });
  }
  rows.sort((x, y) => y.dSize - x.dSize || y.dCount - x.dCount);

  const types = new Set([...Object.keys(before.byType), ...Object.keys(after.byType)]);
  const typeRows = [];
  for (const t of types) {
    const b = before.byType[t] || { count: 0, size: 0 };
    const a = after.byType[t] || { count: 0, size: 0 };
    typeRows.push({
      type: t,
      beforeCount: b.count,
      afterCount: a.count,
      dCount: a.count - b.count,
      beforeSize: b.size,
      afterSize: a.size,
      dSize: a.size - b.size,
    });
  }
  typeRows.sort((x, y) => y.dSize - x.dSize);

  return {
    dNodes: after.nodeCount - before.nodeCount,
    dSelf: after.totalSelf - before.totalSelf,
    dStrings: after.stringCount - before.stringCount,
    topBySize: rows.slice(0, 40),
    topByCount: [...rows].sort((x, y) => y.dCount - x.dCount).slice(0, 40),
    growers: rows.filter((r) => r.dCount > 0 || r.dSize > 0),
    typeRows,
  };
}

function interestingName(name) {
  return /Mesh|Material|Texture|Geometry|Buffer|Shader|Effect|Observer|Observable|Glow|Highlight|PostProcess|Particle|Vertex|Transform|Camera|Light|Layer|GUI|Control|Texture|Internal|WebGL|Audio|Cannon|Body|Impostor|Animation|Animatable|SmartArray|SubMesh|Bounding|Utility|RenderTarget|DynamicTexture|NodeMaterial|ThinEngine|Engine|Scene|Image|Canvas|ArrayBuffer|Float32|Uint16|Uint32|Closure|Context|Map|Set|WeakMap/i.test(
    name,
  );
}

function main() {
  const report = { chapters: {}, consensus: {} };

  /** @type {Map<string, { chapters: number, totalDCount: number, totalDSize: number, samples: object[] }>} */
  const growerAgg = new Map();

  for (const ch of CHAPTERS) {
    const beforeFile = path.join("before_played", `Chapter_${ch}.heapsnapshot`);
    const afterFile = path.join("after_played", `Chapter_${ch}.heapsnapshot`);
    if (!fs.existsSync(path.join(ROOT, beforeFile)) || !fs.existsSync(path.join(ROOT, afterFile))) {
      process.stderr.write(`Skip Chapter ${ch}: missing files\n`);
      continue;
    }

    const before = loadSummary(beforeFile);
    const after = loadSummary(afterFile);
    const diff = diffSummaries(before, after);

    report.chapters[ch] = {
      beforeNodes: before.nodeCount,
      afterNodes: after.nodeCount,
      dNodes: diff.dNodes,
      beforeSelfMB: +(before.totalSelf / 1024 / 1024).toFixed(2),
      afterSelfMB: +(after.totalSelf / 1024 / 1024).toFixed(2),
      dSelfMB: +(diff.dSelf / 1024 / 1024).toFixed(2),
      dStrings: diff.dStrings,
      types: diff.typeRows,
      topBySize: diff.topBySize,
      topByCount: diff.topByCount,
      interestingGrowers: diff.growers
        .filter((r) => interestingName(r.name) || interestingName(r.type))
        .slice(0, 50),
    };

    for (const r of diff.growers) {
      if (r.dCount <= 0 && r.dSize < 50_000) continue;
      const key = `${r.type}\t${r.name}`;
      const agg = growerAgg.get(key) || { chapters: 0, totalDCount: 0, totalDSize: 0, samples: [] };
      agg.chapters++;
      agg.totalDCount += r.dCount;
      agg.totalDSize += r.dSize;
      agg.samples.push({ ch, dCount: r.dCount, dSize: r.dSize, before: r.beforeCount, after: r.afterCount });
      growerAgg.set(key, agg);
    }

    // free
  }

  const consensus = [...growerAgg.entries()]
    .map(([key, v]) => {
      const [type, name] = key.split("\t");
      return {
        type,
        name,
        chaptersGrown: v.chapters,
        avgDCount: Math.round(v.totalDCount / v.chapters),
        avgDSize: Math.round(v.totalDSize / v.chapters),
        totalDSize: v.totalDSize,
        samples: v.samples,
      };
    })
    .filter((r) => r.chaptersGrown >= 5)
    .sort((a, b) => b.chaptersGrown - a.chaptersGrown || b.totalDSize - a.totalDSize);

  report.consensus = consensus.slice(0, 80);
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  process.stderr.write(`Wrote ${OUT}\n`);

  console.log("\n=== Per-chapter shallow heap (sum of node self_size) ===");
  for (const [ch, c] of Object.entries(report.chapters)) {
    console.log(
      `Ch ${String(ch).padEnd(3)}  ${c.beforeSelfMB.toFixed(1).padStart(6)} → ${c.afterSelfMB.toFixed(1).padStart(6)} MB  Δ ${c.dSelfMB >= 0 ? "+" : ""}${c.dSelfMB.toFixed(1)} MB   nodes ${c.dNodes >= 0 ? "+" : ""}${c.dNodes.toLocaleString()}`,
    );
  }

  console.log("\n=== Consensus growers (grew in ≥5 chapters; after=empty verse99) ===");
  const nameW = Math.max(8, ...consensus.slice(0, 50).map((r) => r.name.length));
  console.log(
    "Chs".padStart(3),
    "avgΔ#".padStart(8),
    "avgΔsize".padStart(10),
    "type".padEnd(12),
    "name",
  );
  for (const r of consensus.slice(0, 50)) {
    console.log(
      String(r.chaptersGrown).padStart(3),
      String(r.avgDCount).padStart(8),
      `${(r.avgDSize / 1024).toFixed(1)} KB`.padStart(10),
      r.type.padEnd(12),
      r.name,
    );
  }
}

main();
