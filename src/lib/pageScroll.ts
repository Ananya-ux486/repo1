/** The real page scrollport — nested overflow-y:auto (same model as language list). */
export const PAGE_SCROLL_ID = "tf-page-scroll";

export function getPageScroller(): HTMLElement {
  if (typeof document === "undefined") {
    return null as unknown as HTMLElement;
  }
  return (
    document.getElementById(PAGE_SCROLL_ID) ||
    (document.scrollingElement as HTMLElement) ||
    document.documentElement
  );
}

export function getPageScrollTop(): number {
  const el = getPageScroller();
  return el?.scrollTop ?? window.scrollY ?? 0;
}

export function setPageScrollTop(top: number, behavior: ScrollBehavior = "auto") {
  const el = getPageScroller();
  if (el && el.id === PAGE_SCROLL_ID) {
    el.scrollTo({ top, behavior });
    return;
  }
  window.scrollTo({ top, behavior });
}
