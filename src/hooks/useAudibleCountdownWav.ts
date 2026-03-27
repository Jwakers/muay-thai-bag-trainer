import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { NativeAudio } from "@capacitor-community/native-audio";
import { COUNTDOWN_MAX_SECONDS } from "../data/countdownAudio";

/**
 * Plays bundled countdown WAVs for the last `lastSeconds` of a timer (capped at
 * {@link COUNTDOWN_MAX_SECONDS}) via native audio on native platforms only.
 */
export function useAudibleCountdownWav(
  secondsLeft: number,
  lastSeconds: number,
  volume: number,
): void {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (lastSeconds <= 0 || volume <= 0) return;

    let cancelled = false;
    const clipIds = Array.from(
      { length: COUNTDOWN_MAX_SECONDS },
      (_, i) => `countdown-${i + 1}`,
    );

    const preload = async () => {
      for (const id of clipIds) {
        if (cancelled) break;
        const candidatePaths = [
          `audio/${id}.wav`,
          `public/audio/${id}.wav`,
          `${id}.wav`,
        ];
        for (const assetPath of candidatePaths) {
          try {
            await NativeAudio.preload({ assetId: id, assetPath, volume });
            break;
          } catch {
            // Try next path candidate.
          }
        }
      }
      loadedRef.current = !cancelled;
    };

    void preload();

    return () => {
      cancelled = true;
      loadedRef.current = false;
      for (const id of clipIds) {
        void NativeAudio.stop({ assetId: id }).catch(() => {});
        void NativeAudio.unload({ assetId: id }).catch(() => {});
      }
    };
  }, [lastSeconds, volume]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (!loadedRef.current) return;
    if (lastSeconds <= 0 || volume <= 0) return;
    const cap = Math.min(lastSeconds, COUNTDOWN_MAX_SECONDS);
    if (secondsLeft < 1 || secondsLeft > cap) return;

    const assetId = `countdown-${secondsLeft}`;
    void NativeAudio.setVolume({ assetId, volume }).catch(() => {});
    void NativeAudio.play({ assetId }).catch(() => {});
  }, [secondsLeft, lastSeconds, volume]);
}
