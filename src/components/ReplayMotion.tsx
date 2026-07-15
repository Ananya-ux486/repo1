"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { revealTransition, staggerDelay } from "@/lib/motion";
import {
  replayEnter,
  replayEnterRight,
  replayEnterScale,
  replayEnterX,
  useScrollReplay,
} from "@/lib/useScrollReplay";

type ReplayMotionProps = {
  children: ReactNode;
  className?: string;
  index?: number;
  amount?: number;
  as?: "div" | "article" | "p";
} & (
  | { variant?: "default" | "x" | "scale" | "right" }
  | {
      variant: "custom";
      initial: Record<string, number>;
      animate: Record<string, number>;
    }
);

export function ReplayMotion({
  children,
  className = "",
  index = 0,
  amount = 0.18,
  as = "div",
  ...rest
}: ReplayMotionProps) {
  const { ref, play } = useScrollReplay(amount);
  const Component = motion[as];

  let preset: {
    initial: Record<string, number>;
    animate: Record<string, number>;
    transition: { duration: number; ease: readonly [number, number, number, number] };
  };

  if ("variant" in rest && rest.variant === "custom") {
    preset = {
      initial: rest.initial,
      animate: rest.animate,
      transition: revealTransition,
    };
  } else {
    const variant =
      "variant" in rest && rest.variant ? rest.variant : "default";
    const map = {
      default: replayEnter,
      x: replayEnterX,
      scale: replayEnterScale,
      right: replayEnterRight,
    } as const;
    preset = map[variant];
  }

  return (
    <Component
      ref={ref}
      initial={preset.initial}
      animate={play ? preset.animate : preset.initial}
      transition={{ ...preset.transition, delay: play ? staggerDelay(index) : 0 }}
      className={className}
      style={{ willChange: play ? "transform, opacity" : "auto" }}
    >
      {children}
    </Component>
  );
}
