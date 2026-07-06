"use client";

import { motion } from "framer-motion";

const brands = [
  "WEB DEVELOPMENT",
  "CLOUD SOLUTIONS",
  "AI POWERED",
  "CYBER SECURITY",
  "DIGITAL MARKETING",
  "ENTERPRISE SOFTWARE",
];

export default function BrandMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/50 bg-gradient-to-r from-sky-100/60 via-white/40 to-pink-100/60 py-3 backdrop-blur-sm lg:py-4">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 whitespace-nowrap"
      >
        {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="mx-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 sm:mx-6 lg:mx-8 lg:text-sm lg:tracking-[0.3em]"
          >
            {brand}
            <span className="mx-8 text-brand">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
