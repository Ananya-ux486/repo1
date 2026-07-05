"use client";

import { motion } from "framer-motion";

const lines = [
  { text: "CREATIVE", align: "left", delay: 0 },
  { text: "DIGITAL", align: "center", highlight: true, delay: 0.15 },
  { text: "SOLUTIONS", align: "right", delay: 0.3 },
];

export default function CreativeStrip() {
  return (
    <section className="relative overflow-hidden bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {lines.map((line) => (
          <motion.div
            key={line.text}
            initial={{ opacity: 0, x: line.align === "right" ? 80 : -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: line.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`overflow-hidden ${
              line.align === "center"
                ? "text-center"
                : line.align === "right"
                  ? "text-right"
                  : "text-left"
            }`}
          >
            <motion.h2
              className={`text-[clamp(2.5rem,10vw,7rem)] font-black uppercase leading-[0.9] tracking-tighter ${
                line.highlight ? "iridescent-text" : "text-white/10"
              }`}
              whileInView={{ y: [40, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: line.delay + 0.1 }}
            >
              {line.text}
            </motion.h2>
          </motion.div>
        ))}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 max-w-md text-sm uppercase tracking-widest text-white/40 md:ml-auto md:text-right"
        >
          We build scalable websites, enterprise software & AI-powered experiences
          that help businesses grow faster.
        </motion.p>
      </div>
    </section>
  );
}
