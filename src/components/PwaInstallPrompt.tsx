'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share2, X, Smartphone, MoreVertical, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    // 1. Register PWA Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[PWA] Service worker registration error:', err);
      });
    }

    // 2. Check if already installed & running in standalone mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

    setIsStandalone(isStandaloneMode);

    // 3. Detect iOS / iPadOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIosDevice);

    // 4. Check session dismissal
    const isDismissed = sessionStorage.getItem('dcampus_pwa_prompt_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }

    // 5. Capture native beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Mount after brief delay for smooth appearance
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1200);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setDismissed(true);
        }
      } catch (err) {
        console.warn('[PWA] Prompt error:', err);
        setShowManualGuide(true);
      }
    } else {
      // If browser doesn't support or hasn't fired beforeinstallprompt yet, show guide
      setShowManualGuide(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('dcampus_pwa_prompt_dismissed', 'true');
  };

  // Do not show if unmounted, in standalone mode, or dismissed
  if (!mounted || isStandalone || dismissed) {
    return null;
  }

  return (
    <aside 
      aria-label="PWA Installation Prompt"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-5 sm:w-96 z-[9999]"
    >
      <div className="retro-card overflow-hidden border-2 border-[#fbbf24] shadow-[4px_4px_0px_#000000] bg-[#13171f] animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Titlebar Header */}
        <div className="retro-card-header py-1.5 px-3 bg-[#fbbf24] text-[#000000] select-none">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-black">
            <Smartphone size={13} className="stroke-[2.5]" />
            <span>INSTALL D-CAMPUS APP</span>
          </div>
          <button
            onClick={handleDismiss}
            className="hover:bg-[#000000]/10 p-0.5 rounded text-[#000000] transition-colors"
            title="Dismiss for this session"
          >
            <X size={14} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 space-y-2.5 font-mono">
          {!showManualGuide && !isIOS ? (
            <>
              <p className="text-xs text-[#f8fafc] leading-snug">
                Install D-Campus directly to your Home Screen for instant zero-CAPTCHA launch, full-screen view, and offline support.
              </p>
              <div className="flex items-center gap-2 pt-0.5">
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
            </>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Instructions */
            <div className="space-y-2">
              <p className="text-xs text-[#f8fafc] leading-snug">
                Install on your iPhone or iPad:
              </p>
              <div className="retro-inset p-2.5 space-y-1.5 text-[11px] text-[#94a3b8]">
                <div className="flex items-center gap-1.5 text-[#f8fafc]">
                  <span>1. Tap Safari&apos;s</span>
                  <span className="inline-flex items-center gap-1 bg-[#2d3545] px-1.5 py-0.5 rounded text-[10px] text-[#fbbf24] font-bold">
                    <Share2 size={11} /> Share
                  </span>
                  <span>button below</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#f8fafc]">
                  <span>2. Scroll down &amp; tap</span>
                  <strong className="text-[#10b981]">&ldquo;Add to Home Screen&rdquo;</strong>
                  <span>(+)</span>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full btn-retro btn-retro-cyan py-1.5 text-xs font-black flex items-center justify-center gap-1"
              >
                <CheckCircle size={12} />
                <span>GOT IT</span>
              </button>
            </div>
          ) : (
            /* Android / Mobile Browser Manual Fallback Instructions */
            <div className="space-y-2">
              <p className="text-xs text-[#f8fafc] leading-snug">
                To install D-Campus from your browser menu:
              </p>
              <div className="retro-inset p-2.5 space-y-1.5 text-[11px] text-[#94a3b8]">
                <div className="flex items-center gap-1.5 text-[#f8fafc]">
                  <span>1. Tap your browser&apos;s</span>
                  <span className="inline-flex items-center gap-0.5 bg-[#2d3545] px-1.5 py-0.5 rounded text-[10px] text-[#fbbf24] font-bold">
                    <MoreVertical size={11} /> 3 Dots Menu
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#f8fafc]">
                  <span>2. Select</span>
                  <strong className="text-[#10b981]">&ldquo;Install App&rdquo;</strong>
                  <span>or</span>
                  <strong className="text-[#10b981]">&ldquo;Add to Home screen&rdquo;</strong>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full btn-retro btn-retro-cyan py-1.5 text-xs font-black flex items-center justify-center gap-1"
              >
                <CheckCircle size={12} />
                <span>UNDERSTOOD</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
