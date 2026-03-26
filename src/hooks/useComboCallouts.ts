import { useEffect, useRef } from "react";
import { playSilenceChain } from "../audio/silentWav";
import { isCalloutId, type CalloutId } from "../data/callouts";

const CLIP_GAP_MS = 90;

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
  const calloutIdsKey = calloutIds?.join("|") ?? "";

  useEffect(() => {
    if (!enabled || volume <= 0 || !calloutIdsKey) return;
    const ids = calloutIdsKey.split("|").filter(isCalloutId);
    if (!ids.length) return;

    let cancelled = false;
    currentAudioRef.current = null;
    const isCancelled = () => cancelled;
    const setCurrentAudio = (a: HTMLAudioElement | null) => {
      currentAudioRef.current = a;
    };

    const run = async () => {
      const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

      const playComboOnce = async () => {
        for (const id of ids) {
          if (cancelled) break;
          const url = `${base}audio/${id}.wav`;

          const audio = new Audio();
          currentAudioRef.current = audio;
          audio.volume = volume;
          audio.preload = "auto";
          audio.src = url;

          await new Promise<"ok" | "fail">((resolve) => {
            audio.addEventListener("ended", () => resolve("ok"), {
              once: true,
            });
            audio.addEventListener("error", () => resolve("fail"), {
              once: true,
            });
            void audio.play().catch(() => resolve("fail"));
          });

          currentAudioRef.current = null;

          if (cancelled) break;

          await playSilenceChain(CLIP_GAP_MS, setCurrentAudio, isCancelled);
        }
      };

      for (let pass = 0; pass < reps; pass++) {
        if (cancelled) break;
        await playComboOnce();
        if (cancelled) break;
        if (pass < reps - 1) {
          // Wall-clock delay breaks Chrome autoplay after ~few seconds; chain
          // silent WAV clips so each play() follows the previous media `ended`.
          await playSilenceChain(pauseMs, setCurrentAudio, isCancelled);
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
    };
  }, [calloutIdsKey, enabled, volume, reps, pauseMs]);
}
