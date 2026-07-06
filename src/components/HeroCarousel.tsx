"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroSlides } from "@/data/siteData";
import ParticleField from "@/components/ParticleField";
import AnimatedBlob from "@/components/AnimatedBlob";
import SplitHeading from "@/components/SplitHeading";
import MagneticButton from "@/components/MagneticButton";

const highlightMap: Record<number, string[]> = {
  1: ["Powerful", "Digital", "Solutions"],
  2: ["Trusted", "Digital", "Growth"],
  3: ["AI-Powered", "Tomorrow's"],
  4: ["Smart", "Real", "Results"],
};

export default function HeroCarousel() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slide = heroSlides[activeIndex];

  return (
    <section className="relative h-[calc(100svh-3.5rem)] min-h-[420px] w-full overflow-hidden -mt-px lg:h-[88vh] lg:min-h-[500px]">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation!.prevEl = prevRef.current;
            swiper.params.navigation!.nextEl = nextRef.current;
          }
        }}
        onSlideChange={(swiper: SwiperType) =>
          setActiveIndex(swiper.realIndex)
        }
        loop
        className="h-full w-full"
      >
        {heroSlides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="relative h-full w-full">
              <Image
                src={s.image}
                alt={s.heading}
                fill
                priority={s.id === 1}
                className="object-cover scale-105 transition-transform duration-[8000ms] ease-out"
                sizes="100vw"
              />
              <div className="hero-gradient-overlay absolute inset-0" />
              <AnimatedBlob />
              <ParticleField />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lusion-style giant watermark */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] overflow-hidden">
        <motion.p
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="select-none text-center text-[clamp(4rem,18vw,16rem)] font-black uppercase leading-none tracking-tighter text-white/[0.04]"
          aria-hidden
        >
          TASMAFIVE
        </motion.p>
      </div>

      {/* Crosshair grid accents (Lusion-style) */}
      <div className="pointer-events-none absolute bottom-[18%] left-0 right-0 z-[2] hidden lg:block">
        <div className="mx-auto flex max-w-7xl justify-between px-8">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="text-white/30 text-xs"
            >
              +
            </motion.span>
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center max-lg:items-end max-lg:pb-20">
        <div className="pointer-events-auto mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="hero-content-panel max-lg:mx-0">
            <motion.span
              key={`badge-${activeIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 inline-block rounded-full border border-brand/50 bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
            >
              TasmaFive Solutions
            </motion.span>

            <SplitHeading
              key={`heading-${activeIndex}`}
              text={slide.heading}
              highlightWords={highlightMap[slide.id] || []}
              variant="hero"
              className="text-3xl font-black leading-[1.1] tracking-tight lg:text-[2.75rem]"
            />

            <motion.p
              key={`sub-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="hero-subtext mt-4 max-w-xl text-sm leading-relaxed md:text-base"
            >
              {slide.subheading}
            </motion.p>

            <motion.div
              key={`cta-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-5 flex flex-wrap gap-3"
            >
              {slide.ctaPrimary ? (
                <MagneticButton href="/contact" variant="primary">
                  {slide.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              ) : null}
              <MagneticButton
                href="/services"
                variant="outline"
                className="!border-white/30 !text-white hover:!bg-white/15 hover:!text-white"
              >
                {slide.ctaSecondary}
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        ref={prevRef}
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition hover:border-brand/50 hover:bg-brand/20 sm:left-4 sm:h-12 sm:w-12 lg:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        ref={nextRef}
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition hover:border-brand/50 hover:bg-brand/20 sm:right-4 sm:h-12 sm:w-12 lg:right-8"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="hero-pagination absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:bottom-8" />

      {/* Lusion-style scroll explore — bottom right */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 right-8 z-10 hidden flex-col items-end gap-1 md:flex"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/50">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-10 w-px origin-top bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
