"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Thin top bar so client navigations feel instant while the next page loads. */
export default function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      try {
        sessionStorage.setItem("tf-skip-loader", "1");
      } catch {
        /* private mode */
      }

      setActive(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[10000] h-[2.5px] overflow-hidden"
      aria-hidden
    >
      <div className="tf-route-progress h-full w-full origin-left bg-gradient-to-r from-cyan-400 via-brand to-indigo-500" />
    </div>
  );
}
