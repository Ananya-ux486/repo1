"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HEADER_OFFSET = -112;

function scrollToHash(hash: string, retries = 12) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) {
    if (retries > 0) {
      window.setTimeout(() => scrollToHash(hash, retries - 1), 80);
    }
    return;
  }

  const lenis = window.__tfLenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Scrolls to #hash targets after client navigations (footer / nav deep links). */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      const { hash } = window.location;
      if (hash) scrollToHash(hash);
    };

    const t = window.setTimeout(run, 60);
    window.addEventListener("hashchange", run);
    window.addEventListener("tf-loader-done", run);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", run);
      window.removeEventListener("tf-loader-done", run);
    };
  }, [pathname]);

  return null;
}
