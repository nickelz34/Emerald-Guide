/**
 * Smoke-test Admin Mode helpers: change summary, file diffs, block order, sprites catalog.
 * Usage: npx tsx scripts/verify-admin-features.mjs
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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
import { isPullRequestRequiredError } from "../src/lib/githubGuideApi.ts";
import {
  applyChangelogDraftToPlan,
  applyReadmeReleaseUpdates,
  bumpPackageJsonVersion,
  bumpPackageLockVersion,
  bumpSemver,
  classifyGuideBump,
  planReleaseFromGuideChanges,
  prependChangelogEntry,
  toChangelogRelease,
} from "../src/admin/releaseFromChanges.ts";
import {
  formatCentralIsoDateTime,
  formatChangelogReleaseDate,
} from "../src/lib/changelogTime.ts";

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

check("admin publish plans patch vs minor like Cursor ships", () => {
  assert.equal(bumpSemver("1.26.25", "patch"), "1.26.26");
  assert.equal(bumpSemver("1.26.25", "minor"), "1.27.0");

  const baseline = clone(walkthrough);
  const patchDraft = clone(walkthrough);
  patchDraft[0].steps[0].summary = `${patchDraft[0].steps[0].summary} tweak`;
  const patchSummary = summarizeGuideChanges(baseline, patchDraft);
  assert.equal(classifyGuideBump(patchSummary), "patch");
  const patchPlan = planReleaseFromGuideChanges(patchSummary, "1.26.25", new Date("2026-07-16T12:00:00Z"));
  assert.equal(patchPlan.version, "1.26.26");
  assert.equal(patchPlan.bump, "patch");
  assert.equal(patchPlan.updateReadmeProse, false);
  assert.equal(patchPlan.date, "2026-07-16T07:00:00-05:00");

  const minorDraft = clone(walkthrough);
  minorDraft.unshift({
    id: "new-chapter",
    title: "Ch. 0 — New chapter",
    description: "Brand new",
    band: "pregame",
    steps: [{ id: "new-step", title: "New", summary: "", details: [] }],
  });
  const minorSummary = summarizeGuideChanges(baseline, minorDraft);
  assert.equal(classifyGuideBump(minorSummary), "minor");
  const minorPlan = planReleaseFromGuideChanges(minorSummary, "1.26.25", new Date("2026-07-16T12:00:00Z"));
  assert.equal(minorPlan.version, "1.27.0");
  assert.equal(minorPlan.updateReadmeProse, true);
});

check("release helpers update changelog package.json lockfile and README", () => {
  const plan = planReleaseFromGuideChanges(
    {
      total: 1,
      items: [
        {
          id: "step-updated:x",
          kind: "step-updated",
          label: "Updated step “Test”",
          detail: "summary",
          diffs: [{ field: "summary", label: "Summary", before: "a", after: "b" }],
        },
      ],
    },
    "1.26.25",
    new Date("2026-07-16T12:00:00Z"),
  );
  const release = toChangelogRelease(plan);
  assert.equal(release.date, "2026-07-16T07:00:00-05:00");
  const changelogSrc = `export const CHANGELOG: ChangelogRelease[] = [\n  { version: "1.26.25" },\n];\n`;
  const nextChangelog = prependChangelogEntry(changelogSrc, release);
  assert.match(nextChangelog, /version: "1\.26\.26"/);
  assert.match(nextChangelog, /date: "2026-07-16T07:00:00-05:00"/);
  assert.ok(nextChangelog.indexOf("1.26.26") < nextChangelog.indexOf("1.26.25"));

  const pkg = bumpPackageJsonVersion(`{\n  "name": "x",\n  "version": "1.26.25"\n}\n`, "1.26.26");
  assert.match(pkg, /"version": "1\.26\.26"/);

  const lock = bumpPackageLockVersion(
    `{\n  "name": "x",\n  "version": "1.26.25",\n  "packages": {\n    "": {\n      "name": "x",\n      "version": "1.26.25"\n    }\n  }\n}\n`,
    "1.26.26",
  );
  assert.equal(JSON.parse(lock).version, "1.26.26");
  assert.equal(JSON.parse(lock).packages[""].version, "1.26.26");

  const readme = [
    "Current app version: **1.26.25**",
    "",
    "badge (`v1.26.25`)",
    "",
    "1. **Pregame**",
    "   - Old list",
    "2. **Main story**",
    "",
    "4. Publish commits `src/data/guide_data.json` on `main`; GitHub Pages rebuilds the hosted site.",
  ].join("\n");
  const nextReadme = applyReadmeReleaseUpdates(readme, { ...plan, updateReadmeProse: true }, walkthrough);
  assert.match(nextReadme, /\*\*1\.26\.26\*\*/);
  assert.match(nextReadme, /`v1\.26\.26`/);
  assert.match(nextReadme, /version bump, changelog entry/);
  assert.match(nextReadme, /Battles & Training/);
});

