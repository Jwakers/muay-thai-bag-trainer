#!/usr/bin/env npx tsx
/**
 * Builds `public/audio/{id}.wav` from macOS `say` + `afconvert`.
 * Phrases are derived from `src/data/callouts.ts` (CALLOUT_IDS + CALLOUT_LABELS).
 *
 * Usage: pnpm run generate:callouts
 * Requires: macOS (say, afconvert)
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { CALLOUT_IDS, CALLOUT_LABELS } from "../src/data/callouts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const outDir = join(__dirname, "../public/audio");

/** Spoken lines for `say`, keyed exactly like bundled clip filenames. */
const PHRASES: Record<string, string> = {};
for (const id of CALLOUT_IDS) {
  const label = CALLOUT_LABELS[id];
  if (typeof label !== "string" || !label.trim()) {
    console.error(
      `generate-callout-audio: CALLOUT_LABELS missing or empty for id "${id}".`,
    );
    process.exit(1);
  }
  PHRASES[id] = `${label.trim()}!`;
}

const manifestIds = new Set<string>(CALLOUT_IDS);
const phraseKeys = new Set(Object.keys(PHRASES));
if (
  manifestIds.size !== phraseKeys.size ||
  ![...manifestIds].every((k) => phraseKeys.has(k))
) {
  console.error(
    "generate-callout-audio: PHRASES keys must match CALLOUT_IDS exactly.",
    { manifest: [...manifestIds].sort(), phrases: [...phraseKeys].sort() },
  );
  process.exit(1);
}

if (process.platform !== "darwin") {
  console.error("generate-callout-audio: macOS is required (say + afconvert).");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

for (const id of CALLOUT_IDS) {
  const phrase = PHRASES[id];
  const tmpAiff = join(tmpdir(), `callout-${id}-${process.pid}.aiff`);
  const outWav = join(outDir, `${id}.wav`);
  try {
    execFileSync("say", ["-r", "220", "-o", tmpAiff, phrase], {
      stdio: "inherit",
    });
    execFileSync(
      "afconvert",
      ["-f", "WAVE", "-d", "LEI16", tmpAiff, outWav],
      { stdio: "inherit" },
    );
    console.log(`Wrote ${outWav}`);
  } finally {
    if (existsSync(tmpAiff)) unlinkSync(tmpAiff);
  }
}

console.log("Done.");
