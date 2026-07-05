"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials, industries } from "@/data/siteData";

export default function TestimonialsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Industries marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 overflow-hidden"
        >
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            360° Result Driven Digital Marketing
          </p>
          <div className="relative flex overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex shrink-0 gap-4"
            >
              {[...industries, ...industries].map((ind, i) => (
                <span
                  key={`${ind}-${i}`}
                  className="shrink-0 rounded-full border border-white/10 px-5 py-2 text-sm text-white/60"
                >
                  {ind}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Happy Customers
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="glass-card relative rounded-2xl p-6"
            >
              <Quote className="mb-4 h-8 w-8 text-brand/40" />
              <p className="text-sm leading-relaxed text-white/70">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
