#!/usr/bin/env node
/**
 * Builds `public/audio/{id}.wav` from macOS `say` + `afconvert`.
 * Re-run after changing phrases or adding CalloutId values.
 *
 * Usage: pnpm run generate:callouts
 * Requires: macOS (say, afconvert)
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const outDir = join(__dirname, "../public/audio");

/** Spoken text per clip id — keep in sync with `src/data/callouts.ts`. */
const PHRASES = {
  jab: "Jab!",
  cross: "Cross!",
  leadHook: "Lead hook!",
  rearLowKick: "Rear low kick!",
  doubleJab: "Double jab!",
  switchKick: "Switch kick!",
  rearRoundhouse: "Rear roundhouse!",
  leadTeep: "Lead teep!",
  rearBodyKick: "Rear body kick!",
  rearKnee: "Rear knee!",
  rearTeep: "Rear teep!",
};

if (process.platform !== "darwin") {
  console.error("generate-callout-audio: macOS is required (say + afconvert).");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

for (const [id, phrase] of Object.entries(PHRASES)) {
  const tmpAiff = join(tmpdir(), `callout-${id}-${process.pid}.aiff`);
  const outWav = join(outDir, `${id}.wav`);
  try {
    execFileSync(
      "say",
      ["-r", "220", "-o", tmpAiff, phrase],
      { stdio: "inherit" },
    );
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
