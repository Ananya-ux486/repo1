"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { releaseDocumentScroll } from "@/lib/scrollLock";
import { getPageScrollTop, setPageScrollTop } from "@/lib/pageScroll";

/** Clear stuck scroll locks on boot, route change, and after the page loader. */
export default function ScrollLock() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    releaseDocumentScroll();
    if (!window.location.hash && getPageScrollTop() > 0) {
      setPageScrollTop(0, "auto");
    }
  }, [pathname]);

  useEffect(() => {
    const restore = () => releaseDocumentScroll();
    window.addEventListener("tf-loader-done", restore);
    return () => window.removeEventListener("tf-loader-done", restore);
  }, []);

  return null;
}
