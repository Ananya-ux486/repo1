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
  Users,
  Workflow,
  ShieldCheck,
  Timer,
  MessageSquare,
  Headphones,
  FileText,
  Sparkles,
  Zap,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  FreeMode,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MagneticButton from "@/components/MagneticButton";
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

// ── Icon mappings ──────────────────────────────────────────────
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

const featureIcons: LucideIcon[] = [
  Users,
  Workflow,
  ShieldCheck,
  Timer,
  MessageSquare,
  Headphones,
];

// ── FAQ category config ────────────────────────────────────────
const faqCategories = ["All", "General", "Pricing & Timeline", "Technical", "Support"] as const;
type FaqCategory = (typeof faqCategories)[number];

const faqCategoryColor: Record<string, string> = {
  General: "bg-orange-100 text-orange-700 border-orange-200",
  "Pricing & Timeline": "bg-sky-100 text-sky-700 border-sky-200",
  Technical: "bg-violet-100 text-violet-700 border-violet-200",
  Support: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// ── Helpers ────────────────────────────────────────────────────
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Coverflow Slide Card ───────────────────────────────────────
interface CoverflowCardProps {
  image: string;
  title: string;
  description: string;
  index: number;
  icon?: LucideIcon;
}

function CoverflowCard({ image, title, description, index, icon: Icon }: CoverflowCardProps) {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl sm:h-[420px]">
      {/* Image */}
      <Image
        src={image}
        alt={title}
        fill
        loading="lazy"
        placeholder="blur"
        blurDataURL={IMAGE_BLUR}
        className="object-cover"
        sizes="(max-width: 640px) 280px, 320px"
      />

      {/* Gradient overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

      {/* Icon badge top-left */}
      {Icon && (
        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-brand/90 text-white shadow-lg backdrop-blur-sm">
          <Icon className="h-4 w-4" />
        </div>
      )}

      {/* Number badge top-right */}
      <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white backdrop-blur-sm">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Content bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-base font-black text-white sm:text-lg">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

// ── Generic Coverflow Section ──────────────────────────────────
interface CoverflowSectionProps {
  eyebrow: string;
  heading: string;
  prefix: string;
  slides: CoverflowCardProps[];
  id?: string;
}

function CoverflowSection({ eyebrow, heading, slides, prefix, id }: CoverflowSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-14 lg:py-20"
    >
      {/* Decorative glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{heading}</h2>
        </div>

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: true,
            }}
            centeredSlides
            slidesPerView="auto"
            loop
            grabCursor
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: `.${prefix}-prev`, nextEl: `.${prefix}-next` }}
            pagination={{ clickable: true, el: `.${prefix}-pagination` }}
            className="!overflow-visible !pb-12"
          >
            {slides.map((slide, i) => (
              <SwiperSlide
                key={`${prefix}-${i}`}
                className="!w-[280px] sm:!w-[320px]"
              >
                <CoverflowCard {...slide} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation arrows */}
          <button
            type="button"
            className={`${prefix}-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-2 flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 bg-slate-900/80 text-brand shadow-xl backdrop-blur-sm transition hover:bg-brand hover:text-white sm:-translate-x-4`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={`${prefix}-next absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 bg-slate-900/80 text-brand shadow-xl backdrop-blur-sm transition hover:bg-brand hover:text-white sm:translate-x-4`}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className={`${prefix}-pagination mt-6 flex justify-center gap-1.5`} />
      </div>
    </section>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function CataloguePageContent() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs =
    activeCategory === "All"
      ? catalogueFaqs
      : catalogueFaqs.filter((f) => f.category === activeCategory);

  // Build slides for each coverflow section
  const categoriesSlides: CoverflowCardProps[] = catalogueCategories.map((cat) => ({
    image: cat.image,
    title: cat.title,
    description: cat.description,
    index: 0,
    icon: categoryIcons[cat.icon] ?? Globe,
  }));

  const featuresSlides: CoverflowCardProps[] = catalogueFeatures.map((feat, i) => ({
    image: feat.image,
    title: feat.title,
    description: feat.description,
    index: i,
    icon: featureIcons[i] ?? Users,
  }));

  const audienceSlides: CoverflowCardProps[] = catalogueAudience.map((item) => ({
    image: item.image,
    title: item.title,
    description: item.text,
    index: 0,
  }));

  return (
    <div className="relative overflow-hidden pb-12 pt-4 lg:pb-16 lg:pt-5">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative pastel-section section-glow pb-10 pt-4 lg:pb-12 lg:pt-6">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-sky-400/5 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: floatEase }}
              className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                {catalogueHero.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: floatEase }}
              className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
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

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: floatEase }}
              className="mt-5 flex flex-wrap gap-6"
            >
              {[
                { label: "Projects Delivered", value: "50+" },
                { label: "Industries", value: "12+" },
                { label: "Google Rating", value: "5.0 ★" },
                { label: "Countries", value: "10+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-black text-brand sm:text-2xl">{stat.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{stat.label}</p>
                </div>
              ))}
            </motion.div>

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
                <Zap className="h-4 w-4" />
                Explore Solutions
              </button>
              <Link
                href="/catalogue/brochure"
                target="_blank"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
              >
                <FileText className="h-4 w-4" />
                View Company Profile
              </Link>
            </motion.div>
          </div>

          {/* Right: hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: floatEase }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-xl">
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
            </div>

            {/* Glassmorphism card */}
            <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-2xl border border-white/30 bg-white/80 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                    TasmaFive Solutions LLP
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    Web · Cloud · AI · Growth
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1">
                  <Star className="h-3 w-3 fill-brand text-brand" />
                  <span className="text-xs font-bold text-brand">5.0</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-3 -top-3 rounded-xl border border-orange-200 bg-white px-3 py-2 shadow-lg"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand">50+ Projects</p>
              <p className="text-[9px] text-muted">Successfully Delivered</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Solution Categories — Coverflow ───────────────────── */}
      <CoverflowSection
        id="solutions"
        eyebrow="Solution categories"
        heading="Capabilities across the full product lifecycle"
        prefix="cat"
        slides={categoriesSlides}
      />

      {/* ── Technology Stack — Marquee ─────────────────────────── */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Stack</p>
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
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="!overflow-visible py-2"
          >
            {[...catalogueTechnologies, ...catalogueTechnologies].map((tech, i) => (
              <SwiperSlide key={`tech-${tech.name}-${i}`} className="!w-auto">
                <div className="inline-flex items-center gap-2.5 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm transition hover:border-brand/35 hover:shadow-md">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black text-white"
                    style={{ backgroundColor: tech.color }}
                  >
                    {tech.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="pr-1 text-sm font-semibold text-foreground">{tech.name}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── Why Partner With Us — Coverflow ───────────────────── */}
      <CoverflowSection
        eyebrow="Why partner with us"
        heading="Premium delivery standards"
        prefix="feat"
        slides={featuresSlides}
      />

      {/* ── Process ───────────────────────────────────────────── */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 text-center">
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
                  transition={{ duration: 0.4, delay: floatStagger(i, 0.05), ease: floatEase }}
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

      {/* ── Built For — Coverflow ──────────────────────────────── */}
      <CoverflowSection
        eyebrow="Built for"
        heading="Teams ready to ship better digital products"
        prefix="aud"
        slides={audienceSlides}
      />

      {/* ── Brochure CTA ──────────────────────────────────────── */}
      <section className="py-10 pastel-section lg:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: floatEase }}
            className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-7 shadow-xl sm:p-10"
          >
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-orange-400/15 blur-3xl" />

            <div className="relative z-[1] grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                  <FileText className="h-3.5 w-3.5 text-orange-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                    Company Profile
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                  Download our full
                  <br />
                  Technology Brochure
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  A complete overview of our capabilities, stack, delivery process, and pricing — ready to share with your team or stakeholders.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/catalogue/brochure"
                    target="_blank"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-orange-400"
                  >
                    <Download className="h-4 w-4" />
                    Download / Print PDF
                  </Link>
                </div>
              </div>

              {/* Brochure preview card */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand">TasmaFive Solutions LLP</p>
                      <p className="mt-0.5 text-sm font-bold text-white">Technology Brochure</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/10 p-2">
                      <FileText className="h-5 w-5 text-white/60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["Who We Are", "Solution Categories", "Technology Stack", "Delivery Process", "Why Partner With Us"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand/60" />
                        <span className="text-xs text-slate-400">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-slate-500">info@tasmafivesolutions.com · tasmafivesolutions.com</p>
                </div>
                <div className="absolute -bottom-2 left-3 right-3 -z-10 h-full rounded-2xl border border-white/5 bg-white/5" />
                <div className="absolute -bottom-4 left-6 right-6 -z-20 h-full rounded-2xl border border-white/5 bg-white/5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────── */}
      <section id="faqs" className="scroll-mt-28 py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">FAQ</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Category filter pills */}
          <div className="mb-7 flex flex-wrap justify-center gap-2">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenFaq(null);
                }}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "border-brand bg-brand text-white shadow-md"
                    : "border-border bg-white text-muted hover:border-brand/40 hover:text-brand"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              const colorClass = faqCategoryColor[faq.category] ?? "bg-slate-100 text-slate-600 border-slate-200";
              return (
                <motion.div
                  key={`${faq.category}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03, ease: floatEase }}
                  className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorClass}`}
                      >
                        {faq.category}
                      </span>
                      <span className="text-sm font-semibold text-foreground sm:text-base">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted">
              Still have questions?{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand underline-offset-2 hover:underline"
              >
                Contact Us →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-10 lg:py-14">
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
                  <strong className="text-foreground">Contact Us</strong> for general questions.{" "}
                  <strong className="text-foreground">Request a Quote</strong> for a project price &amp; timeline estimate.
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
