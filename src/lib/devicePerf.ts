/** Lightweight hints for tuning render cost on weak devices (animations unchanged). */
export function isLowSpecDevice(): boolean {
  if (typeof window === "undefined") return false;

  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  if (mem !== undefined && mem <= 4) return true;
  if (cores <= 4 && narrow) return true;
  if (coarse && narrow && cores <= 6) return true;

  return false;
}

export function pdfMaxScale(viewportW: number): number {
  const low = isLowSpecDevice();
  if (viewportW < 768) return low ? 1.0 : 1.45;
  return low ? 1.55 : 2.4;
}

export function pdfLayoutWidth(
  viewportW: number,
  containerWidth: number,
): number {
  const low = isLowSpecDevice();
  if (viewportW < 768) {
    const factor = low ? 1.25 : 1.7;
    const minW = low ? 480 : 620;
    const maxW = low ? 640 : 820;
    return Math.min(maxW, Math.max(containerWidth * factor, minW));
  }
  return containerWidth;
}
