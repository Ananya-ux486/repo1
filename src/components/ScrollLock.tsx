"use client";

import { useEffect } from "react";

export default function ScrollLock() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    resetScroll();
    requestAnimationFrame(resetScroll);

    const onScroll = () => {
      if (window.scrollY < 0) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
