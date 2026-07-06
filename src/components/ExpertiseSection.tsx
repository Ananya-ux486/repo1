"use client";

import { expertise } from "@/data/siteData";
import {
  AnimatedPortfolioCard,
  PortfolioSectionHeader,
} from "@/components/AnimatedPortfolioCard";

export default function ExpertiseSection() {
  return (
    <section className="relative overflow-hidden py-16 pastel-section section-glow lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <PortfolioSectionHeader
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
