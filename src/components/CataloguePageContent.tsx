"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe,
  Smartphone,
  Cloud,
  Bot,
  Palette,
  Megaphone,
  Briefcase,
  ArrowRight,
  Download,
  ChevronDown,
  Users,
  Workflow,
  ShieldCheck,
  Timer,
  MessageSquare,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import MagneticButton from "@/components/MagneticButton";
import CatalogueFanReveal from "@/components/CatalogueFanReveal";
import { floatEase, floatStagger } from "@/lib/floatMotion";
import { IMAGE_BLUR } from "@/lib/motion";
import { images } from "@/data/images";
import {
  catalogueHero,
  catalogueCategories,
  catalogueTechnologies,
  catalogueFeatures,
  catalogueProcess,
  catalogueFaqs,
  catalogueAudience,
} from "@/data/catalogueData";

const categoryIcons: Record<string, LucideIcon> = {
  building: Building2,
  globe: Globe,
  smartphone: Smartphone,
  cloud: Cloud,
  bot: Bot,
  palette: Palette,
  megaphone: Megaphone,
  briefcase: Briefcase,
};

const featureIcons = [
  Users,
  Workflow,
  ShieldCheck,
  Timer,
  MessageSquare,
  Headphones,
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CataloguePageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative overflow-hidden pb-12 pt-4 lg:pb-16 lg:pt-5">
      {/* ── Hero ── */}
      <section className="relative pastel-section section-glow pb-8 pt-4 lg:pb-10 lg:pt-6">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: floatEase }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-brand"
            >
              {catalogueHero.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: floatEase }}
              className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              {catalogueHero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: floatEase }}
              className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
            >
              {catalogueHero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: floatEase }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={() => scrollToId("solutions")}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark"
              >
                Explore Solutions
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/catalogue/brochure"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
              >
                <Download className="h-4 w-4" />
                Download Brochure
              </Link>
            </motion.div>
            <p className="mt-3 text-xs text-muted">
              Explore Solutions scrolls to categories · Brochure opens a printable
              PDF-ready page
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: floatEase }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-lg"
          >
            <Image
              src={images.expertise.customDevelopment}
              alt="TasmaFive technology delivery"
              fill
              priority
              placeholder="blur"
              blurDataURL={IMAGE_BLUR}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/90 p-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                TasmaFive Solutions LLP
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                Web · Cloud · AI · Growth systems
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <CatalogueFanReveal />

      {/* Audience */}
      <section className="py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Built for
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Teams ready to ship better digital products
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {catalogueAudience.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{
                  duration: 0.45,
                  delay: floatStagger(i, 0.06),
                  ease: floatEase,
                }}
                whileHover={{ y: -5 }}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section
        id="solutions"
        className="scroll-mt-28 py-8 pastel-section lg:py-10"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Solution categories
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Capabilities across the full product lifecycle
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {catalogueCategories.map((cat, i) => {
              const Icon = categoryIcons[cat.icon] || Globe;
              return (
                <motion.article
                  key={cat.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: floatStagger(i % 4, 0.05),
                    ease: floatEase,
                  }}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:border-brand/30 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-brand shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{cat.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {cat.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech slider with icons */}
      <section className="py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Stack
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Technologies we work with
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, FreeMode]}
            freeMode
            loop
            slidesPerView="auto"
            spaceBetween={12}
            speed={4000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="!overflow-visible py-2"
          >
            {[...catalogueTechnologies, ...catalogueTechnologies].map(
              (tech, i) => (
                <SwiperSlide key={`${tech.name}-${i}`} className="!w-auto">
                  <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm transition hover:border-brand/35 hover:shadow-md">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black text-white"
                      style={{ backgroundColor: tech.color }}
                    >
                      {tech.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="pr-1 text-sm font-semibold text-foreground">
                      {tech.name}
                    </span>
                  </div>
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </div>
      </section>

      {/* Features with images */}
      <section className="py-8 pastel-section lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Why partner with us
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Premium delivery standards
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogueFeatures.map((feat, i) => {
              const Icon = featureIcons[i] || CheckCircle2;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: floatStagger(i % 3, 0.06),
                    ease: floatEase,
                  }}
                  whileHover={{ y: -5 }}
                  className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={feat.image}
                      alt={feat.title}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-foreground">{feat.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Development process
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              From brief to long-term care
            </h2>
          </div>
          <div className="relative overflow-x-auto pb-2">
            <div className="flex min-w-[720px] items-stretch gap-0 px-1 lg:min-w-0 lg:justify-between">
              {catalogueProcess.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{
                    duration: 0.4,
                    delay: floatStagger(i, 0.05),
                    ease: floatEase,
                  }}
                  className="relative flex flex-1 flex-col items-center px-1 text-center"
                >
                  {i < catalogueProcess.length - 1 && (
                    <span className="absolute left-[calc(50%+18px)] top-4 hidden h-0.5 w-[calc(100%-36px)] bg-gradient-to-r from-brand/50 to-brand/10 lg:block" />
                  )}
                  <span className="relative z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-md">
                    {i + 1}
                  </span>
                  <p className="mt-2 max-w-[100px] text-xs font-semibold leading-snug text-foreground sm:text-sm">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 pastel-section lg:py-10">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              FAQ
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Common questions
            </h2>
          </div>
          <div className="space-y-2.5">
            {catalogueFaqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: floatStagger(i, 0.04),
                    ease: floatEase,
                  }}
                  className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
                    aria-expanded={open}
                  >
                    <span className="text-sm font-semibold text-foreground sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-brand transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: floatEase }}
                      >
                        <p className="border-t border-border/60 px-4 pb-4 pt-3 text-sm leading-relaxed text-muted sm:px-5">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.5, ease: floatEase }}
            className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-orange-50 via-white to-sky-50 shadow-sm"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[220px] lg:min-h-full">
                <Image
                  src={images.hero.slide2}
                  alt="Build with TasmaFive"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent lg:bg-gradient-to-l" />
              </div>
              <div className="flex flex-col justify-center px-6 py-8 text-left sm:px-8 sm:py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                  Next step
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  Ready to build with TasmaFive?
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted sm:text-base">
                  <strong className="text-foreground">Contact Us</strong> for
                  general questions.{" "}
                  <strong className="text-foreground">Request a Quote</strong>{" "}
                  for a project price &amp; timeline estimate.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <MagneticButton href="/contact" variant="primary">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton href="/quote" variant="outline">
                    Request a Quote
                  </MagneticButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
