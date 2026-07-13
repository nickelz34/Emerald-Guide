/**
 * Verify optional labeling on story-band walkthrough events.
 * Run: node scripts/verify-optional-coverage.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const metaSrc = readFileSync(join(root, "src/data/walkthroughMeta.ts"), "utf8");
const walkSrc = readFileSync(join(root, "src/data/walkthrough.ts"), "utf8");

function parseStringSet(exportName) {
  const re = new RegExp(
    `const ${exportName} = new Set\\(\\[([\\s\\S]*?)\\]\\);`,
  );
  const m = metaSrc.match(re);
  if (!m) throw new Error(`Could not parse ${exportName}`);
  return new Set([...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
}

const OPTIONAL_CHAPTERS = parseStringSet("OPTIONAL_CHAPTER_IDS");
const OPTIONAL_STEPS = parseStringSet("OPTIONAL_STEP_IDS");
const REQUIRED_STEPS = parseStringSet("REQUIRED_STEP_IDS");

function extractStepBlock(stepId) {
  const anchor = `id: "${stepId}"`;
  const start = walkSrc.indexOf(anchor);
  if (start < 0) return null;

  const open = walkSrc.lastIndexOf("{", start);
  let depth = 0;
  for (let i = open; i < walkSrc.length; i++) {
    const ch = walkSrc[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return walkSrc.slice(open, i + 1);
    }
  }
  return null;
}

function extractChapterId(chapterId) {
  const re = new RegExp(`\\{\\s*\\n\\s+id: "${chapterId}",`);
  return re.test(walkSrc);
}

function parseStepInfo(block) {
  const title = block.match(/title: "([^"]+)"/)?.[1] ?? "";
  const tags = [...block.matchAll(/tags:\s*\[([^\]]*)\]/g)].flatMap((tm) =>
    [...tm[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
  );
  return { title, tags };
}

const errors = [];

for (const stepId of OPTIONAL_STEPS) {
  const block = extractStepBlock(stepId);
  if (!block) {
    errors.push(`${stepId}: listed in OPTIONAL_STEP_IDS but no matching walkthrough step`);
    continue;
  }
  const { title, tags } = parseStepInfo(block);
  if (!/\(optional/i.test(title)) {
    errors.push(`${stepId}: optional event title should include "(optional)"`);
  }
  if (!tags.includes("optional")) {
    errors.push(`${stepId}: optional step should include "optional" in tags`);
  }
}

for (const chapterId of OPTIONAL_CHAPTERS) {
  if (!extractChapterId(chapterId)) {
    errors.push(`${chapterId}: listed in OPTIONAL_CHAPTER_IDS but no matching chapter`);
    continue;
  }
  const chapterRe = new RegExp(
    `id: "${chapterId}",[\\s\\S]*?steps: \\[([\\s\\S]*?)\\n\\s+\\],`,
  );
  const chapterMatch = walkSrc.match(chapterRe);
  if (!chapterMatch) continue;
  const stepsChunk = chapterMatch[1];
  for (const sm of stepsChunk.matchAll(/\n\s+id: "([^"]+)"/g)) {
    const stepId = sm[1];
    const block = extractStepBlock(stepId);
    if (!block) continue;
    const { title } = parseStepInfo(block);
    if (!/\(optional/i.test(title)) {
      errors.push(`${stepId}: optional chapter step title should include "(optional)"`);
    }
  }
}

for (const stepId of REQUIRED_STEPS) {
  const block = extractStepBlock(stepId);
  if (!block) continue;
  const { title } = parseStepInfo(block);
  if (/\(optional\)/i.test(title)) {
    errors.push(`${stepId}: story-critical step must not be labeled optional`);
  }
}

if (errors.length) {
  console.error("Optional coverage verification failed:\n");
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

console.log(
  `OK: optional labeling verified for ${OPTIONAL_STEPS.size} optional steps and ${OPTIONAL_CHAPTERS.size} optional chapters.`,
);
