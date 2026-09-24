'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share2, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register PWA Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[PWA] Service worker registration error:', err);
      });
    }

    // 2. Check if already installed & running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 3. Detect iOS/iPadOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIosDevice);

    // 4. Check if user already dismissed during this session
    const isDismissed = sessionStorage.getItem('dcampus_pwa_prompt_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }

    // 5. Listen for Android/Chrome/Edge native beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('dcampus_pwa_prompt_dismissed', 'true');
  };

  // Do not show if already in standalone app mode or dismissed
  if (isStandalone || dismissed) {
    return null;
  }

  // Show Android/Chrome Native Prompt
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-18 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-96 z-50">
        <div className="retro-card overflow-hidden border-2 border-[#fbbf24] shadow-[4px_4px_0px_#000000] bg-[#13171f]">
          <div className="retro-card-header py-1.5 px-3 bg-[#fbbf24] text-[#000000]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-black">
              <Smartphone size={13} className="stroke-[2.5]" />
              <span>INSTALL D-CAMPUS APP</span>
            </div>
            <button
              onClick={handleDismiss}
              className="hover:opacity-75 text-[#000000] p-0.5"
              title="Dismiss"
            >
              <X size={14} className="stroke-[2.5]" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            <p className="font-mono text-xs text-[#f8fafc] leading-snug">
              Install D-Campus to your Home Screen for instant zero-CAPTCHA access, offline cache, and full-screen experience.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 btn-retro btn-retro-gold py-1.5 text-xs flex items-center justify-center gap-1.5 font-black"
              >
                <Download size={13} className="stroke-[2.5]" />
                <span>ADD TO HOME SCREEN</span>
              </button>
              <button
                onClick={handleDismiss}
                className="btn-retro px-3 py-1.5 text-xs text-[#94a3b8]"
              >
                LATER
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show iOS Safari Step-by-Step Prompt
  if (isIOS) {
    return (
      <div className="fixed bottom-18 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-96 z-50">
        <div className="retro-card overflow-hidden border-2 border-[#06b6d4] shadow-[4px_4px_0px_#000000] bg-[#13171f]">
          <div className="retro-card-header py-1.5 px-3 bg-[#06b6d4] text-[#000000]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-black">
              <Smartphone size={13} className="stroke-[2.5]" />
              <span>INSTALL ON IOS / IPAD</span>
            </div>
            <button
              onClick={handleDismiss}
              className="hover:opacity-75 text-[#000000] p-0.5"
              title="Dismiss"
            >
              <X size={14} className="stroke-[2.5]" />
            </button>
          </div>

          <div className="p-3 space-y-2 font-mono text-xs text-[#f8fafc]">
            <p className="leading-snug">
              To install this app on your iPhone or iPad:
            </p>
            <div className="retro-inset p-2 space-y-1 text-[11px] text-[#94a3b8]">
              <div className="flex items-center gap-1.5 text-[#f8fafc]">
                <span>1. Tap Safari's</span>
                <span className="inline-flex items-center gap-0.5 bg-[#2d3545] px-1.5 py-0.5 rounded text-[10px] text-[#fbbf24] font-bold">
                  <Share2 size={11} /> Share
                </span>
                <span>button</span>
              </div>
              <div>2. Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> (+)</div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full btn-retro py-1.5 text-xs text-[#06b6d4]"
            >
              GOT IT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
