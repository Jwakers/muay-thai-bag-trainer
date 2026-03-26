/** Bundled clips are `public/audio/countdown-{n}.wav` for n = 1…COUNTDOWN_MAX_SECONDS. */
export const COUNTDOWN_MAX_SECONDS = 10;

export const COUNTDOWN_CLIP_SECONDS: readonly number[] = Array.from(
  { length: COUNTDOWN_MAX_SECONDS },
  (_, i) => COUNTDOWN_MAX_SECONDS - i,
);
