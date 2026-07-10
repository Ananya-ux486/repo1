"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { floatEase, floatStagger, floatTransition } from "@/lib/floatMotion";
import { useScrollReplay } from "@/lib/useScrollReplay";

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
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        key={replayKey}
        initial={{ y: "115%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={floatTransition(delay, duration)}
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

  return (
    <Wrapper className={className} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[^a-zA-Z-]/g, "");
        const isHighlight = highlightWords.includes(clean);

        return (
          <span
            key={`${replayKey}-${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.06em] pr-[0.22em]"
          >
            <motion.span
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: floatStagger(i, stagger, baseDelay),
                ease: floatEase,
              }}
              className={`inline-block ${isHighlight ? highlightClass : wordClass}`}
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
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  replayKey?: number;
  scroll?: boolean;
  amount?: number;
  duration?: number;
}) {
  const scrollReplay = useScrollReplay(amount);
  const key = externalKey ?? (scroll ? scrollReplay.replayKey : 0);

  return (
    <div ref={scroll ? scrollReplay.ref : undefined} className={`overflow-hidden ${className}`}>
      <motion.div
        key={key}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={floatTransition(index * 0.08, duration)}
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
  const scrollReplay = useScrollReplay(amount);
  const key = externalKey ?? (scroll ? scrollReplay.replayKey : 0);

  return (
    <div
      ref={scroll ? scrollReplay.ref : undefined}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        key={key}
        initial={{ y: "18%", scale: 1.08, opacity: 0 }}
        animate={{ y: "0%", scale: 1, opacity: 1 }}
        transition={floatTransition(index * 0.1, 0.9)}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
