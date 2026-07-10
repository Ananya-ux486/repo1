"use client";

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

  const sizes = {
    sm: "text-2xl lg:text-3xl",
    lg: "text-4xl lg:text-6xl",
    xl: "text-5xl lg:text-8xl",
  };

  return (
    <h2
      ref={ref}
      className={`iridescent-text font-black uppercase tracking-tight ${sizes[size]} ${className}`}
    >
      {children}
    </h2>
  );
}
