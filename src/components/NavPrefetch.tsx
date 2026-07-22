"use client";

import { useEffect } from "react";

/**
 * Prefetch only when the user intends to navigate (hover / focus on internal links).
 * Avoids flooding the network with every route right after first paint.
 */
export default function NavPrefetch() {
  useEffect(() => {
    const warmed = new Set<string>();

    const warm = (href: string) => {
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;
        if (warmed.has(url.pathname)) return;
        warmed.add(url.pathname);

        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = url.pathname + url.search;
        link.as = "document";
        document.head.appendChild(link);
      } catch {
        /* ignore */
      }
    };

    const onIntent = (e: Event) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      warm(href);
    };

    document.addEventListener("pointerenter", onIntent, true);
    document.addEventListener("focusin", onIntent, true);
    return () => {
      document.removeEventListener("pointerenter", onIntent, true);
      document.removeEventListener("focusin", onIntent, true);
    };
  }, []);

  return null;
}
