import { Button } from './Button';
import type { PwaInstallState } from '../hooks/usePwaInstall';

export interface PwaInstallBannerProps {
  pwa: PwaInstallState;
}

export function PwaInstallBanner({ pwa }: PwaInstallBannerProps) {
  const { deferredPrompt, isStandalone, isIos, bannerDismissed, dismissBanner, clearDeferredPrompt } = pwa;

  if (isStandalone || bannerDismissed) return null;

  const showChromiumInstall = deferredPrompt !== null;
  const showIosHint = !showChromiumInstall && isIos;

  if (!showChromiumInstall && !showIosHint) return null;

  const onInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
    } catch {
      /* ignore */
    }
    clearDeferredPrompt();
  };

  return (
    <div
      className="mb-6 rounded-lg border border-brand-outline-variant/30 bg-brand-surface-container-low/80 px-4 py-3"
      role="region"
      aria-label="Install app"
    >
      {showChromiumInstall ? (
        <p className="font-body text-sm text-brand-on-surface/90 mb-3">
          Install Muay Thai Bag Trainer for quick access from your home screen.
        </p>
      ) : (
        <p className="font-body text-sm text-brand-on-surface/90 mb-3">
          Add this app to your home screen: tap Share, then &quot;Add to Home Screen&quot;.
        </p>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        {showChromiumInstall ? (
          <Button type="button" variant="primary" className="py-2! px-4! text-sm" onClick={onInstallClick}>
            Install
          </Button>
        ) : null}
        <button
          type="button"
          className="font-label text-xs uppercase tracking-wide text-brand-outline hover:text-brand-on-surface px-2 py-1"
          onClick={dismissBanner}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
