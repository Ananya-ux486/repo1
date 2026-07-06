"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { indiaPresence, internationalPresence } from "@/data/siteData";

function IndiaCard({
  city,
  landmark,
  image,
  index,
}: {
  city: string;
  landmark: string;
  image: string;
  index: number;
}) {
  return (
    <div className="group w-[220px] shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm sm:w-[260px]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={`${landmark}, ${city}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
          sizes="260px"
          priority={index < 3}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-sm font-semibold text-white">{city}</p>
          <p className="text-[10px] text-white/50">{landmark}</p>
        </div>
      </div>
    </div>
  );
}

function FlagCard({ country, image }: { country: string; image: string }) {
  return (
    <div className="group flex w-[180px] shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:border-brand/30 sm:w-[220px]">
      <div className="relative mb-3 h-16 w-24 overflow-hidden rounded-lg shadow-lg">
        <Image
          src={image}
          alt={`${country}`}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <p className="text-sm font-semibold text-foreground">{country}</p>
    </div>
  );
}

function AutoMarqueeRow({
  children,
  duration = 45,
  direction = "right",
  className = "",
}: {
  children: React.ReactNode[];
  duration?: number;
  direction?: "left" | "right";
  className?: string;
}) {
  const loop = [...children, ...children];
  const animateX =
    direction === "right" ? ["-50%", "0%"] : ["0%", "-50%"];

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{ x: animateX }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex w-max gap-4 py-2"
      >
        {loop.map((child, i) => (
          <div key={i} className="shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function PresenceSection() {
  return (
    <section className="relative overflow-hidden py-16 pastel-section lg:py-24">
      {/* India */}
      <div className="mx-auto mb-12 max-w-7xl px-4 text-center lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-brand"
        >
          Nationwide Reach
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-3 text-3xl font-bold text-foreground md:text-4xl"
        >
          Our Presence in India
        </motion.h2>
      </div>

      <AutoMarqueeRow duration={50} direction="right" className="mb-12 lg:mb-20">
        {indiaPresence.map((city, i) => (
          <IndiaCard key={city.city} {...city} index={i} />
        ))}
      </AutoMarqueeRow>

      {/* International */}
      <div className="mx-auto mb-12 max-w-7xl px-4 text-center lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground md:text-4xl"
        >
          Our Presence in International
        </motion.h2>
      </div>

      <AutoMarqueeRow duration={42} direction="left">
        {internationalPresence.map((loc) => (
          <FlagCard key={loc.country} {...loc} />
        ))}
      </AutoMarqueeRow>
    </section>
  );
}
