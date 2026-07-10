"use client";

import { FloatWords } from "@/components/FloatReveal";

interface SplitHeadingProps {
  text: string;
  highlightWords?: string[];
  className?: string;
  variant?: "default" | "hero";
  replayKey?: number;
}

export default function SplitHeading({
  text,
  highlightWords = [],
  className = "",
  variant = "default",
  replayKey = 0,
}: SplitHeadingProps) {
  const wordClass = variant === "hero" ? "hero-title-text" : "";
  const highlightClass =
    variant === "hero" ? "hero-highlight-text" : "iridescent-text";

  return (
    <FloatWords
      as="h1"
      text={text}
      highlightWords={highlightWords}
      replayKey={replayKey}
      className={className}
      wordClass={wordClass}
      highlightClass={highlightClass}
      stagger={0.06}
      baseDelay={0.04}
    />
  );
}
