"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Cloud,
  Shield,
  BarChart3,
  Megaphone,
  Users,
  Code2,
  Smartphone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "@/data/siteData";
import { FloatBlock, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";
import IridescentTitle from "@/components/IridescentTitle";

const iconMap: Record<string, LucideIcon> = {
  "Web Development": Globe,
  "Digital Marketing": Megaphone,
  "CRM Solutions": Users,
  "Cloud Solutions": Cloud,
  "Cyber Security": Shield,
  "Data Analytics": BarChart3,
};

// How many cards visible per "page"
const VISIBLE = 4;
const TOTAL = services.length; // 5
const AUTO_INTERVAL = 3500;

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ServicesSection() {
  const { ref, replayKey, isInView } = useScrollReplay(0.15);

  // offset = index of first visible card (0 or 1 only, since 5 cards show 4)
  const maxOffset = TOTAL - VISIBLE; // = 1
  const [offset, setOffset] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setOffset((o) => (o >= maxOffset ? 0 : o + 1));
  }, [maxOffset]);

  const goPrev = useCallback(() => {
    setOffset((o) => (o <= 0 ? maxOffset : o - 1));
  }, [maxOffset]);

  // Auto-slide
  useEffect(() => {
    timerRef.current = setInterval(goNext, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, AUTO_INTERVAL);
  };

  const handlePrev = () => { goPrev(); resetTimer(); };
  const handleNext = () => { goNext(); resetTimer(); };

  return (
    <section
      ref={ref}
      data-tf-active={isInView ? "1" : "0"}
      className="relative py-8 pastel-section section-glow lg:py-11"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Heading */}
        <div className="mb-8 text-center lg:mb-10">
          <FloatLine replayKey={replayKey} className="mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              What We Do
            </span>
          </FloatLine>
          <FloatLine replayKey={replayKey} delay={0.1} duration={0.85} className="mt-4">
            <IridescentTitle size="lg">Our IT Services</IridescentTitle>
          </FloatLine>
          <FloatBlock replayKey={replayKey} scroll={false} index={2} className="mx-auto mt-4 max-w-2xl">
            <p className="text-muted">
              We deliver innovative and scalable IT solutions designed to help
              businesses grow, streamline operations, and achieve digital success.
            </p>
          </FloatBlock>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous services"
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:bg-brand hover:text-white hover:border-brand lg:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Cards viewport — overflow hidden */}
          <div className="overflow-hidden px-1">
            <motion.div
              className="flex gap-6"
              animate={{ x: `calc(-${offset} * (25% + 1.125rem))` }}
              transition={{ type: "tween", duration: 0.45, ease: "easeInOut" }}
            >
              {services.map((service) => {
                const Icon = iconMap[service.title] || Code2;
                return (
                  <TiltCard
                    key={service.title}
                    className="w-[calc(25%-0.85rem)] shrink-0"
                  >
                    <div className="group glass-card relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:border-brand/40">
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/0 via-brand/0 to-brand/0 opacity-0 transition-opacity duration-300 group-hover:from-brand/15 group-hover:via-orange-400/10 group-hover:to-brand/20 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_40px_rgba(249,115,22,0.18)] transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative z-[1] mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="relative z-[1] text-lg font-semibold text-foreground">
                        {service.title}
                      </h3>
                      <p className="relative z-[1] mt-2 text-sm leading-relaxed text-muted">
                        {service.description}
                      </p>
                      <ul className="relative z-[1] mt-4 space-y-1.5">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-muted">
                            <span className="h-1 w-1 rounded-full bg-brand" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={service.href}
                        className="relative z-[1] mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </TiltCard>
                );
              })}
            </motion.div>
          </div>

          {/* Right arrow */}
          <button
            onClick={handleNext}
            aria-label="Next services"
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white shadow-md transition hover:bg-brand hover:text-white hover:border-brand lg:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setOffset(i); resetTimer(); }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                offset === i ? "w-6 bg-brand" : "w-2 bg-brand/30"
              }`}
            />
          ))}
        </div>

        <FloatBlock replayKey={replayKey} scroll={false} index={3} className="mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Smartphone, label: "Mobile Apps" },
              { icon: Code2, label: "Enterprise Software" },
            ].map(({ icon: Icon, label }) => (
              <Link
                key={label}
                href="/services"
                className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm text-muted transition hover:border-brand/40 hover:text-brand"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </FloatBlock>
      </div>
    </section>
  );
}
