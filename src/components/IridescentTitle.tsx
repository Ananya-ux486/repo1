"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface IridescentTitleProps {
  children: string;
  className?: string;
  size?: "sm" | "lg" | "xl";
}

export default function IridescentTitle({
  children,
  className = "",
  size = "lg",
}: IridescentTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const sizes = {
    sm: "text-2xl lg:text-3xl",
    lg: "text-4xl lg:text-6xl",
    xl: "text-5xl lg:text-8xl",
  };

  return (
    <motion.h2
      ref={ref}
      style={{ y }}
      className={`iridescent-text font-black uppercase tracking-tight ${sizes[size]} ${className}`}
    >
      {children}
    </motion.h2>
  );
}
