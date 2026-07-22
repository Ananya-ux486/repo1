import { getPageScrollTop, setPageScrollTop } from "@/lib/pageScroll";

let lockCount = 0;
let lockedScrollY = 0;

/** Lock background scroll (modals / menus) via document/body. */
export function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  lockedScrollY = getPageScrollTop();
  const html = document.documentElement;
  html.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

/** Restore background scroll. */
export function unlockPageScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  setPageScrollTop(lockedScrollY, "auto");
}

/** Force-clear any stuck scroll locks (route changes, boot, loader done). */
export function releaseDocumentScroll() {
  lockCount = 0;

  document.documentElement.style.removeProperty("overflow");
  document.body.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("touch-action");
  document.body.style.removeProperty("touch-action");

  if (document.body.style.position === "fixed") {
    document.body.style.position = "";
    document.body.style.top = "";
  }
  document.body.style.removeProperty("left");
  document.body.style.removeProperty("right");
  document.body.style.removeProperty("width");

  // Clear any leftover nested-scroll locks from older builds.
  const legacy = document.getElementById("tf-page-scroll");
  if (legacy) {
    legacy.style.removeProperty("overflow");
    legacy.style.removeProperty("overflow-y");
    legacy.style.removeProperty("overflow-x");
    legacy.style.removeProperty("touch-action");
  }
}
