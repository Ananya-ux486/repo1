"use client";

/** Native scroll only — Lenis RAF loop removed for smoother FPS on all devices.
 * Hash deep-links still work via HashScroll + scrollIntoView.
 * Section / Framer Motion animations are unchanged.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
