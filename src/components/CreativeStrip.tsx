"use client";

import { FloatBlock, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";
import {
  CreativeHexOrb,
  CreativeRingOrb,
  CreativeParticles,
} from "@/components/CreativeStripOrbs";

/**
 * Compact IT-agency style strip — one tight composition (no staggered empty rows).
 * Keeps orb animations + float reveal; layout is denser and more professional.
 */
export default function CreativeStrip() {
  const { ref, replayKey, play, isInView } = useScrollReplay(0.12);

  return (
    <section
      ref={ref}
      data-tf-active={isInView ? "1" : "0"}
      className="creative-strip-section relative overflow-hidden py-6 lg:py-9"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="creative-strip-panel relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center sm:gap-5 lg:flex-row lg:items-center lg:gap-10 lg:text-left">
          {/* Left orb — decorative, compact */}
          <div className="creative-orb-inline relative order-1 shrink-0 lg:order-none">
            <div className="creative-orb-slot creative-orb-slot-inline">
              <CreativeRingOrb />
              <CreativeParticles variant="ring" />
            </div>
          </div>

          {/* Headline block — single composition */}
          <div className="relative z-[2] order-2 min-w-0 flex-1 lg:order-none">
            <FloatLine replayKey={replayKey} play={play} delay={0} duration={0.55}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand sm:text-xs">
                What we craft
              </p>
            </FloatLine>

            <FloatLine
              replayKey={replayKey}
              play={play}
              delay={0.05}
              duration={0.55}
              className="mt-2 !overflow-visible sm:mt-3"
            >
              <h2 className="creative-strip-heading text-[clamp(1.85rem,5.5vw,3.75rem)] font-black uppercase leading-[1.08] text-foreground">
                <span className="creative-heading-row">
                  <span className="creative-hover-text creative-word-solid">
                    Creative
                  </span>
                  <span className="creative-hover-text creative-word-digital iridescent-text">
                    Digital
                  </span>
                </span>
                <span className="creative-hover-text creative-word-solutions">
                  Solutions
                </span>
              </h2>
            </FloatLine>

            <FloatBlock
              replayKey={replayKey}
              play={play}
              scroll={false}
              index={2}
              duration={0.5}
              className="mx-auto mt-3 max-w-xl lg:mx-0 lg:mt-4"
            >
              <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                We build scalable websites, enterprise software &amp; AI-powered
                experiences that help businesses grow faster.
              </p>
            </FloatBlock>
          </div>

          {/* Right orb */}
          <div className="creative-orb-inline relative order-3 shrink-0 lg:order-none">
            <div className="creative-orb-slot creative-orb-slot-inline">
              <CreativeHexOrb />
              <CreativeParticles variant="hex" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
