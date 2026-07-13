"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Eye,
  Target,
  ShieldCheck,
  Sparkles,
  Handshake,
  Lightbulb,
  ArrowRight,
  Code2,
  Cloud,
  Lock,
  BarChart3,
} from "lucide-react";
import {
  aboutMission,
  aboutVision,
  aboutStory,
  aboutTrustReasons,
  aboutValues,
  aboutStats,
  aboutProcess,
  aboutCapabilities,
  industries,
} from "@/data/siteData";
import { images } from "@/data/images";
import { IMAGE_BLUR } from "@/lib/motion";
import { floatEase, floatStagger } from "@/lib/floatMotion";
import { FloatBlock, FloatLine, FloatImageWrap } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";
import MagneticButton from "@/components/MagneticButton";

function AnimatedStat({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;

    const numeric = value.match(/^(\d+(?:\.\d+)?)/);
    if (!numeric) {
      setDisplay(value);
      return;
    }

    const target = parseFloat(numeric[1]);
    const suffix = value.slice(numeric[1].length);
    const isFloat = numeric[1].includes(".");
    const duration = 1100;
    const start = performance.now();

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setDisplay(
        `${isFloat ? current.toFixed(1) : Math.round(current)}${suffix}`,
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, delay: floatStagger(index, 0.06), ease: floatEase }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card rounded-2xl p-4 text-center sm:p-5"
    >
      <p className="text-2xl font-black iridescent-text sm:text-3xl lg:text-4xl">
        {display}
      </p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted sm:text-xs">
        {label}
      </p>
    </motion.div>
  );
}

const capabilityIcons = [Code2, Cloud, Lock, BarChart3];

