/** Native document scroll root (browser scrollbar + trackpad). */
export const PAGE_SCROLL_ID = "tf-page-scroll";

export function getPageScroller(): HTMLElement {
  if (typeof document === "undefined") {
    return null as unknown as HTMLElement;
  }
  return (
    (document.scrollingElement as HTMLElement) || document.documentElement
  );
}

export function getPageScrollTop(): number {
  if (typeof window === "undefined") return 0;
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function setPageScrollTop(top: number, behavior: ScrollBehavior = "auto") {
  if (typeof window === "undefined") return;
  window.scrollTo({ top, behavior });
}
