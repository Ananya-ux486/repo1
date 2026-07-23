"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import { useScrollReplay } from "@/lib/useScrollReplay";
import { FloatLine } from "@/components/FloatReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Star, BadgeCheck, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { testimonials, siteConfig } from "@/data/siteData";
import { floatEase } from "@/lib/floatMotion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function GoogleLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function GoogleMarkSmall() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function TestimonialCard({
  name,
  role,
  timeAgo,
  quote,
  avatarColor,
  reviewUrl,
  isActive,
  onSelect,
}: {
  name: string;
  role: string;
  timeAgo: string;
  quote: string;
  avatarColor: string;
  reviewUrl: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = quote.length > 120;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={isActive ? `${name}'s Google review` : `Show ${name}'s review`}
      aria-pressed={isActive}
      onClick={() => {
        if (!isActive) {
          setExpanded(false);
          onSelect();
          return;
        }
        if (isLong) setExpanded((v) => !v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isActive) {
            setExpanded(false);
            onSelect();
          }
          else if (isLong) setExpanded((v) => !v);
        }
      }}
      className={`google-review-card group relative mx-auto block h-full w-full cursor-pointer rounded-[1.5rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.32)] transition-all duration-300 sm:p-6 lg:max-w-[21rem] ${
        isActive
          ? "border-[#1a73e8]/40 shadow-[0_18px_50px_-20px_rgba(26,115,232,0.38)] ring-1 ring-[#1a73e8]/15"
          : "border-border hover:-translate-y-1 hover:border-[#1a73e8]/35 hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.45)]"
      }`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: avatarColor }}
          >
            {name.charAt(0)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow ring-1 ring-border">
            <GoogleMarkSmall />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <BadgeCheck className="h-4 w-4 shrink-0 fill-[#4285F4] text-white" />
          </div>
          <p className="text-xs text-muted">{role}</p>
          <p className="mt-0.5 text-[11px] text-muted/80">{timeAgo}</p>
        </div>
      </div>

      <div className="mb-3 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p
        className={`text-sm leading-relaxed text-foreground/85 ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {quote}
      </p>

      {isLong && isActive && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="mt-2 text-xs font-semibold text-[#1a73e8] hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a73e8] opacity-80 transition hover:opacity-100 group-hover:opacity-100"
      >
        Verify on Google
        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function GoogleReviewsHeader() {
  const { ref, replayKey } = useScrollReplay(0.18);
  const { rating, reviewCount, writeReviewUrl } = siteConfig.googleBusiness;

  return (
    <div ref={ref} className="mb-5 lg:mb-6">
      <FloatLine replayKey={replayKey}>
        <div className="google-reviews-header flex flex-col gap-5 rounded-2xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <GoogleLogo className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Excellent on Google
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-lg font-bold text-foreground">{rating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${
                        i < Math.round(rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted sm:text-sm">
                  ({reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <m.a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ease: floatEase }}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1765cc]"
          >
            Write a review
          </m.a>
        </div>
      </FloatLine>
    </div>
  );
}

export default function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const autoplayResumeRef = useRef<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo(
    () => [...testimonials, ...testimonials].map((item, index) => ({
      ...item,
      key: `${item.name}-${index}`,
      originalIndex: index % testimonials.length,
    })),
    [],
  );

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const startAutoplay = () => {
      swiper.autoplay?.start();
    };

    const frameId = window.requestAnimationFrame(startAutoplay);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper?.params.navigation || typeof swiper.params.navigation === "boolean") {
      return;
    }
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
    swiper.autoplay?.start();
  }, []);

  useEffect(() => {
    return () => {
      if (autoplayResumeRef.current !== null) {
        window.clearTimeout(autoplayResumeRef.current);
      }
    };
  }, []);

  const focusReview = (originalIndex: number) => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.autoplay?.stop();
    if (autoplayResumeRef.current !== null) {
      window.clearTimeout(autoplayResumeRef.current);
    }
    swiper.slideToLoop(originalIndex, 500);
    autoplayResumeRef.current = window.setTimeout(() => {
      swiper.autoplay?.start();
      autoplayResumeRef.current = null;
    }, 4500);
  };

  return (
    <section className="google-reviews-section relative py-8 lg:py-11">
      <div className="mx-auto w-full">
        <GoogleReviewsHeader />

        <div className="relative px-0 lg:px-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setActiveSlide(swiper.realIndex % testimonials.length);
              requestAnimationFrame(() => swiper.autoplay?.start());
            }}
            onSlideChange={(swiper) =>
              setActiveSlide(swiper.realIndex % testimonials.length)
            }
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation!.prevEl = prevRef.current;
                swiper.params.navigation!.nextEl = nextRef.current;
              }
            }}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            centeredSlides={false}
            /* True 3-card desktop slider with the middle review emphasized and no side blank gap. */
            loop
            loopAdditionalSlides={testimonials.length}
            rewind={false}
            watchSlidesProgress
            slidesPerView={1}
            spaceBetween={16}
            speed={700}
            grabCursor
            allowTouchMove
            simulateTouch
            touchStartPreventDefault={false}
            pagination={{
              clickable: true,
              el: ".google-review-pagination",
            }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="testimonial-swiper google-review-swiper tf-swiper-allow-page-scroll !overflow-hidden !pb-2 !pt-1"
          >
            {slides.map((t) => (
              <SwiperSlide key={t.key} className="!h-auto">
                <TestimonialCard
                  name={t.name}
                  role={t.role}
                  timeAgo={t.timeAgo}
                  quote={t.quote}
                  avatarColor={t.avatarColor}
                  reviewUrl={t.reviewUrl}
                  isActive={activeSlide === t.originalIndex}
                  onSelect={() => focusReview(t.originalIndex)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={prevRef}
            type="button"
            aria-label="Previous review"
            className="google-review-nav google-review-nav-prev absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-md transition hover:border-brand/40 hover:text-brand lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="Next review"
            className="google-review-nav google-review-nav-next absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-md transition hover:border-brand/40 hover:text-brand lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="google-review-pagination mt-6 flex justify-center gap-2" />
      </div>
    </section>
  );
}
