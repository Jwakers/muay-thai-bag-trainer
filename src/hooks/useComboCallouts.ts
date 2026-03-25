import { useEffect, useRef } from "react";
import { CALLOUT_LABELS, type CalloutId } from "../data/callouts";

const CLIP_GAP_MS = 80;

function speakCallout(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof speechSynthesis === "undefined") {
      queueMicrotask(resolve);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.12;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function clampRepetitions(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(8, Math.max(1, Math.floor(n)));
}

function clampPauseSeconds(n: number): number {
  if (!Number.isFinite(n)) return 5;
  return Math.min(120, Math.max(1, Math.floor(n)));
}

/**
 * Plays bundled WAVs: full combo sequence, repeated with a pause between passes.
 * Uses HTMLAudioElement for broad WAV compatibility (e.g. 24-bit exports).
 */
export function useComboCallouts(
  calloutIds: readonly CalloutId[] | undefined,
  enabled: boolean,
  volume: number,
  comboRepetitions: number,
  repeatPauseSeconds: number,
): void {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const reps = clampRepetitions(comboRepetitions);
  const pauseMs = clampPauseSeconds(repeatPauseSeconds) * 1000;

  useEffect(() => {
    if (!enabled || volume <= 0 || !calloutIds?.length) return;

    let cancelled = false;
    currentAudioRef.current = null;

    const run = async () => {
      const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

      const playComboOnce = async () => {
        for (const id of calloutIds) {
          if (cancelled) break;
          const url = `${base}audio/${id}.wav`;

          const audio = new Audio();
          currentAudioRef.current = audio;
          audio.volume = volume;
          audio.preload = "auto";
          audio.src = url;

          const result = await new Promise<"ok" | "fail">((resolve) => {
            audio.addEventListener("ended", () => resolve("ok"), { once: true });
            audio.addEventListener("error", () => resolve("fail"), { once: true });
            void audio.play().catch(() => resolve("fail"));
          });

          currentAudioRef.current = null;

          if (cancelled) break;

          if (result === "fail") {
            await speakCallout(CALLOUT_LABELS[id]);
          } else {
            await delay(CLIP_GAP_MS);
          }
        }
      };

      for (let pass = 0; pass < reps; pass++) {
        if (cancelled) break;
        await playComboOnce();
        if (cancelled) break;
        if (pass < reps - 1) {
          await delay(pauseMs);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      const a = currentAudioRef.current;
      if (a) {
        a.pause();
        a.src = "";
        currentAudioRef.current = null;
      }
      if (typeof speechSynthesis !== "undefined") {
        speechSynthesis.cancel();
      }
    };
  }, [calloutIds, enabled, volume, reps, pauseMs]);
}