export default function AboutPageContent() {
  const hero = useScrollReplay(0.12);
  const story = useScrollReplay(0.15);
  const mission = useScrollReplay(0.15);
  const process = useScrollReplay(0.15);
  const capabilities = useScrollReplay(0.15);
  const trust = useScrollReplay(0.15);
  const values = useScrollReplay(0.15);
  const industriesSec = useScrollReplay(0.15);

  return (
    <>
      {/* ── Hero ── */}
      <section
        ref={hero.ref}
        className="relative overflow-hidden pastel-section section-glow pb-7 pt-2 lg:pb-9 lg:pt-3"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div>
            <FloatLine replayKey={hero.replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                About TasmaFive
              </span>
            </FloatLine>
            <FloatLine replayKey={hero.replayKey} delay={0.08} className="mt-1.5">
              <h1 className="text-[1.85rem] font-black leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[2.85rem] lg:leading-[1.12]">
                We build digital products that{" "}
                <span className="iridescent-text">businesses trust</span>
              </h1>
            </FloatLine>
            <FloatBlock
              replayKey={hero.replayKey}
              scroll={false}
              index={2}
              className="mt-2.5 max-w-xl"
            >
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                From Kanpur to global markets — websites, software, cloud, and
                digital growth solutions crafted for performance, security, and
                long-term results.
              </p>
            </FloatBlock>
            <FloatBlock
              replayKey={hero.replayKey}
              scroll={false}
              index={3}
              className="mt-5"
            >
              <div className="flex flex-wrap gap-3">
                <MagneticButton href="/contact?audit=1" variant="primary" openAudit>
                  Get Free Audit
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton href="/projects" variant="outline">
                  View Projects
                </MagneticButton>
              </div>
            </FloatBlock>
          </div>

          <FloatImageWrap
            replayKey={hero.replayKey}
            scroll={false}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-lg sm:aspect-[16/11] lg:aspect-[4/3]"
          >
            <div className="relative h-full min-h-[200px] w-full">
              <Image
                src={images.about.teamCollab}
                alt="TasmaFive team collaborating on digital solutions"
                fill
                priority
                placeholder="blur"
                blurDataURL={IMAGE_BLUR}
                className="object-cover object-[center_22%] sm:object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/20 bg-white/90 p-2.5 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-xs sm:p-3">
                <motion.p
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-[11px] font-semibold uppercase tracking-wider text-brand"
                >
                  Based in Kanpur
                </motion.p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  Serving India & international clients
                </p>
              </div>
            </div>
          </FloatImageWrap>
        </div>
      </section>

      {/* ── Story ── */}
      <section ref={story.ref} className="relative overflow-hidden py-8 lg:py-10">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <FloatImageWrap
            replayKey={story.replayKey}
            scroll={false}
            className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-md sm:aspect-[5/4] lg:order-1"
          >
            <div className="relative h-full min-h-[220px] w-full">
              <Image
                src={images.about.office}
                alt="Modern workspace representing TasmaFive Solutions"
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR}
                className="object-cover object-[center_30%] sm:object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FloatImageWrap>

          <div className="order-1 lg:order-2">
            <FloatLine replayKey={story.replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                {aboutStory.eyebrow}
              </span>
            </FloatLine>
            <FloatLine replayKey={story.replayKey} delay={0.08} className="mt-2">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                {aboutStory.title}
              </h2>
            </FloatLine>
            <div className="mt-4 space-y-3">
              {aboutStory.paragraphs.map((p, i) => (
                <FloatBlock
                  key={i}
                  replayKey={story.replayKey}
                  scroll={false}
                  index={i + 2}
                >
                  <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                    {p}
                  </p>
                </FloatBlock>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section
        ref={mission.ref}
        className="relative overflow-hidden py-8 pastel-section lg:py-10"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center lg:mb-6">
            <FloatLine replayKey={mission.replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Purpose
              </span>
            </FloatLine>
            <FloatLine replayKey={mission.replayKey} delay={0.08} className="mt-2">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Our Mission & Vision
              </h2>
            </FloatLine>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            <motion.article
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: floatEase }}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
                <Image
                  src={images.about.mission}
                  alt="Team aligning on mission and goals"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR}
                  className="object-cover object-[center_25%] transition duration-500 group-hover:scale-105 sm:object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                    <Target className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold">Our Mission</h3>
                </div>
              </div>
              <p className="p-4 text-sm leading-relaxed text-muted sm:p-5 sm:text-[15px]">
                {aboutMission}
              </p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: 0.1, ease: floatEase }}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
                <Image
                  src={images.about.vision}
                  alt="Looking ahead toward digital growth vision"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR}
                  className="object-cover object-[center_25%] transition duration-500 group-hover:scale-105 sm:object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
                    <Eye className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold">Our Vision</h3>
                </div>
              </div>
              <p className="p-4 text-sm leading-relaxed text-muted sm:p-5 sm:text-[15px]">
                {aboutVision}
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ── How We Work ── */}
      <section ref={process.ref} className="relative py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center lg:mb-6">
            <FloatLine replayKey={process.replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                How We Work
              </span>
            </FloatLine>
            <FloatLine replayKey={process.replayKey} delay={0.08} className="mt-2">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                A clear path from idea to launch
              </h2>
            </FloatLine>
            <FloatBlock
              replayKey={process.replayKey}
              scroll={false}
              index={2}
              className="mx-auto mt-2 max-w-2xl"
            >
              <p className="text-sm text-muted">
                Structured delivery so you always know the next step — from free
                audit to post-launch support.
              </p>
            </FloatBlock>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {aboutProcess.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: floatStagger(i, 0.07),
                  ease: floatEase,
                }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow duration-300 hover:border-brand/25 hover:shadow-md sm:p-5"
              >
                <span className="text-xl font-black tabular-nums text-brand/70">
                  {item.step}
                </span>
                <h3 className="mt-2 text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section
        ref={capabilities.ref}
        className="relative overflow-hidden py-8 pastel-section lg:py-10"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end lg:mb-6">
            <div>
              <FloatLine replayKey={capabilities.replayKey}>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                  What We Deliver
                </span>
              </FloatLine>
              <FloatLine
                replayKey={capabilities.replayKey}
                delay={0.08}
                className="mt-2"
              >
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  End-to-end IT capabilities
                </h2>
              </FloatLine>
            </div>
            <FloatBlock
              replayKey={capabilities.replayKey}
              scroll={false}
              index={2}
            >
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:gap-2.5"
              >
                Explore all services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </FloatBlock>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {aboutCapabilities.map((item, i) => {
              const Icon = capabilityIcons[i] ?? Code2;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: floatStagger(i, 0.07),
                    ease: floatEase,
                  }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Numbered stats ── */}
      <section className="relative py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              By The Numbers
            </span>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Results that build trust
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
            {aboutStats.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Trust Us ── */}
      <section
        ref={trust.ref}
        className="relative overflow-hidden py-6 pastel-section section-glow lg:py-8"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-4 grid items-end gap-4 lg:mb-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
            <div>
              <FloatLine replayKey={trust.replayKey}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand sm:text-xs">
                  Why Trust Us
                </span>
              </FloatLine>
              <FloatLine replayKey={trust.replayKey} delay={0.08} className="mt-1.5">
                <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
                  Built for{" "}
                  <span className="iridescent-text">reliability</span>, clarity
                  &amp; growth
                </h2>
              </FloatLine>
              <FloatBlock
                replayKey={trust.replayKey}
                scroll={false}
                index={2}
                className="mt-2.5 max-w-xl"
              >
                <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                  Clients choose TasmaFive because we combine strong engineering
                  with honest process — so your digital investment stays secure
                  and measurable.
                </p>
              </FloatBlock>
            </div>
            <FloatImageWrap
              replayKey={trust.replayKey}
              scroll={false}
              className="relative hidden aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-md lg:block"
            >
              <div className="relative h-full min-h-[160px] w-full">
                <Image
                  src={images.about.trust}
                  alt="Professionals collaborating with trust and clarity"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR}
                  className="object-cover"
                  sizes="40vw"
                />
              </div>
            </FloatImageWrap>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
            {aboutTrustReasons.map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -28 : 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: floatStagger(i, 0.07),
                  ease: floatEase,
                }}
                whileHover={{ scale: 1.015, x: 3 }}
                className="glass-card flex gap-3 rounded-2xl p-4 sm:gap-4 sm:p-5"
              >
                <span className="text-xl font-black tabular-nums text-brand/80 sm:text-2xl">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section ref={industriesSec.ref} className="relative py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center lg:mb-6">
            <FloatLine replayKey={industriesSec.replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Industries
              </span>
            </FloatLine>
            <FloatLine
              replayKey={industriesSec.replayKey}
              delay={0.08}
              className="mt-2"
            >
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Sectors we proudly serve
              </h2>
            </FloatLine>
            <FloatBlock
              replayKey={industriesSec.replayKey}
              scroll={false}
              index={2}
              className="mx-auto mt-2 max-w-2xl"
            >
              <p className="text-sm text-muted">
                From healthcare and education to e-commerce and manufacturing —
                we adapt technology to how your industry actually works.
              </p>
            </FloatBlock>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
            {industries.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: floatStagger(i % 6, 0.04),
                  ease: floatEase,
                }}
                whileHover={{ y: -3 }}
                className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white sm:text-sm">
                    {item.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        ref={values.ref}
        className="relative overflow-hidden py-8 pastel-section lg:py-10"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-5 text-center">
            <FloatLine replayKey={values.replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Our Values
              </span>
            </FloatLine>
            <FloatLine replayKey={values.replayKey} delay={0.08} className="mt-2">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                What guides every project
              </h2>
            </FloatLine>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {aboutValues.map((item, i) => {
              const icons = [ShieldCheck, Lightbulb, Sparkles, Handshake];
              const Icon = icons[i] ?? Sparkles;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: floatStagger(i, 0.06),
                    ease: floatEase,
                  }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow duration-300 hover:border-brand/30 hover:shadow-md sm:p-5"
                >
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: floatEase }}
            className="about-cta-panel relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-orange-50 via-white to-sky-50 px-5 py-8 text-center shadow-sm sm:px-8 sm:py-10"
          >
            <div
              className="about-cta-shine pointer-events-none absolute inset-0"
              aria-hidden
            />
            <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Next Step
            </p>
            <h2 className="relative mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Ready to grow with smart IT solutions?
            </h2>
            <p className="relative mx-auto mt-2 max-w-xl text-sm text-muted sm:text-base">
              Book a free audit — we&apos;ll review your digital setup and share
              a clear plan to improve performance, security, and conversions.
            </p>
            <div className="relative mt-5 flex flex-wrap justify-center gap-3">
              <MagneticButton href="/contact?audit=1" variant="primary" openAudit>
                Get Free Audit
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/services" variant="outline">
                Explore Services
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