check("editable changelog draft overrides auto plan before publish", () => {
  const plan = planReleaseFromGuideChanges(
    {
      total: 1,
      items: [
        {
          id: "step-updated:x",
          kind: "step-updated",
          label: "Updated step “Test”",
          detail: "summary",
          diffs: [{ field: "summary", label: "Summary", before: "a", after: "b" }],
        },
      ],
    },
    "1.26.25",
    new Date("2026-07-16T12:00:00Z"),
  );
  const edited = applyChangelogDraftToPlan(
    plan,
    {
      summary: "Custom summary for the release.",
      sections: [
        {
          heading: "Custom heading",
          items: ["First custom bullet.", "", "  Second custom bullet.  "],
        },
      ],
    },
    1,
  );
  assert.equal(edited.summary, "Custom summary for the release.");
  assert.equal(edited.sections.length, 1);
  assert.equal(edited.sections[0].heading, "Custom heading");
  assert.deepEqual(edited.sections[0].items, ["First custom bullet.", "Second custom bullet."]);
  assert.match(edited.commitBody, /Custom summary for the release/);
});

check("changelog timestamps use Central Time for storage and display", () => {
  assert.equal(formatCentralIsoDateTime(new Date("2026-07-16T12:00:00Z")), "2026-07-16T07:00:00-05:00");
  assert.equal(formatCentralIsoDateTime(new Date("2026-01-16T12:00:00Z")), "2026-01-16T06:00:00-06:00");
  assert.equal(formatChangelogReleaseDate("2026-07-17"), "July 17, 2026");
  assert.equal(
    formatChangelogReleaseDate("2026-07-17T17:04:15-05:00"),
    "July 17, 2026, 5:04 PM CT",
  );
  assert.equal(
    formatChangelogReleaseDate("2026-07-17T22:04:15+00:00"),
    "July 17, 2026, 5:04 PM CT",
  );
});

check("detects GitHub ruleset 409 that requires a pull request", () => {
  assert.equal(
    isPullRequestRequiredError(
      "Repository rule violations found\n\nChanges must be made through a pull request.\n\n",
    ),
    true,
  );
  assert.equal(isPullRequestRequiredError("src/data/guide_data.json does not match abc"), false);
});

check("drag handles are non-interactive spans (hello-pangea blocks buttons)", () => {
  const adminDir = join(dirname(fileURLToPath(import.meta.url)), "../src/admin");
  const files = readdirSync(adminDir).filter((f) => f.endsWith(".tsx"));
  for (const file of files) {
    const src = readFileSync(join(adminDir, file), "utf8");
    assert.equal(
      /<button[\s\S]*?admin-chapter-tree__handle/.test(src),
      false,
      `${file} must not use <button> as a drag handle`,
    );
  }
  const handle = readFileSync(join(adminDir, "AdminDragHandle.tsx"), "utf8");
  assert.match(handle, /<span[\s\S]*admin-chapter-tree__handle/);
});

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll admin feature checks passed.");
