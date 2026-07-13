"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Fires enter animation once when element first scrolls into view.
 * (Previously re-triggered on every re-entry — that made the site feel laggy.)
 */
export function useScrollReplay(amount = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount,
    margin: "0px 0px -40px 0px",
    once: true,
  });
  const fired = useRef(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (isInView && !fired.current) {
      fired.current = true;
      setReplayKey(1);
    }
  }, [isInView]);

  return { ref, replayKey, isInView };
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
