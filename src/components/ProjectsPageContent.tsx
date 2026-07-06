"use client";

import { projects } from "@/data/siteData";
import {
  AnimatedPortfolioCard,
  PortfolioSectionHeader,
} from "@/components/AnimatedPortfolioCard";

export default function ProjectsPageContent() {
  return (
    <div className="relative overflow-hidden pb-16 pt-20 pastel-section section-glow lg:pb-24 lg:pt-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <PortfolioSectionHeader
          eyebrow="Projects"
          title="Recent"
          titleAccent="Work."
          description="A curated showcase of websites, platforms, and digital products we have designed and delivered for businesses across India and overseas — built for performance, security, and long-term growth."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {projects.map((project, i) => (
            <AnimatedPortfolioCard
              key={project.title}
              item={project}
              index={i}
              tall={i === 0 || i === 3}
              showDetails
            />
          ))}
        </div>
      </div>
    </div>
  );
}
