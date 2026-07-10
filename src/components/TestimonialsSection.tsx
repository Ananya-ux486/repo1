"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
}: {
  name: string;
  role: string;
  timeAgo: string;
  quote: string;
  avatarColor: string;
  reviewUrl: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = quote.length > 120;

  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Verify ${name}'s Google review`}
      className="google-review-card group relative mx-auto block h-full max-w-md cursor-pointer rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1a73e8]/35 hover:shadow-lg sm:p-6 lg:max-w-none"
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
        className={`text-sm leading-relaxed text-foreground/85 ${!expanded && isLong ? "line-clamp-4" : ""}`}
      >
        {quote}
      </p>

      {isLong && (
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

      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#1a73e8] opacity-80 transition group-hover:opacity-100">
        Verify on Google
        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </p>
    </a>
  );
}

function GoogleReviewsHeader() {
  const { ref, replayKey } = useScrollReplay(0.18);
  const { rating, reviewCount, writeReviewUrl } = siteConfig.googleBusiness;

  return (
    <div ref={ref} className="mb-8 lg:mb-10">
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

          <motion.a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ease: floatEase }}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1765cc]"
          >
            Review us on Google
          </motion.a>
        </div>
      </FloatLine>
    </div>
  );
}

export default function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const loopSlides = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
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
  }, [isMobile]);

  return (
    <section className="google-reviews-section relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <GoogleReviewsHeader />

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation!.prevEl = prevRef.current;
                swiper.params.navigation!.nextEl = nextRef.current;
              }
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            centeredSlides
            loop
            loopAdditionalSlides={testimonials.length}
            watchSlidesProgress
            slidesPerView={1}
            spaceBetween={16}
            speed={800}
            allowTouchMove={isMobile}
            simulateTouch={isMobile}
            pagination={{
              clickable: true,
              el: ".google-review-pagination",
            }}
            breakpoints={{
              640: { slidesPerView: 1.15, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className={`testimonial-swiper google-review-swiper !pb-2 !pt-2 ${isMobile ? "!overflow-hidden" : "!overflow-visible"}`}
          >
            {loopSlides.map((t, i) => (
              <SwiperSlide key={`${t.name}-${i}`}>
                <TestimonialCard
                  name={t.name}
                  role={t.role}
                  timeAgo={t.timeAgo}
                  quote={t.quote}
                  avatarColor={t.avatarColor}
                  reviewUrl={t.reviewUrl}
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
