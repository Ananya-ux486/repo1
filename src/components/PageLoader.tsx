"use client";

import { useEffect } from "react";
import { releaseDocumentScroll } from "@/lib/scrollLock";

/** Instant boot — no full-screen animation blocking first paint / navigation. */
export default function PageLoader() {
  useEffect(() => {
    const body = document.body;
    body.dataset.tfLoading = "done";
    releaseDocumentScroll();
    window.dispatchEvent(new CustomEvent("tf-loader-done"));
  }, []);

  return null;
}
