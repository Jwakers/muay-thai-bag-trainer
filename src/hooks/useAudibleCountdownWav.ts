import { useEffect, useState } from "react";
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
  const [loadedIds, setLoadedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (lastSeconds <= 0 || volume <= 0) return;

    let cancelled = false;
    const loadedInRun = new Set<string>();
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
            loadedInRun.add(id);
            setLoadedIds((prev) => {
              if (prev.has(id)) return prev;
              const next = new Set(prev);
              next.add(id);
              return next;
            });
            break;
          } catch {
            // Try next path candidate.
          }
        }
      }
    };

    void preload();

    return () => {
      cancelled = true;
      for (const id of loadedInRun) {
        void NativeAudio.stop({ assetId: id }).catch(() => {});
        void NativeAudio.unload({ assetId: id }).catch(() => {});
      }
      setLoadedIds((prev) => {
        if (prev.size === 0 || loadedInRun.size === 0) return prev;
        const next = new Set(prev);
        for (const id of loadedInRun) next.delete(id);
        return next;
      });
    };
  }, [lastSeconds, volume]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (lastSeconds <= 0 || volume <= 0) return;
    const cap = Math.min(lastSeconds, COUNTDOWN_MAX_SECONDS);
    if (secondsLeft < 1 || secondsLeft > cap) return;

    const assetId = `countdown-${secondsLeft}`;
    if (!loadedIds.has(assetId)) return;
    void NativeAudio.setVolume({ assetId, volume }).catch(() => {});
    void NativeAudio.play({ assetId }).catch(() => {});
  }, [secondsLeft, lastSeconds, volume, loadedIds]);
}
