"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Code2,
  CloudCog,
  TrendingUp,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { catalogueFanCards } from "@/data/catalogueData";

const fanIcons: Record<string, LucideIcon> = {
  build: Code2,
  scale: CloudCog,
  grow: TrendingUp,
  advise: Handshake,
};

function CardFace({
  card,
  contentOpacity,
  contentY,
  alwaysShow,
}: {
  card: (typeof catalogueFanCards)[number];
  contentOpacity?: MotionValue<number>;
  contentY?: MotionValue<number>;
  alwaysShow?: boolean;
}) {
  const Icon = fanIcons[card.id] || Code2;
  const list = (
    <ul className="mt-auto space-y-1 border-t border-border/60 pt-2">
      {card.items.map((item) => (
        <li
          key={item}
          className="text-[10px] font-medium text-slate-700 sm:text-[11px]"
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative flex h-full flex-col bg-gradient-to-b from-white via-orange-50/55 to-white p-3 sm:p-3.5">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-black tracking-[0.18em] text-brand">
          {card.label}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
          <Icon className="h-3 w-3" />
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-orange-400 text-white shadow-md sm:h-14 sm:w-14">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {card.label}
        </p>
      </div>

      {alwaysShow ? (
        list
      ) : contentOpacity && contentY ? (
        <motion.div style={{ opacity: contentOpacity, y: contentY }}>
          {list}
        </motion.div>
      ) : null}

      <div className="mt-2 flex items-end justify-between">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
          <Icon className="h-2.5 w-2.5" />
        </span>
        <span className="rotate-180 text-[9px] font-black tracking-[0.18em] text-brand">
          {card.label}
        </span>
      </div>
    </div>
  );
}

function FanCard({
  card,
  index,
  progress,
}: {
  card: (typeof catalogueFanCards)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const mid = (catalogueFanCards.length - 1) / 2;
  const offset = index - mid;

  // Opens fully while section is still on screen (no huge sticky gap)
  const x = useTransform(progress, [0, 1], [offset * 8, offset * 168]);
  const y = useTransform(progress, [0, 1], [Math.abs(offset) * 4, 0]);
  const rotate = useTransform(progress, [0, 1], [offset * 5, offset * 4]);
  const scale = useTransform(progress, [0, 1], [0.9, 1]);
  const contentOpacity = useTransform(progress, [0.35, 0.85], [0, 1]);
  const contentY = useTransform(progress, [0.35, 0.85], [10, 0]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, zIndex: 10 + index }}
      className="absolute left-1/2 top-1/2 h-[240px] w-[132px] origin-center -translate-x-1/2 -translate-y-1/2 will-change-transform sm:h-[270px] sm:w-[156px]"
    >
      <div className="h-full overflow-hidden rounded-2xl border border-orange-200/70 bg-white shadow-[0_16px_36px_-14px_rgba(249,115,22,0.4)]">
        <CardFace
          card={card}
          contentOpacity={contentOpacity}
          contentY={contentY}
        />
      </div>
    </motion.div>
  );
}

/**
 * Fan opens as the section enters the viewport and finishes
 * while still centered — no tall sticky spacer.
 */
export default function CatalogueFanReveal() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Window / document is the scroll root — do not bind a nested container.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "center 0.45"],
  });

  return (
    <section ref={ref} className="relative py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Capability deck
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Scroll to open our delivery stack
          </h2>
        </div>

        <div className="relative mx-auto h-[300px] max-w-4xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-orange-50 via-white to-sky-50 shadow-sm sm:h-[340px]">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 800 400"
            fill="none"
            aria-hidden
          >
            <path
              d="M40 320 C 180 280, 220 120, 400 140 C 580 160, 620 60, 760 80"
              stroke="#F97316"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>

          {reduced ? (
            <div className="flex h-full items-center justify-center gap-3 overflow-x-auto px-3">
              {catalogueFanCards.map((card) => (
                <div
                  key={card.id}
                  className="h-[240px] w-[132px] shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-md sm:h-[270px] sm:w-[156px]"
                >
                  <CardFace card={card} alwaysShow />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-full w-full">
              {catalogueFanCards.map((card, i) => (
                <FanCard
                  key={card.id}
                  card={card}
                  index={i}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
