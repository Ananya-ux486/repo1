/** Buzzworthy-style smooth float easing */
export const floatEase = [0.16, 1, 0.3, 1] as const;

export const floatTransition = (delay = 0, duration = 0.75) => ({
  duration,
  delay,
  ease: floatEase,
});

export const floatStagger = (index: number, step = 0.07, base = 0.08) =>
  base + index * step;
