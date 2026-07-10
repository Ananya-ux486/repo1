"use client";

import { expertise } from "@/data/siteData";
import {
  AnimatedPortfolioCard,
  PortfolioSectionHeader,
} from "@/components/AnimatedPortfolioCard";
import { useScrollReplay } from "@/lib/useScrollReplay";

export default function ExpertiseSection() {
  const { ref, replayKey } = useScrollReplay(0.12);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 pastel-section section-glow lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <PortfolioSectionHeader
          replayKey={replayKey}
          eyebrow="Capabilities"
          title="Expertise &"
          titleAccent="Capabilities."
          description="Delivering secure, scalable, and high-performance IT solutions tailored for modern businesses — from architecture and development to ongoing support."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {expertise.map((item, i) => (
            <AnimatedPortfolioCard
              key={item.title}
              item={item}
              index={i}
              tall={i === 0 || i === 3}
              replayKey={replayKey}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
