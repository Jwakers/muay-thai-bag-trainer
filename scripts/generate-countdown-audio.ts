#!/usr/bin/env -S npx tsx
/**
 * Builds `public/audio/countdown-{n}.wav` for n = 1…10 via macOS `say` + `afconvert`.
 * Phrases match seconds left (e.g. "10!" … "1!"), same style as combo callouts.
 *
 * Usage: npm run generate:countdown
 * Requires: macOS (say, afconvert)
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTDOWN_CLIP_SECONDS } from "../src/data/countdownAudio";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const outDir = join(__dirname, "../public/audio");

if (process.platform !== "darwin") {
  console.error(
    "generate-countdown-audio: macOS is required (say + afconvert).",
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

for (const n of COUNTDOWN_CLIP_SECONDS) {
  const phrase = `${n}!`;
  const tmpAiff = join(tmpdir(), `countdown-${n}-${process.pid}.aiff`);
  const outWav = join(outDir, `countdown-${n}.wav`);
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
