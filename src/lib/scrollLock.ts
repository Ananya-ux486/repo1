import { getPageScrollTop, getPageScroller, setPageScrollTop } from "@/lib/pageScroll";

let lockCount = 0;
let lockedScrollY = 0;

/** Lock background scroll (modals / menus). */
export function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  lockedScrollY = getPageScrollTop();
  const scroller = getPageScroller();
  if (scroller?.id === "tf-page-scroll") {
    scroller.style.overflow = "hidden";
    scroller.style.touchAction = "none";
    return;
  }

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

  const scroller = getPageScroller();
  if (scroller?.id === "tf-page-scroll") {
    scroller.style.overflow = "";
    scroller.style.touchAction = "";
    setPageScrollTop(lockedScrollY, "auto");
    return;
  }

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, lockedScrollY);
}

/** Force-clear any stuck scroll locks (route changes, boot, etc.). */
export function releaseDocumentScroll() {
  lockCount = 0;
  const scroller =
    typeof document !== "undefined" ? document.getElementById("tf-page-scroll") : null;
  if (scroller) {
    scroller.style.overflow = "";
    scroller.style.touchAction = "";
  }
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.documentElement.style.touchAction = "";
  document.body.style.touchAction = "";
}
