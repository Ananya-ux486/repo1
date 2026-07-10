"use client";

import { FloatBlock, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";
import {
  CreativeHexOrb,
  CreativeRingOrb,
  CreativeParticles,
} from "@/components/CreativeStripOrbs";

export default function CreativeStrip() {
  const { ref, replayKey } = useScrollReplay(0.2);

  return (
    <section ref={ref} className="creative-strip-section relative overflow-hidden py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* CREATIVE + hex orb on the right */}
        <div className="creative-row relative min-h-[clamp(4rem,16vw,9rem)]">
          <FloatLine
            replayKey={replayKey}
            delay={0}
            duration={0.85}
            className="!overflow-visible text-left"
          >
            <h2 className="creative-hover-text relative z-[2] text-[clamp(2.5rem,10vw,7rem)] font-black uppercase leading-[0.9] tracking-tighter text-foreground/10 transition-all duration-500">
              CREATIVE
            </h2>
          </FloatLine>
          <div className="creative-orb-slot creative-orb-slot-right">
            <CreativeHexOrb />
            <CreativeParticles variant="hex" />
          </div>
        </div>

        {/* DIGITAL — center highlight */}
        <FloatLine
          replayKey={replayKey}
          delay={0.12}
          duration={0.85}
          className="relative z-[2] !overflow-visible py-1 text-center"
        >
          <h2 className="creative-hover-text iridescent-text text-[clamp(2.5rem,10vw,7rem)] font-black uppercase leading-[0.9] tracking-tighter transition-all duration-500">
            DIGITAL
          </h2>
        </FloatLine>

        {/* SOLUTIONS + ring orb on the left */}
        <div className="creative-row relative min-h-[clamp(4rem,16vw,9rem)]">
          <div className="creative-orb-slot creative-orb-slot-left">
            <CreativeRingOrb />
            <CreativeParticles variant="ring" />
          </div>
          <FloatLine
            replayKey={replayKey}
            delay={0.24}
            duration={0.85}
            className="!overflow-visible text-right"
          >
            <h2 className="creative-hover-text relative z-[2] text-[clamp(2.5rem,10vw,7rem)] font-black uppercase leading-[0.9] tracking-tighter text-foreground/10 transition-all duration-500">
              SOLUTIONS
            </h2>
          </FloatLine>
        </div>

        <FloatBlock
          replayKey={replayKey}
          scroll={false}
          index={3}
          className="relative z-[2] mt-6 max-w-md lg:ml-auto lg:mt-8 lg:text-right"
        >
          <p className="text-sm uppercase tracking-widest text-muted">
            We build scalable websites, enterprise software & AI-powered experiences
            that help businesses grow faster.
          </p>
        </FloatBlock>
      </div>
    </section>
  );
}
