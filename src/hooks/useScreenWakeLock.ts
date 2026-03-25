import { useEffect } from 'react';

/**
 * Keeps the screen awake while mounted (e.g. during bag rounds).
 * Mirrors a reliable pattern: release when the document is hidden, re-acquire when visible.
 * Many browsers only grant wake lock with user activation; we also retry on pointerdown/touch
 * so the first tap during training can acquire after navigation consumed the prior gesture.
 */
export function useScreenWakeLock() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return undefined;
    }

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;
    let requestInFlight = false;

    const releaseLock = () => {
      if (!sentinel) return;
      const s = sentinel;
      sentinel = null;
      void s.release().catch(() => {});
    };

    const requestLock = async () => {
      if (cancelled || document.visibilityState !== 'visible') return;
      if (sentinel && !sentinel.released) return;
      if (requestInFlight) return;

      requestInFlight = true;
      try {
        const lock = await navigator.wakeLock.request('screen');
        if (cancelled) {
          await lock.release().catch(() => {});
          return;
        }
        sentinel = lock;
        lock.addEventListener('release', () => {
          if (sentinel === lock) sentinel = null;
        });
      } catch {
        // NotAllowedError (no user gesture), unsupported context, etc.
      } finally {
        requestInFlight = false;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestLock();
      } else {
        releaseLock();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void requestLock();
    };

    const onUserGesture = () => {
      void requestLock();
    };

    void requestLock();

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('pointerdown', onUserGesture, true);
    document.addEventListener('touchstart', onUserGesture, { capture: true, passive: true });

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('pointerdown', onUserGesture, true);
      document.removeEventListener('touchstart', onUserGesture, { capture: true });
      releaseLock();
    };
  }, []);
}
