import { useEffect } from "react";
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
  const reps = clampRepetitions(comboRepetitions);
  const pauseMs = clampPauseSeconds(repeatPauseSeconds) * 1000;
  const calloutIdsKey = calloutIds?.join("|") ?? "";

  useEffect(() => {
    if (!enabled || volume <= 0 || !calloutIdsKey) return;
    if (!Capacitor.isNativePlatform()) return;
    const ids = calloutIdsKey.split("|").filter(isCalloutId);
    if (!ids.length) return;

    let cancelled = false;
    let playInstanceCounter = 0;
    const pendingByInstance = new Map<
      string,
      {
        assetId: string;
        resolve: () => void;
        timeoutId: ReturnType<typeof setTimeout> | null;
      }
    >();
    const latestInstanceByAsset = new Map<string, string>();
    const loadedIds = new Set<string>();
    let completeListener: PluginListenerHandle | null = null;

    const clearPendingByInstance = (playInstanceId: string) => {
      const pending = pendingByInstance.get(playInstanceId);
      if (!pending) return;
      if (pending.timeoutId) {
        clearTimeout(pending.timeoutId);
      }
      const activeForAsset = latestInstanceByAsset.get(pending.assetId);
      if (activeForAsset === playInstanceId) {
        latestInstanceByAsset.delete(pending.assetId);
      }
      pendingByInstance.delete(playInstanceId);
      pending.resolve();
    };

    const clearPendingForAsset = (assetId: string) => {
      const playInstanceId = latestInstanceByAsset.get(assetId);
      if (!playInstanceId) return;
      clearPendingByInstance(playInstanceId);
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
      completeListener = await NativeAudio.addListener(
        "complete",
        ({ assetId }) => {
          clearPendingForAsset(assetId);
        },
      );
      if (cancelled) {
        await completeListener.remove();
        completeListener = null;
      }
    };

    const playSingle = async (id: string) => {
      if (cancelled || !loadedIds.has(id)) return;
      try {
        await NativeAudio.setVolume({ assetId: id, volume });
      } catch {
        // Ignore volume updates if platform audio session rejects it.
      }

      await new Promise<void>((resolve) => {
        clearPendingForAsset(id);
        const playInstanceId = `${id}-${++playInstanceCounter}`;
        pendingByInstance.set(playInstanceId, {
          assetId: id,
          resolve,
          timeoutId: null,
        });
        latestInstanceByAsset.set(id, playInstanceId);
        void NativeAudio.play({ assetId: id })
          .then(async () => {
            if (!pendingByInstance.has(playInstanceId)) return;
            // Fallback in case complete event does not fire on a device build.
            const { duration } = await NativeAudio.getDuration({ assetId: id });
            const durationMs = Math.max(250, Math.ceil(duration * 1000) + 250);
            const timeoutId = setTimeout(() => {
              clearPendingByInstance(playInstanceId);
            }, durationMs);
            const pending = pendingByInstance.get(playInstanceId);
            if (!pending) {
              clearTimeout(timeoutId);
              return;
            }
            pending.timeoutId = timeoutId;
          })
          .catch((err) => {
            console.warn(`Callout clip failed to play: ${id}`, err);
            clearPendingByInstance(playInstanceId);
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
      for (const playInstanceId of pendingByInstance.keys()) {
        clearPendingByInstance(playInstanceId);
      }
      latestInstanceByAsset.clear();
      for (const id of loadedIds) {
        void NativeAudio.stop({ assetId: id }).catch(() => {});
        void NativeAudio.unload({ assetId: id }).catch(() => {});
      }
      void completeListener?.remove();
      completeListener = null;
    };
  }, [calloutIdsKey, enabled, volume, reps, pauseMs]);
}
