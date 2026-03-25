/** 16-bit mono PCM WAV (silence) so pauses chain via `HTMLAudioElement` `ended` → `play()`, avoiding wall-clock `setTimeout` gaps that break autoplay in production Chrome. */

const SAMPLE_RATE = 44100;

export function buildSilentWavPcm16Mono(durationSec: number): ArrayBuffer {
  const n = Math.max(1, Math.floor(SAMPLE_RATE * Math.min(durationSec, 60)));
  const dataSize = n * 2;
  const buf = new ArrayBuffer(44 + dataSize);
  const v = new DataView(buf);
  let o = 0;
  const writeStr = (s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o++, s.charCodeAt(i));
  };
  writeStr("RIFF");
  v.setUint32(o, 36 + dataSize, true);
  o += 4;
  writeStr("WAVE");
  writeStr("fmt ");
  v.setUint32(o, 16, true);
  o += 4;
  v.setUint16(o, 1, true);
  o += 2;
  v.setUint16(o, 1, true);
  o += 2;
  v.setUint32(o, SAMPLE_RATE, true);
  o += 4;
  v.setUint32(o, SAMPLE_RATE * 2, true);
  o += 4;
  v.setUint16(o, 2, true);
  o += 2;
  v.setUint16(o, 16, true);
  o += 2;
  writeStr("data");
  v.setUint32(o, dataSize, true);
  o += 4;
  return buf;
}

/**
 * Play `durationMs` of silence in ≤60s chunks; each clip is started from the
 * previous element’s `ended` callback chain so autoplay policy stays satisfied.
 */
export async function playSilenceChain(
  durationMs: number,
  setCurrentAudio: (a: HTMLAudioElement | null) => void,
  isCancelled: () => boolean,
): Promise<void> {
  let remaining = durationMs;
  const maxChunkMs = 60_000;

  while (remaining > 0 && !isCancelled()) {
    const chunkMs = Math.min(maxChunkMs, remaining);
    const ab = buildSilentWavPcm16Mono(chunkMs / 1000);
    const url = URL.createObjectURL(new Blob([ab], { type: "audio/wav" }));
    const audio = new Audio();
    setCurrentAudio(audio);
    audio.volume = 0.0001;
    audio.src = url;
    try {
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        audio.addEventListener("ended", done, { once: true });
        audio.addEventListener("error", done, { once: true });
        void audio.play().catch(done);
      });
    } finally {
      URL.revokeObjectURL(url);
      setCurrentAudio(null);
    }
    remaining -= chunkMs;
  }
}
