let lockCount = 0;

/** Lock background scroll and pause Lenis smooth scroll (desktop). */
export function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  window.dispatchEvent(new Event("tf:lenis-stop"));
}

/** Restore background scroll and resume Lenis. */
export function unlockPageScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  window.dispatchEvent(new Event("tf:lenis-start"));
}

/** Force-clear any stuck scroll locks (mobile route changes, etc.). */
export function releaseDocumentScroll() {
  lockCount = 0;
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.documentElement.style.touchAction = "";
  document.body.style.touchAction = "";
  window.dispatchEvent(new Event("tf:lenis-start"));
}
