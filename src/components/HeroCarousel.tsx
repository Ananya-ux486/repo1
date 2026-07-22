"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
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

/** Only slide 1 opens audit form — other slides keep original CTAs */
const primaryCtaBySlideId: Record<
  number,
  { label: string; href: string; openAudit: boolean }
> = {
  1: {
    label: "Get a Free Audit Report",
    href: "/contact?audit=1",
    openAudit: true,
  },
  2: {
    label: "Start Your Project",
    href: "/quote",
    openAudit: false,
  },
  3: {
    label: "Discover AI Solutions",
    href: "/services",
    openAudit: false,
  },
  4: {
    label: "Contact Us Today",
    href: "/contact",
    openAudit: false,
  },
};

function HeroSlideImage({
  src,
  alt,
  priority,
  active,
  animKey,
  objectPosition = "center center",
  shouldLoad,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  active: boolean;
  animKey: number;
  objectPosition?: string;
  shouldLoad: boolean;
}) {
  if (!shouldLoad) {
    return <div className="relative h-full w-full overflow-hidden bg-slate-900" />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      <m.div
        key={active ? `hero-img-${animKey}` : "hero-img-idle"}
        className="absolute inset-0"
        initial={{ scale: 1.02, opacity: 0.65 }}
        animate={
          active
            ? { scale: 1, opacity: 1 }
            : { scale: 1.02, opacity: 0.65 }
        }
        transition={{ duration: 0.5, ease: floatEase }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={priority ? 68 : 55}
          placeholder="blur"
          blurDataURL={IMAGE_BLUR}
          loading={priority ? "eager" : "lazy"}
          className="object-cover max-sm:object-[center_28%] sm:object-center"
          style={{ objectPosition }}
          sizes="100vw"
        />
      </m.div>
      <div className="hero-gradient-overlay absolute inset-0" />
    </div>
  );
}

export default function HeroCarousel() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsCoarsePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slide = heroSlides[activeIndex] ?? heroSlides[0];
  const primaryCta =
    primaryCtaBySlideId[slide.id] ?? primaryCtaBySlideId[1];

  return (
    <section className="hero-carousel-section relative min-h-[460px] w-full overflow-hidden bg-slate-900 -mt-px lg:min-h-[520px]">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        navigation={{}}
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
        /* Desktop trackpad: never let Swiper steal pointer/wheel. Touch phones keep swipe. */
        allowTouchMove={isCoarsePointer}
        simulateTouch={isCoarsePointer}
        touchStartPreventDefault={false}
        touchMoveStopPropagation={false}
        className="h-full w-full tf-swiper-allow-page-scroll"
      >
        {heroSlides.map((s, idx) => {
          const near =
            idx === activeIndex ||
            idx === (activeIndex + 1) % heroSlides.length ||
            idx === (activeIndex - 1 + heroSlides.length) % heroSlides.length;

          return (
            <SwiperSlide key={s.id}>
              <HeroSlideImage
                src={s.image}
                alt={s.heading}
                priority={s.id === 1}
                active={activeIndex === idx}
                animKey={animKey}
                objectPosition={s.objectPosition}
                shouldLoad={near || s.id === 1}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center max-lg:items-end max-lg:pb-[6.5rem]">
        <div className="pointer-events-auto mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="hero-content-panel max-lg:mx-0 overflow-visible">
            <FloatBlock replayKey={animKey} scroll={false} duration={0.65} clip={false}>
              <span className="mb-3 inline-block rounded-full border border-brand/50 bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                TasmaFive Solutions
              </span>
            </FloatBlock>

            <SplitHeading
              key={`heading-${animKey}`}
              replayKey={animKey}
              text={slide.heading}
              highlightWords={highlightMap[slide.id] || []}
              variant="hero"
              className="text-2xl font-black leading-[1.15] tracking-tight sm:text-3xl lg:text-[2.5rem]"
            />

            <FloatBlock
              replayKey={animKey}
              scroll={false}
              index={1}
              duration={0.5}
              clip={false}
            >
              <p className="hero-subtext mt-3 max-w-xl text-sm leading-relaxed md:text-base">
                {slide.subheading}
              </p>
            </FloatBlock>

            <FloatBlock
              replayKey={animKey}
              scroll={false}
              index={2}
              duration={0.5}
              clip={false}
            >
              <div
                key={`hero-cta-${slide.id}-${animKey}`}
                className="mt-5 flex flex-wrap items-center gap-3"
              >
                <MagneticButton
                  href={primaryCta.href}
                  variant="primary"
                  openAudit={primaryCta.openAudit}
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton
                  href={slide.ctaSecondaryHref}
                  variant="outline-on-dark"
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

      <div className="hero-pagination absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 max-lg:bottom-[5.5rem] lg:bottom-8" />
    </section>
  );
}
