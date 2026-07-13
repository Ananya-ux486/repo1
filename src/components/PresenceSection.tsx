"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { indiaPresence, internationalPresence } from "@/data/siteData";
import { IMAGE_BLUR } from "@/lib/motion";
import { floatEase } from "@/lib/floatMotion";
import { FloatImageWrap, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";

function IndiaCard({
  city,
  landmark,
  image,
}: {
  city: string;
  landmark: string;
  image: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: floatEase }}
      className="group w-[220px] shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm sm:w-[260px]"
    >
      <FloatImageWrap scroll={false} replayKey={0} className="aspect-[4/3]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={`${landmark}, ${city}`}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="260px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-sm font-semibold text-white">{city}</p>
            <p className="text-[10px] text-white/50">{landmark}</p>
          </div>
        </div>
      </FloatImageWrap>
    </motion.div>
  );
}

function FlagCard({
  country,
  image,
}: {
  country: string;
  image: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: floatEase }}
      className="group flex w-[180px] shrink-0 flex-col items-center rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-brand/30 sm:w-[200px]"
    >
      <div className="relative mb-4 flex h-[72px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-slate-50 p-2 shadow-inner sm:h-20">
        <Image
          src={image}
          alt={`${country} flag`}
          width={160}
          height={96}
          loading="lazy"
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>
      <p className="text-center text-sm font-semibold text-foreground">{country}</p>
    </motion.div>
  );
}

function CssMarquee({
  children,
  direction = "left",
  duration = 45,
  className = "",
}: {
  children: React.ReactNode[];
  direction?: "left" | "right";
  duration?: number;
  className?: string;
}) {
  const loop = [...children, ...children];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`marquee-track flex w-max gap-4 py-2 ${
          direction === "right" ? "marquee-right" : "marquee-left"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((child, i) => (
          <div key={i} className="shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PresenceSection() {
  const indiaReplay = useScrollReplay(0.15);
  const intlReplay = useScrollReplay(0.15);

  return (
    <section className="relative overflow-hidden py-12 pastel-section lg:py-16">
      <div ref={indiaReplay.ref} className="mx-auto mb-8 max-w-7xl px-4 text-center lg:px-8">
        <FloatLine replayKey={indiaReplay.replayKey}>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Nationwide Reach
          </span>
        </FloatLine>
        <FloatLine replayKey={indiaReplay.replayKey} delay={0.08} className="mt-3">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Our Presence in India
          </h2>
        </FloatLine>
      </div>

      <CssMarquee duration={50} direction="right" className="mb-10 lg:mb-14">
        {indiaPresence.map((city) => (
          <IndiaCard key={city.city} {...city} />
        ))}
      </CssMarquee>

      <div ref={intlReplay.ref} className="mx-auto mb-8 max-w-7xl px-4 text-center lg:px-8">
        <FloatLine replayKey={intlReplay.replayKey}>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Our Presence in International
          </h2>
        </FloatLine>
      </div>

      <CssMarquee duration={42} direction="left">
        {internationalPresence.map((loc) => (
          <FlagCard key={loc.country} {...loc} />
        ))}
      </CssMarquee>
    </section>
  );
}
