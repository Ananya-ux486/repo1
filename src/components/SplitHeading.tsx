"use client";

import { motion } from "framer-motion";

interface SplitHeadingProps {
  text: string;
  highlightWords?: string[];
  className?: string;
}

export default function SplitHeading({
  text,
  highlightWords = [],
  className = "",
}: SplitHeadingProps) {
  const words = text.split(" ");

  return (
    <motion.h1
      className={`${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
      }}
    >
      {words.map((word, i) => {
        const clean = word.replace(/[^a-zA-Z-]/g, "");
        const isHighlight = highlightWords.includes(clean);

        return (
          <motion.span
            key={`${word}-${i}`}
            variants={{
              hidden: { opacity: 0, y: 50, rotateX: -40 },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className={`inline-block mr-[0.25em] ${isHighlight ? "iridescent-text" : ""}`}
            style={{ transformOrigin: "bottom center" }}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
