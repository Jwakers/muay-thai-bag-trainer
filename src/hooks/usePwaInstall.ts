import { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

const DISMISS_KEY = 'pwa-install-banner-dismissed';

function getIsStandalone(): boolean {
  const mq = window.matchMedia('(display-mode: standalone)');
  if (mq.matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return Boolean(nav.standalone);
}

function isIosDevice(): boolean {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

export interface PwaInstallState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  isIos: boolean;
  bannerDismissed: boolean;
  dismissBanner: () => void;
  clearDeferredPrompt: () => void;
}

export function usePwaInstall(): PwaInstallState {
  const isNativePlatform = Capacitor.isNativePlatform();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(() => isNativePlatform || getIsStandalone());
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const dismissBanner = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setBannerDismissed(true);
  }, []);

  const clearDeferredPrompt = useCallback(() => {
    setDeferredPrompt(null);
  }, []);

  useEffect(() => {
    if (isNativePlatform) {
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
    };

    const mq = window.matchMedia('(display-mode: standalone)');
    const onDisplayModeChange = () => setIsStandalone(getIsStandalone());

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    mq.addEventListener('change', onDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      mq.removeEventListener('change', onDisplayModeChange);
    };
  }, [isNativePlatform]);

  return {
    deferredPrompt,
    isStandalone,
    isIos: isIosDevice(),
    bannerDismissed,
    dismissBanner,
    clearDeferredPrompt,
  };
}
