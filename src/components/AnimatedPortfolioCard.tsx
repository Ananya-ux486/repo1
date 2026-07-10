"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IMAGE_BLUR } from "@/lib/motion";
import { FloatBlock, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";

export type PortfolioCardItem = {
  title: string;
  category: string;
  description: string;
  image: string;
  tags?: string[];
  details?: string;
};

const cardEase = [0.22, 1, 0.36, 1] as const;

const cardEnter = {
  initial: { opacity: 0, y: -120, scale: 0.92 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

export function AnimatedPortfolioCard({
  item,
  index,
  tall = false,
  showDetails = false,
  replayKey: sectionReplayKey,
}: {
  item: PortfolioCardItem;
  index: number;
  tall?: boolean;
  showDetails?: boolean;
  replayKey?: number;
}) {
  const cardReplay = useScrollReplay(0.12);
  const cardClass = `group overflow-hidden rounded-3xl border border-border bg-white shadow-md ${
    tall ? "lg:row-span-2" : ""
  }`;

  // Section replay syncs all cards; fallback = per-card replay when section key is 0
  const playKey =
    sectionReplayKey !== undefined && sectionReplayKey > 0
      ? `section-${sectionReplayKey}-${index}`
      : `card-${cardReplay.replayKey}-${index}`;

  const attachRef = sectionReplayKey !== undefined ? undefined : cardReplay.ref;

  const motionProps = {
    ref: attachRef,
    key: playKey,
    ...cardEnter,
    transition: {
      duration: 0.85,
      delay: index * 0.1,
      ease: cardEase,
    },
  };

  if (showDetails) {
    return (
      <motion.article {...motionProps} className={cardClass}>
        <div className={`relative overflow-hidden ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            {item.category}
          </span>
          <h3 className="mt-2 text-lg font-bold text-foreground sm:text-xl">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {item.details || item.description}
          </p>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article {...motionProps} className={`${cardClass} relative`}>
      <div
        className={`relative overflow-hidden ${
          tall ? "aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[480px]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR}
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          {item.category}
        </span>
        <h3 className="mt-2 text-lg font-bold text-white transition group-hover:text-brand sm:text-xl">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function PortfolioSectionHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  replayKey: sectionReplayKey,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description: string;
  replayKey?: number;
}) {
  const internal = useScrollReplay(0.12);
  const replayKey =
    sectionReplayKey !== undefined && sectionReplayKey > 0
      ? sectionReplayKey
      : internal.replayKey;
  const ref =
    sectionReplayKey !== undefined && sectionReplayKey > 0 ? undefined : internal.ref;

  return (
    <div
      ref={ref}
      className="mb-10 grid gap-6 lg:mb-16 lg:grid-cols-2 lg:items-end lg:gap-10"
    >
      <div>
        <FloatLine replayKey={replayKey} delay={0}>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-muted">
              {eyebrow}
            </span>
          </div>
        </FloatLine>
        <FloatLine replayKey={replayKey} delay={0.08} duration={0.85}>
          <h2 className="text-[clamp(2rem,7vw,5rem)] font-black uppercase leading-[0.95] tracking-tighter text-foreground lg:text-[clamp(2.5rem,8vw,5rem)]">
            {title}
            {titleAccent ? (
              <>
                <br />
                <span className="iridescent-text">{titleAccent}</span>
              </>
            ) : null}
          </h2>
        </FloatLine>
      </div>

      <FloatBlock
        replayKey={replayKey}
        scroll={false}
        index={1}
        className="flex flex-col items-start justify-end gap-4 lg:items-end lg:text-right"
      >
        <p className="max-w-md text-sm leading-relaxed text-muted">{description}</p>
      </FloatBlock>
    </div>
  );
}
