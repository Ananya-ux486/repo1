"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/siteData";
import "swiper/css";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Google">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function TestimonialCard({
  name,
  role,
  date,
  quote,
}: {
  name: string;
  role: string;
  date: string;
  quote: string;
}) {
  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-5 shadow-xl sm:p-6 lg:max-w-none lg:p-8">
      <Quote
        className="pointer-events-none absolute right-4 top-4 h-14 w-14 text-white/[0.06] sm:h-16 sm:w-16 lg:h-20 lg:w-20"
        aria-hidden
      />

      <div className="mb-4 flex items-center justify-between lg:mb-5">
        <GoogleMark />
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      <p className="relative z-[1] text-sm leading-relaxed text-white/80 lg:text-base">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="relative z-[1] mt-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4 lg:mt-6">
        <div>
          <p className="text-base font-bold text-white lg:text-lg">{name}</p>
          <p className="text-sm font-medium text-brand">{role}</p>
        </div>
        <p className="text-[10px] text-white/40 sm:shrink-0 lg:text-xs">{date}</p>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null);
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
    const timer = window.setInterval(() => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.destroyed) return;
      swiper.slideNext(800);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center lg:mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Happy Customers
          </h2>
        </motion.div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
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
          breakpoints={{
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
          className={`testimonial-swiper !pb-2 !pt-2 ${isMobile ? "!overflow-hidden" : "!overflow-visible"}`}
        >
          {loopSlides.map((t, i) => (
            <SwiperSlide key={`${t.name}-${i}`}>
              <TestimonialCard {...t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
