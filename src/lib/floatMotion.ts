/** Smooth float easing — same curve, snappier defaults for perceived speed */
export const floatEase = [0.16, 1, 0.3, 1] as const;

export const floatTransition = (delay = 0, duration = 0.55) => ({
  duration,
  delay,
  ease: floatEase,
});

export const floatStagger = (index: number, step = 0.05, base = 0.04) =>
  base + index * step;
