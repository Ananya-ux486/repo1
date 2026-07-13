"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __tfLenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let lenis: Lenis | null = null;
    let started = false;

    const start = () => {
      if (!mq.matches || lenis) return;

      lenis = new Lenis({
        duration: 0.7,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        autoRaf: true,
      });
      window.__tfLenis = lenis;

      const onVisibility = () => {
        if (document.hidden) lenis?.stop();
        else lenis?.start();
      };

      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        if (window.__tfLenis === lenis) window.__tfLenis = undefined;
      };
    };

    let cleanupVisibility: (() => void) | undefined;

    const tryStart = () => {
      if (started) return;
      started = true;
      cleanupVisibility = start();
    };

    const onLenisStop = () => lenis?.stop();
    const onLenisStart = () => lenis?.start();

    window.addEventListener("tf:lenis-stop", onLenisStop);
    window.addEventListener("tf:lenis-start", onLenisStart);

    const boot = () => {
      if (document.body.dataset.tfLoading === "done") {
        tryStart();
      } else {
        window.addEventListener("tf-loader-done", tryStart, { once: true });
      }
    };

    boot();

    const onChange = () => {
      lenis?.destroy();
      lenis = null;
      started = false;
      cleanupVisibility?.();
      cleanupVisibility = undefined;
      tryStart();
    };

    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("tf-loader-done", tryStart);
      window.removeEventListener("tf:lenis-stop", onLenisStop);
      window.removeEventListener("tf:lenis-start", onLenisStart);
      cleanupVisibility?.();
      if (window.__tfLenis === lenis) window.__tfLenis = undefined;
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
