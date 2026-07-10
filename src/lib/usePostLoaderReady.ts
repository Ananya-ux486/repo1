"use client";

import { useEffect, useState } from "react";

/** Mount heavy client widgets after the page loader finishes (or idle timeout). */
export function usePostLoaderReady(extraDelayMs = 0) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId = 0;
    let timeoutId = 0;

    const activate = () => {
      if (cancelled) return;

      const run = () => {
        if (!cancelled) setReady(true);
      };

      if (extraDelayMs > 0) {
        timeoutId = window.setTimeout(run, extraDelayMs);
        return;
      }

      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(run, { timeout: 1800 });
      } else {
        timeoutId = window.setTimeout(run, 600);
      }
    };

    if (document.body.dataset.tfLoading === "done") {
      activate();
    } else {
      window.addEventListener("tf-loader-done", activate, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [extraDelayMs]);

  return ready;
}
