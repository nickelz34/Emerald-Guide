/**
 * Smoke-test Admin Mode helpers: change summary, file diffs, block order, sprites catalog.
 * Usage: npx tsx scripts/verify-admin-features.mjs
 */
import assert from "node:assert/strict";
import guideData from "../src/data/guide_data.json" with { type: "json" };
import { summarizeGuideChanges } from "../src/admin/guideChangeSummary.ts";
import {
  buildGuideFileDiff,
  findJsonObjectLineRange,
  serializeGuideFile,
  diffLines,
  buildHunks,
} from "../src/admin/guideFileDiff.ts";
import { resolveStepBlockOrder, getAvailableStepBlocks } from "../src/admin/stepBlocks.ts";
import { getSpriteCatalog, filterSpriteCatalog } from "../src/admin/spriteCatalog.ts";
import { seedSpecialtyForStep } from "../src/admin/specialtySeed.ts";

const walkthrough = guideData.walkthrough;

function clone(v) {
  return structuredClone(v);
}

let failed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`OK  ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${name}`);
    console.error(err);
  }
}

check("clean draft has zero pending changes", () => {
  const summary = summarizeGuideChanges(walkthrough, clone(walkthrough));
  assert.equal(summary.total, 0);
});

check("summary edit produces clickable diffs with before/after", () => {
  const baseline = clone(walkthrough);
  const draft = clone(walkthrough);
  const step = draft[0].steps[0];
  const original = step.summary;
  step.summary = `${original} EDIT`;
  const summary = summarizeGuideChanges(baseline, draft);
  assert.ok(summary.total >= 1);
  const item = summary.items.find((i) => i.stepId === step.id);
  assert.ok(item, "expected step-updated item");
  assert.ok(item.diffs.length >= 1);
  const summaryDiff = item.diffs.find((d) => d.field === "summary");
  assert.ok(summaryDiff);
  assert.equal(summaryDiff.before, original);
  assert.match(summaryDiff.after, /EDIT$/);
});

check("navigation alone does not dirty via specialty seed", () => {
  const baseline = clone(walkthrough);
  const draft = clone(walkthrough);
  // Simulate opening specialty editors: seed in memory only
  for (const ch of draft) {
    for (const step of ch.steps.slice(0, 5)) {
      seedSpecialtyForStep(step);
    }
  }
  const summary = summarizeGuideChanges(baseline, draft);
  assert.equal(summary.total, 0, "seedSpecialtyForStep must not mutate the step");
});

check("file diff scopes to step JSON with line numbers", () => {
  const baseline = clone(walkthrough);
  const draft = clone(walkthrough);
  const step = draft[0].steps[0];
  step.summary = `${step.summary} LINE`;
  const item = {
    id: "t",
    kind: "step-updated",
    label: "t",
    chapterId: draft[0].id,
    stepId: step.id,
    diffs: [],
  };
  const result = buildGuideFileDiff(baseline, draft, item);
  assert.equal(result.file.path, "src/data/guide_data.json");
  assert.equal(result.scoped, true);
  assert.ok(result.hunks.length >= 1);
  const changed = result.hunks.flatMap((h) => h.lines).filter((l) => l.kind !== "context");
  assert.ok(changed.some((l) => l.kind === "remove" && l.oldLine));
  assert.ok(changed.some((l) => l.kind === "add" && l.newLine));
  const range = findJsonObjectLineRange(serializeGuideFile(baseline), step.id);
  assert.ok(range);
  assert.ok(range.start < range.end);
});

check("JSON object range ignores braces inside string values", () => {
  const baseline = clone(walkthrough);
  const step = baseline[0].steps[0];
  step.summary = 'Use {curly} braces carefully } and { again';
  const text = serializeGuideFile(baseline);
  const range = findJsonObjectLineRange(text, step.id);
  assert.ok(range);
  const excerpt = text.split("\n").slice(range.start - 1, range.end).join("\n");
  assert.match(excerpt, new RegExp(`"id": "${step.id}"`));
  assert.equal(excerpt.trim().startsWith("{"), true);
  assert.equal(excerpt.trim().endsWith("}") || excerpt.trim().endsWith("},"), true);
});

check("myers diff basic cases", () => {
  const d = diffLines(["a", "b", "c"], ["a", "x", "c"]);
  assert.deepEqual(
    d.map((l) => l.kind),
    ["context", "remove", "add", "context"],
  );
  const hunks = buildHunks(d);
  assert.equal(hunks.length, 1);
});

check("sprites catalog includes pokemon trainers items", () => {
  const catalog = getSpriteCatalog();
  assert.ok(catalog.length > 500);
  assert.ok(catalog.some((e) => e.kind === "pokemon"));
  assert.ok(catalog.some((e) => e.kind === "trainer"));
  assert.ok(catalog.some((e) => e.kind === "item"));
  const treecko = filterSpriteCatalog("treecko", "pokemon");
  assert.ok(treecko.length >= 1);
});

check("block order includes sprites and panels", () => {
  const draft = clone(walkthrough);
  const step = draft.find((c) => c.steps.some((s) => s.id === "route-101-2"))?.steps.find(
    (s) => s.id === "route-101-2",
  );
  assert.ok(step);
  step.sprites = [
    {
      id: "sprite-1",
      kind: "pokemon",
      src: "sprites/pokemon/emerald/252.png",
      label: "Treecko",
    },
  ];
  const blocks = getAvailableStepBlocks(step);
  assert.ok(blocks.some((b) => b.id === "sprite-item:sprite-1"));
  assert.ok(blocks.some((b) => b.id === "panel:starter" || b.id.startsWith("panel:")));
  const ordered = resolveStepBlockOrder(step);
  assert.ok(ordered.some((b) => b.id === "sprite-item:sprite-1"));
});

check("adding sprite marks pending publish with sprite field diff", () => {
  const baseline = clone(walkthrough);
  const draft = clone(walkthrough);
  const step = draft[0].steps[0];
  step.sprites = [
    {
      id: "s1",
      kind: "pokemon",
      src: "sprites/pokemon/emerald/1.png",
      label: "Bulbasaur",
    },
  ];
  const summary = summarizeGuideChanges(baseline, draft);
  const item = summary.items.find((i) => i.stepId === step.id);
  assert.ok(item);
  assert.ok(item.diffs.some((d) => d.field.startsWith("sprites") || d.label.toLowerCase().includes("sprite")));
});

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll admin feature checks passed.");
