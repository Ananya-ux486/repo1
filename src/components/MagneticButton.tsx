"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ReactNode, useRef } from "react";
import { useOptionalAuditForm } from "@/components/AuditFormProvider";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "outline-on-dark" | "pill-dark" | "pill-light";
  className?: string;
  /** Opens the Free Audit Report modal instead of navigating */
  openAudit?: boolean;
}

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  openAudit = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rafId = useRef(0);
  const offset = useRef({ x: 0, y: 0 });
  const audit = useOptionalAuditForm();

  const variants = {
    primary:
      "bg-brand text-white shadow-md hover:bg-brand-dark hover:shadow-lg",
    outline:
      "border border-border bg-white text-foreground hover:border-brand hover:bg-brand hover:text-white hover:shadow-md",
    "outline-on-dark":
      "border-2 border-white/85 bg-white text-slate-900 shadow-md hover:bg-brand hover:border-brand hover:text-white hover:shadow-lg",
    "pill-dark":
      "border border-border bg-white text-foreground shadow-sm hover:border-brand hover:bg-brand hover:text-white hover:shadow-md",
    "pill-light":
      "bg-brand text-white shadow-md hover:bg-brand-dark hover:shadow-lg",
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

  const classNames = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${variants[variant]} ${className}`;

  if (openAudit) {
    return (
      <m.div whileTap={{ scale: 0.96 }}>
        <button
          type="button"
          onClick={() => {
            if (audit) audit.openAuditForm();
            else
              window.location.assign(
                href.includes("audit=") ? href : "/contact?audit=1",
              );
          }}
          className={classNames}
        >
          {children}
        </button>
      </m.div>
    );
  }

  return (
    <m.div whileTap={{ scale: 0.96 }}>
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={classNames}
      >
        {children}
      </Link>
    </m.div>
  );
}
