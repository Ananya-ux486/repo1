"use client";

import { motion } from "framer-motion";
import { approachItems, stats } from "@/data/siteData";
import { Target, Award, Users } from "lucide-react";
import { FloatBlock, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";
import { floatEase, floatStagger } from "@/lib/floatMotion";

const icons = [Target, Award, Users];

export default function ApproachSection() {
  const { ref, replayKey, isInView } = useScrollReplay(0.18);

  return (
    <section
      ref={ref}
      data-tf-active={isInView ? "1" : "0"}
      className="relative overflow-hidden py-8 pastel-section lg:py-11"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          className="expert-bg-drift text-[clamp(6rem,20vw,18rem)] font-black uppercase leading-none text-foreground/[0.04]"
          aria-hidden
        >
          EXPERT
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <FloatLine replayKey={replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Our Approach
              </span>
            </FloatLine>
            <FloatLine replayKey={replayKey} delay={0.08} className="mt-3">
              <h2 className="iridescent-text text-3xl font-black normal-case lg:text-4xl">
                Unlock Potential
              </h2>
            </FloatLine>
            <FloatLine replayKey={replayKey} delay={0.14} className="mt-2">
              <h3 className="text-2xl font-bold text-foreground lg:text-3xl">
                Full Potential of Your Business
              </h3>
            </FloatLine>
            <FloatBlock replayKey={replayKey} scroll={false} index={2} className="mt-4">
              <p className="leading-relaxed text-muted">
                At Tasmafive Solutions, we focus on understanding your business
                needs and delivering customized, scalable, and future-ready digital
                solutions that drive real results.
              </p>
            </FloatBlock>

            <div className="mt-8 space-y-6">
              {approachItems.map((item, i) => {
                const Icon = icons[i];
                return (
                  <FloatBlock key={item.title} replayKey={replayKey} scroll={false} index={i + 3}>
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted">{item.description}</p>
                      </div>
                    </div>
                  </FloatBlock>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 60, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25, margin: "0px 0px -40px 0px" }}
                transition={{
                  duration: 0.75,
                  delay: floatStagger(i, 0.08),
                  ease: floatEase,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateZ: 1 }}
                  className="glass-card rounded-2xl p-4 text-center lg:p-6"
                >
                  <p className="text-2xl font-black iridescent-text lg:text-3xl">{stat.value}</p>
                  <p className="mt-2 text-xs text-muted">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
