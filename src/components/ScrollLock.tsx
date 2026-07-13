"use client";

import { useEffect } from "react";
import { releaseDocumentScroll } from "@/lib/scrollLock";
import { getPageScrollTop, setPageScrollTop } from "@/lib/pageScroll";

/** Clear stuck scroll locks once on boot. Never hijack wheel/trackpad. */
export default function ScrollLock() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    releaseDocumentScroll();
    if (!window.location.hash && getPageScrollTop() > 0) {
      setPageScrollTop(0, "auto");
    }
  }, []);

  return null;
}
