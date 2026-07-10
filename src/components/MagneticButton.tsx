"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useRef } from "react";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "pill-dark" | "pill-light";
  className?: string;
}

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rafId = useRef(0);
  const offset = useRef({ x: 0, y: 0 });

  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    outline:
      "border border-border text-foreground hover:border-brand/50 hover:bg-surface",
    "pill-dark":
      "border border-border bg-white text-foreground shadow-sm hover:bg-brand hover:text-white",
    "pill-light":
      "bg-brand text-white hover:bg-brand-dark",
  };

  const paint = () => {
    rafId.current = 0;
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate3d(${offset.current.x}px, ${offset.current.y}px, 0)`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    offset.current = {
      x: (e.clientX - rect.left - rect.width / 2) * 0.2,
      y: (e.clientY - rect.top - rect.height / 2) * 0.2,
    };
    if (!rafId.current) rafId.current = requestAnimationFrame(paint);
  };

  const handleMouseLeave = () => {
    offset.current = { x: 0, y: 0 };
    if (!rafId.current) rafId.current = requestAnimationFrame(paint);
  };

  return (
    <motion.div whileTap={{ scale: 0.96 }}>
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${variants[variant]} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
