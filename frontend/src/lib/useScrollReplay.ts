"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Options = {
  amount?: number;
  /** When false, no IntersectionObserver work and play stays false until driven externally. */
  enabled?: boolean;
};

/**
 * Replays enter animations every time the element scrolls back into view.
 * Prefer driving `Float*` via `replayKey`/`play` — never remount heavy trees.
 */
export function useScrollReplay(amountOrOpts: number | Options = 0.15) {
  const opts =
    typeof amountOrOpts === "number"
      ? { amount: amountOrOpts, enabled: true }
      : { amount: 0.15, enabled: true, ...amountOrOpts };

  const enabled = opts.enabled !== false;
  const amount = opts.amount ?? 0.15;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount,
    margin: "0px 0px -8% 0px",
    once: false,
  });
  const wasInView = useRef(false);
  const [replayKey, setReplayKey] = useState(0);
  const [play, setPlay] = useState(false);
  const cooldown = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const now = performance.now();

    if (isInView && !wasInView.current) {
      if (now - cooldown.current < 140) {
        wasInView.current = isInView;
        return;
      }
      cooldown.current = now;
      setReplayKey((k) => k + 1);
      setPlay(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPlay(true));
      });
      wasInView.current = true;
      return () => cancelAnimationFrame(id);
    }

    if (!isInView && wasInView.current) {
      setPlay(false);
      wasInView.current = false;
    }
  }, [isInView, enabled]);

  return {
    ref,
    replayKey,
    play,
    isInView: enabled ? isInView : false,
  };
}

export const replayEnter = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export const replayEnterX = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export const replayEnterScale = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

export const replayEnterRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};
