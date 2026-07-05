"use client";

import { motion } from "framer-motion";
import { approachItems, stats } from "@/data/siteData";
import { Target, Award, Users } from "lucide-react";
import IridescentTitle from "@/components/IridescentTitle";

const icons = [Target, Award, Users];

export default function ApproachSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-surface">
      {/* Lusion-style large background text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.span
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="text-[clamp(6rem,20vw,18rem)] font-black uppercase leading-none text-white/[0.03]"
          aria-hidden
        >
          EXPERT
        </motion.span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Our Approach
            </span>
            <div className="mt-3">
              <IridescentTitle size="sm" className="normal-case !text-3xl md:!text-4xl">
                Unlock Potential
              </IridescentTitle>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Full Potential of Your Business
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              At Tasmafive Solutions, we focus on understanding your business
              needs and delivering customized, scalable, and future-ready digital
              solutions that drive real results.
            </p>

            <div className="mt-8 space-y-6">
              {approachItems.map((item, i) => {
                const Icon = icons[i];
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotateZ: 1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <p className="text-3xl font-black iridescent-text">{stat.value}</p>
                <p className="mt-2 text-xs text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
