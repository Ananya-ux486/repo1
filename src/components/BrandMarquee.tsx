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
    <div className="relative overflow-hidden border-y border-white/5 bg-black py-4">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 whitespace-nowrap"
      >
        {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="mx-8 text-sm font-bold uppercase tracking-[0.3em] text-white/20"
          >
            {brand}
            <span className="mx-8 text-brand">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
