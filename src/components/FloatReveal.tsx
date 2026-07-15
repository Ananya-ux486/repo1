"use client";

import { type ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { floatEase, floatStagger, floatTransition } from "@/lib/floatMotion";
import { useScrollReplay } from "@/lib/useScrollReplay";

/** Drive replay without remounting DOM (same float-up look). */
export function useReplayPlay(replayKey: number | undefined, startPlaying = false) {
  const [play, setPlay] = useState(
    startPlaying || (replayKey !== undefined && replayKey > 0),
  );

  useEffect(() => {
    if (replayKey === undefined) {
      if (startPlaying) setPlay(true);
      return;
    }
    if (replayKey <= 0) {
      setPlay(false);
      return;
    }
    setPlay(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPlay(true));
    });
    return () => cancelAnimationFrame(id);
  }, [replayKey, startPlaying]);

  return play;
}

/* ── Single masked line (Buzzworthy float-up) ── */
export function FloatLine({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  replayKey,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  replayKey?: number;
}) {
  const play = useReplayPlay(replayKey, false);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "115%", opacity: 0 }}
        animate={play ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
        transition={floatTransition(delay, duration)}
        style={{ willChange: play ? "transform, opacity" : "auto" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Word-by-word masked float (hero headings) ── */
export function FloatWords({
  text,
  highlightWords = [],
  className = "",
  wordClass = "",
  highlightClass = "",
  replayKey = 0,
  stagger = 0.07,
  baseDelay = 0.06,
  as: Tag = "span",
}: {
  text: string;
  highlightWords?: string[];
  className?: string;
  wordClass?: string;
  highlightClass?: string;
  replayKey?: number;
  stagger?: number;
  baseDelay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(" ");
  const Wrapper = Tag;
  const play = useReplayPlay(replayKey, false);

  return (
    <Wrapper className={className} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[^a-zA-Z-]/g, "");
        const isHighlight = highlightWords.includes(clean);

        return (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.06em] pr-[0.22em]"
          >
            <motion.span
              initial={{ y: "120%", opacity: 0 }}
              animate={play ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: play ? floatStagger(i, stagger, baseDelay) : 0,
                ease: floatEase,
              }}
              className={`inline-block ${isHighlight ? highlightClass : wordClass}`}
              style={{ willChange: play ? "transform, opacity" : "auto" }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Wrapper>
  );
}

/* ── Block float — scroll replay or manual key (hero slide change) ── */
export function FloatBlock({
  children,
  className = "",
  index = 0,
  replayKey: externalKey,
  scroll = true,
  amount = 0.15,
  duration = 0.7,
  clip = true,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  replayKey?: number;
  scroll?: boolean;
  amount?: number;
  duration?: number;
  clip?: boolean;
}) {
  const needsObserver = scroll && externalKey === undefined;
  const scrollReplay = useScrollReplay({ amount, enabled: needsObserver });
  const key = externalKey ?? (needsObserver ? scrollReplay.replayKey : 0);
  const playFromKey = useReplayPlay(
    needsObserver || externalKey !== undefined ? key : undefined,
    !needsObserver && externalKey === undefined,
  );
  const play = needsObserver ? scrollReplay.play : playFromKey;

  const hidden = clip ? { y: "110%", opacity: 0 } : { y: 18, opacity: 0 };
  const shown = clip ? { y: "0%", opacity: 1 } : { y: 0, opacity: 1 };

  return (
    <div
      ref={needsObserver ? scrollReplay.ref : undefined}
      className={`${clip ? "overflow-hidden" : "overflow-visible"} ${className}`}
    >
      <motion.div
        initial={hidden}
        animate={play ? shown : hidden}
        transition={floatTransition(index * 0.08, duration)}
        style={{ willChange: play ? "transform, opacity" : "auto" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Image float — scale + rise (cards, hero, blog) ── */
export function FloatImageWrap({
  children,
  className = "",
  index = 0,
  replayKey: externalKey,
  scroll = true,
  amount = 0.12,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  replayKey?: number;
  scroll?: boolean;
  amount?: number;
}) {
  const needsObserver = scroll && externalKey === undefined;
  const scrollReplay = useScrollReplay({ amount, enabled: needsObserver });
  const key = externalKey ?? (needsObserver ? scrollReplay.replayKey : 0);
  // scroll=false + no key → always visible (marquee / static media)
  // scroll=false + key>0 → replay with section
  // replayKey={0} means "show now", not "stay hidden"
  const staticVisible = !needsObserver && (externalKey === undefined || externalKey === 0);
  const playFromKey = useReplayPlay(
    staticVisible ? undefined : key,
    staticVisible,
  );
  const play = needsObserver ? scrollReplay.play : playFromKey;

  return (
    <div
      ref={needsObserver ? scrollReplay.ref : undefined}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        initial={staticVisible ? false : { y: 14, scale: 1, opacity: 0 }}
        animate={
          play || staticVisible
            ? { y: 0, scale: 1, opacity: 1 }
            : { y: 14, scale: 1, opacity: 0 }
        }
        transition={floatTransition(index * 0.06, 0.55)}
        className="h-full w-full"
        style={{ willChange: play && !staticVisible ? "transform, opacity" : "auto" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
