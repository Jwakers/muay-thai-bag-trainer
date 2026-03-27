import { useEffect, useRef } from "react";
import type { PluginListenerHandle } from "@capacitor/core";
import { Capacitor } from "@capacitor/core";
import { NativeAudio } from "@capacitor-community/native-audio";
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

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Plays bundled callout WAVs via Capacitor native audio in native apps only.
 * Web intentionally short-circuits (callouts are app-only for now).
 */
export function useComboCallouts(
  calloutIds: readonly CalloutId[] | undefined,
  enabled: boolean,
  volume: number,
  comboRepetitions: number,
  repeatPauseSeconds: number,
): void {
  const completeListenerRef = useRef<PluginListenerHandle | null>(null);

  const reps = clampRepetitions(comboRepetitions);
  const pauseMs = clampPauseSeconds(repeatPauseSeconds) * 1000;
  const calloutIdsKey = calloutIds?.join("|") ?? "";

  useEffect(() => {
    if (!enabled || volume <= 0 || !calloutIdsKey) return;
    if (!Capacitor.isNativePlatform()) return;
    const ids = calloutIdsKey.split("|").filter(isCalloutId);
    if (!ids.length) return;

    let cancelled = false;
    const pendingResolvers = new Map<string, () => void>();
    const loadedIds = new Set<string>();

    const clearPending = (assetId: string) => {
      const resolve = pendingResolvers.get(assetId);
      if (resolve) {
        resolve();
        pendingResolvers.delete(assetId);
      }
    };

    const preloadIds = async () => {
      for (const id of new Set(ids)) {
        if (cancelled) break;
        const candidatePaths = [
          `audio/${id}.wav`,
          `public/audio/${id}.wav`,
          `${id}.wav`,
        ];
        let preloaded = false;
        for (const assetPath of candidatePaths) {
          try {
            await NativeAudio.preload({
              assetId: id,
              assetPath,
              volume,
            });
            preloaded = true;
            break;
          } catch {
            // Try the next bundle-relative path candidate.
          }
        }
        if (preloaded) {
          loadedIds.add(id);
        } else {
          console.warn(`Callout clip failed to preload: ${id}`);
        }
      }
    };

    const ensureListener = async () => {
      completeListenerRef.current = await NativeAudio.addListener(
        "complete",
        ({ assetId }) => {
          clearPending(assetId);
        },
      );
    };

    const playSingle = async (id: string) => {
      if (cancelled || !loadedIds.has(id)) return;
      try {
        await NativeAudio.setVolume({ assetId: id, volume });
      } catch {
        // Ignore volume updates if platform audio session rejects it.
      }

      await new Promise<void>((resolve) => {
        pendingResolvers.set(id, resolve);
        void NativeAudio.play({ assetId: id })
          .then(async () => {
            // Fallback in case complete event does not fire on a device build.
            const { duration } = await NativeAudio.getDuration({ assetId: id });
            const durationMs = Math.max(250, Math.ceil(duration * 1000) + 250);
            await waitMs(durationMs);
            clearPending(id);
          })
          .catch((err) => {
            console.warn(`Callout clip failed to play: ${id}`, err);
            clearPending(id);
          });
      });
    };

    const run = async () => {
      await preloadIds();
      if (cancelled || loadedIds.size === 0) return;
      await ensureListener();
      if (cancelled) return;

      const playComboOnce = async () => {
        for (const id of ids) {
          if (cancelled) break;
          await playSingle(id);
          if (!cancelled) await waitMs(CLIP_GAP_MS);
        }
      };

      for (let pass = 0; pass < reps; pass++) {
        if (cancelled) break;
        await playComboOnce();
        if (cancelled) break;
        if (pass < reps - 1) {
          await waitMs(pauseMs);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      for (const resolve of pendingResolvers.values()) resolve();
      pendingResolvers.clear();
      for (const id of loadedIds) {
        void NativeAudio.stop({ assetId: id }).catch(() => {});
        void NativeAudio.unload({ assetId: id }).catch(() => {});
      }
      void completeListenerRef.current?.remove();
      completeListenerRef.current = null;
    };
  }, [calloutIdsKey, enabled, volume, reps, pauseMs]);
}
