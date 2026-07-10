"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { industries } from "@/data/siteData";
import { IMAGE_BLUR } from "@/lib/motion";
import { floatEase } from "@/lib/floatMotion";
import { FloatBlock, FloatImageWrap, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Plane,
  ShoppingCart,
  Factory,
  Dumbbell,
  Truck,
  Car,
  Monitor,
  UtensilsCrossed,
  Shirt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const industryIcons: Record<string, LucideIcon> = {
  "Real Estate": Building2,
  Education: GraduationCap,
  "Doctor/Hospital": HeartPulse,
  Travel: Plane,
  "E-commerce": ShoppingCart,
  Manufacturing: Factory,
  "Gym & Fitness": Dumbbell,
  Logistics: Truck,
  Automobile: Car,
  "IT & Software": Monitor,
  "Hotel & Restaurants": UtensilsCrossed,
  Fashion: Shirt,
};

function OrbitalHub() {
  const orbitItems = industries.slice(0, 8);

  return (
    <div className="orbital-hub relative mx-auto h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px]">
      {/* Ambient glow */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand/20 via-orange-300/10 to-sky-300/20 blur-2xl" />

      {/* Orbital rings — pure CSS, GPU-friendly */}
      <div className="orbital-ring orbital-ring-1" aria-hidden />
      <div className="orbital-ring orbital-ring-2" aria-hidden />
      <div className="orbital-ring orbital-ring-3" aria-hidden />

      {/* Orbiting industry nodes */}
      {orbitItems.map((item, i) => {
        const Icon = industryIcons[item.name] || Monitor;
        return (
          <div
            key={item.name}
            className={`orbital-node orbital-node-${i + 1}`}
            style={{ ["--orbit-start" as string]: `${i * 45}deg` }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/30 bg-white shadow-md sm:h-10 sm:w-10">
              <Icon className="h-4 w-4 text-brand" />
            </div>
          </div>
        );
      })}

      {/* Center core */}
      <div className="absolute left-1/2 top-1/2 z-10 flex h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-white via-sky-50 to-pink-50 text-center shadow-xl sm:h-[140px] sm:w-[140px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand sm:text-xs">
          Industries
        </p>
        <p className="mt-1 text-2xl font-black text-foreground sm:text-3xl">12+</p>
        <p className="text-[10px] font-medium text-muted sm:text-xs">Sectors Served</p>
      </div>
    </div>
  );
}

function IndustryCard({ name, image }: { name: string; image: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, ease: floatEase }}
      className="flex w-[110px] shrink-0 flex-col items-center sm:w-[120px]"
    >
      <FloatImageWrap scroll={false} replayKey={0} className="h-[72px] w-[72px] sm:h-[80px] sm:w-[80px]">
        <div className="relative h-[72px] w-[72px] sm:h-[80px] sm:w-[80px]">
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
            className="object-contain"
            sizes="80px"
          />
        </div>
      </FloatImageWrap>
      <p className="mt-1.5 text-center text-[11px] font-semibold text-brand sm:text-xs">
        {name}
      </p>
    </motion.div>
  );
}

export default function Industry360Section() {
  const slides = [...industries, ...industries];
  const { ref, replayKey } = useScrollReplay(0.15);

  return (
    <section ref={ref} className="relative overflow-hidden py-14 pastel-section lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FloatLine replayKey={replayKey} className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Industries We Empower
          </p>
        </FloatLine>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
          <OrbitalHub />

          <div className="w-full flex-1 overflow-hidden">
            <div className="marquee-track marquee-left flex w-max gap-5 py-2">
              {slides.map((industry, i) => (
                <IndustryCard
                  key={`${industry.name}-${i}`}
                  name={industry.name}
                  image={industry.image}
                />
              ))}
            </div>
            <FloatBlock replayKey={replayKey} scroll={false} index={1} className="mt-6 text-center lg:text-left">
              <p className="text-sm text-muted">
                From real estate to e-commerce — we build digital solutions tailored
                to your industry&apos;s unique needs.
              </p>
            </FloatBlock>
            <div className="mt-4 flex justify-center lg:justify-start">
              <Link
                href="/services"
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
