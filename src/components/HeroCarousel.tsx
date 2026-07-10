"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroSlides } from "@/data/siteData";
import { IMAGE_BLUR } from "@/lib/motion";
import { floatEase } from "@/lib/floatMotion";
import { FloatBlock } from "@/components/FloatReveal";
import SplitHeading from "@/components/SplitHeading";
import MagneticButton from "@/components/MagneticButton";

const highlightMap: Record<number, string[]> = {
  1: ["Digital", "Products", "Growth"],
  2: ["Connects", "Business", "World"],
  3: ["Intelligent", "Smarter", "Tomorrow"],
  4: ["Reliable", "Infrastructure", "Count"],
};

function HeroSlideImage({
  src,
  alt,
  priority,
  active,
  animKey,
  objectPosition = "center center",
  shouldLoad = true,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  active: boolean;
  animKey: number;
  objectPosition?: string;
  shouldLoad?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      <motion.div
        key={active ? `hero-img-${animKey}` : "hero-img-idle"}
        className="absolute inset-0"
        initial={{ scale: 1.08, y: 40, opacity: 0.5 }}
        animate={
          active
            ? { scale: 1, y: 0, opacity: 1 }
            : { scale: 1.08, y: 40, opacity: 0.5 }
        }
        transition={{ duration: 1.1, ease: floatEase }}
      >
        {shouldLoad ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={80}
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
            loading={priority ? "eager" : "lazy"}
            className="object-cover"
            style={{ objectPosition }}
            sizes="100vw"
          />
        ) : null}
      </motion.div>
      <div className="hero-gradient-overlay absolute inset-0" />
    </div>
  );
}

export default function HeroCarousel() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const slide = heroSlides[activeIndex];
  const slideCount = heroSlides.length;

  const shouldLoadSlide = (idx: number) => {
    const diff = Math.abs(idx - activeIndex);
    return diff <= 1 || diff === slideCount - 1;
  };

  return (
    <section className="hero-carousel-section relative h-[calc(100svh-var(--tf-header-height))] min-h-[420px] w-full overflow-hidden -mt-px lg:h-[88vh] lg:min-h-[500px]">
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
        onSlideChange={(swiper: SwiperType) => {
          setActiveIndex(swiper.realIndex);
          setAnimKey((k) => k + 1);
        }}
        loop
        className="h-full w-full"
      >
        {heroSlides.map((s, idx) => (
          <SwiperSlide key={s.id}>
            <HeroSlideImage
              src={s.image}
              alt={s.heading}
              priority={s.id === 1}
              active={activeIndex === idx}
              animKey={animKey}
              objectPosition={s.objectPosition}
              shouldLoad={shouldLoadSlide(idx)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center max-lg:items-end max-lg:pb-[7.5rem]">
        <div className="pointer-events-auto mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="hero-content-panel max-lg:mx-0">
            <FloatBlock replayKey={animKey} scroll={false} duration={0.65}>
              <span className="mb-4 inline-block rounded-full border border-brand/50 bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                TasmaFive Solutions
              </span>
            </FloatBlock>

            <SplitHeading
              key={`heading-${animKey}`}
              replayKey={animKey}
              text={slide.heading}
              highlightWords={highlightMap[slide.id] || []}
              variant="hero"
              className="text-3xl font-black leading-[1.1] tracking-tight lg:text-[2.75rem]"
            />

            <FloatBlock replayKey={animKey} scroll={false} index={1} duration={0.7}>
              <p className="hero-subtext mt-4 max-w-xl text-sm leading-relaxed md:text-base">
                {slide.subheading}
              </p>
            </FloatBlock>

            <FloatBlock replayKey={animKey} scroll={false} index={2} duration={0.65}>
              <div className="mt-5 flex flex-wrap gap-3">
                {slide.ctaPrimary ? (
                  <MagneticButton href="/contact" variant="primary">
                    {slide.ctaPrimary}
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                ) : null}
                <MagneticButton
                  href={slide.ctaSecondaryHref}
                  variant="outline"
                  className="!border-white/30 !text-white hover:!bg-white/15 hover:!text-white"
                >
                  {slide.ctaSecondary}
                </MagneticButton>
              </div>
            </FloatBlock>
          </div>
        </div>
      </div>

      <button
        ref={prevRef}
        className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition hover:border-brand/50 hover:bg-brand/20 sm:left-4 sm:h-12 sm:w-12 lg:flex lg:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        ref={nextRef}
        className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition hover:border-brand/50 hover:bg-brand/20 sm:right-4 sm:h-12 sm:w-12 lg:flex lg:right-8"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="hero-pagination absolute bottom-[5.75rem] left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:bottom-8" />
    </section>
  );
}
