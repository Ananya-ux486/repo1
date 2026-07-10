"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Replays enter animation each time element scrolls into view */
export function useScrollReplay(amount = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount,
    margin: "0px 0px -50px 0px",
  });
  const wasInView = useRef(false);
  const lastReplay = useRef(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (isInView && !wasInView.current) {
      const now = Date.now();
      if (now - lastReplay.current > 450) {
        lastReplay.current = now;
        setReplayKey((k) => k + 1);
      }
    }
    wasInView.current = isInView;
  }, [isInView]);

  return { ref, replayKey, isInView };
}

export const replayEnter = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
};

export const replayEnterX = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
};

export const replayEnterScale = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export const replayEnterRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
};
