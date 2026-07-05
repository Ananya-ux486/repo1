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

  const variants = {
    primary: "bg-brand text-black hover:bg-brand-dark",
    outline:
      "border border-white/20 text-white hover:border-brand/50 hover:bg-white/5",
    "pill-dark":
      "border border-white/20 bg-black/60 text-white backdrop-blur-sm hover:bg-white hover:text-black",
    "pill-light":
      "bg-white text-black hover:bg-white/90",
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return (
    <motion.div whileTap={{ scale: 0.96 }}>
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
        style={{ transition: "transform 0.15s ease-out" }}
      >
        {children}
      </Link>
    </motion.div>
  );
}
