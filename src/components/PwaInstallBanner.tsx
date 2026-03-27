import type { PwaInstallState } from "../hooks/usePwaInstall";
import { Button } from "./Button";

export interface NativeAudioStoreLinks {
  ios?: string;
  android?: string;
}

export interface PwaInstallBannerProps {
  pwa: PwaInstallState;
  context?: "pwa" | "native-audio";
  appStoreUrls?: NativeAudioStoreLinks;
}

export function PwaInstallBanner({
  pwa,
  context = "pwa",
  appStoreUrls,
}: PwaInstallBannerProps) {
  const {
    deferredPrompt,
    isStandalone,
    isIos,
    bannerDismissed,
    dismissBanner,
    clearDeferredPrompt,
  } = pwa;

  if (isStandalone || bannerDismissed) return null;

  const showChromiumInstall = deferredPrompt !== null;
  const showIosHint = !showChromiumInstall && isIos;
  const showStoreLinks = Boolean(appStoreUrls?.ios || appStoreUrls?.android);
  const isNativeAudioContext = context === "native-audio";

  if (!showChromiumInstall && !showIosHint && !isNativeAudioContext)
    return null;

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
      {isNativeAudioContext ? (
        <p className="font-body text-sm text-brand-on-surface/90 mb-3">
          Native audio requires an iOS or Android app. Home screen/browser
          install does not enable native audio features.
        </p>
      ) : showChromiumInstall ? (
        <p className="font-body text-sm text-brand-on-surface/90 mb-3">
          Install Muay Thai Bag Trainer for quick access from your home screen.
        </p>
      ) : (
        <p className="font-body text-sm text-brand-on-surface/90 mb-3">
          Add this app to your home screen: tap Share, then &quot;Add to Home
          Screen&quot;.
        </p>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        {showStoreLinks ? (
          <>
            {appStoreUrls?.ios ? (
              <a
                href={appStoreUrls.ios}
                target="_blank"
                rel="noreferrer"
                className="font-label text-xs uppercase tracking-wide px-2 py-1 text-brand-on-surface hover:text-brand-primary"
              >
                App Store
              </a>
            ) : null}
            {appStoreUrls?.android ? (
              <a
                href={appStoreUrls.android}
                target="_blank"
                rel="noreferrer"
                className="font-label text-xs uppercase tracking-wide px-2 py-1 text-brand-on-surface hover:text-brand-primary"
              >
                Play Store
              </a>
            ) : null}
          </>
        ) : null}
        {showChromiumInstall && !isNativeAudioContext ? (
          <Button
            type="button"
            variant="primary"
            className="py-2! px-4! text-sm"
            onClick={onInstallClick}
          >
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
