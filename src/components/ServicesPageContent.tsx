"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Cloud,
  Shield,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Layout,
  Rocket,
  Layers,
  ShoppingBag,
  Check,
  CreditCard,
  MapPin,
  Globe2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  services,
  webDevelopmentServices,
  siteConfig,
} from "@/data/siteData";
import IridescentTitle from "@/components/IridescentTitle";
import { floatEase, floatStagger } from "@/lib/floatMotion";

const mainIcons: Record<string, LucideIcon> = {
  "Web Development": Globe,
  "Cloud Solutions": Cloud,
  "Cyber Security": Shield,
  "Data Analytics": BarChart3,
};

const webDevIcons: Record<string, LucideIcon> = {
  "Static Websites": Layout,
  "Landing Pages": Rocket,
  "Dynamic Websites": Layers,
  "E-Commerce Solutions": ShoppingBag,
};

const accentStyles: Record<
  string,
  { panel: string; badge: string; icon: string; price: string }
> = {
  amber: {
    panel: "bg-[#F6E27A] border-[#E8D056]",
    badge: "bg-slate-900 text-white",
    icon: "bg-slate-900 text-[#F6E27A]",
    price: "text-slate-900",
  },
  coral: {
    panel: "bg-[#FFB088] border-[#F29A6E]",
    badge: "bg-slate-900 text-white",
    icon: "bg-slate-900 text-[#FFB088]",
    price: "text-slate-900",
  },
  sky: {
    panel: "bg-[#9FD4F0] border-[#7BC0E4]",
    badge: "bg-slate-900 text-white",
    icon: "bg-slate-900 text-[#9FD4F0]",
    price: "text-slate-900",
  },
  mint: {
    panel: "bg-[#A8E0C8] border-[#86CFAF]",
    badge: "bg-slate-900 text-white",
    icon: "bg-slate-900 text-[#A8E0C8]",
    price: "text-slate-900",
  },
};

function ServiceDetailBlock({
  id,
  icon: Icon,
  title,
  description,
  features,
  details,
  index,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  details?: string;
  index: number;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: floatStagger(index, 0.05),
        ease: floatEase,
      }}
      className="scroll-mt-28 glass-card rounded-2xl p-5 lg:p-7"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-3 text-muted leading-relaxed">{description}</p>
          {details && (
            <p className="mt-4 text-sm leading-relaxed text-muted/90">
              {details}
            </p>
          )}
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:gap-2"
          >
            Get a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

export function ServicesOverview() {
  const detailServices = services.filter((s) => s.slug !== "web-development");
  const webDev = services.find((s) => s.slug === "web-development");

  return (
    <div className="space-y-6 lg:space-y-8">
      {webDev && (
        <motion.section
          id={webDev.slug}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: floatEase }}
          className="scroll-mt-28 overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-white via-orange-50/40 to-sky-50/50 p-5 shadow-sm lg:p-7"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md">
              <Globe className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-foreground">{webDev.title}</h2>
              <p className="mt-3 text-muted leading-relaxed">{webDev.description}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted/90">
                Choose from Static Websites, Landing Pages, Dynamic Websites, and
                E-Commerce packages — each with clear India &amp; international
                pricing, domain/hosting options, and conversion-focused delivery.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {webDev.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {f}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  Static, Landing, Dynamic &amp; E-Commerce packages
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  Transparent India (₹10k–₹40k) &amp; international pricing
                </li>
              </ul>
              <Link
                href="/services/web-development"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:gap-2"
              >
                View all web packages <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {detailServices.map((service, i) => (
        <ServiceDetailBlock
          key={service.slug}
          id={service.slug}
          icon={mainIcons[service.title] || Cloud}
          title={service.title}
          description={service.description}
          features={service.features}
          details={
            service.slug === "cloud-solutions"
              ? "Migrate, host, and manage your apps on reliable cloud infrastructure — with monitoring, backups, and scale when traffic grows."
              : service.slug === "cyber-security"
                ? "Protect websites and business data with hardening, SSL, access controls, and practical threat-prevention suited to growing brands."
                : "Turn raw numbers into clear reports and dashboards so your team can track performance and make faster decisions."
          }
          index={i}
        />
      ))}
    </div>
  );
}

function WebDevPackageCard({
  service,
  index,
}: {
  service: (typeof webDevelopmentServices)[number];
  index: number;
}) {
  const Icon = webDevIcons[service.title] || Layout;
  const accent = accentStyles[service.accent] ?? accentStyles.amber;
  const fromLeft = index % 2 === 0;

  return (
    <motion.article
      id={service.slug}
      initial={{ opacity: 0, x: fromLeft ? -56 : 56, y: 24 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{
        duration: 0.7,
        delay: 0.05,
        ease: floatEase,
      }}
      className={`scroll-mt-28 overflow-hidden rounded-3xl border ${accent.panel} shadow-sm`}
    >
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.icon}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}
              >
                Package 0{index + 1}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              {service.title}
            </h2>
            <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-slate-800/85 sm:text-lg">
              {service.tagline}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700/80 sm:text-[15px]">
              {service.details}
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {service.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm font-medium text-slate-800"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900/10">
                    <Check className="h-3 w-3 text-slate-900" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`${siteConfig.payNowUrl}?package=${service.slug}`}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800"
            >
              <CreditCard className="h-4 w-4" />
              Pay Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-slate-900/20 bg-white/50 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              Ask a question
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="border-t border-black/10 bg-white/35 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-700">
            Transparent pricing
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <MapPin className="h-3.5 w-3.5" />
                India
              </div>
              <p
                className={`mt-2 text-3xl font-black sm:text-4xl ${accent.price}`}
              >
                {service.indiaPrice}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-slate-700">
                {service.indiaNote}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Globe2 className="h-3.5 w-3.5" />
                International
              </div>
              <p
                className={`mt-2 text-3xl font-black sm:text-4xl ${accent.price}`}
              >
                {service.foreignPrice}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-slate-700">
                {service.foreignNote}
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-slate-600">
            Final scope confirmed after a short brief. Taxes extra where
            applicable.
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function WebDevelopmentDetail() {
  return (
    <div className="space-y-6 lg:space-y-7">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: floatEase }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          Web packages
        </p>
        <h2 className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">
          Clear packages. Clear pricing. Ready to launch.
        </h2>
        <p className="mt-1.5 text-sm text-muted sm:text-base">
          Choose the package that fits your business — every option includes
          professional delivery with India and international pricing.
        </p>
      </motion.div>

      {webDevelopmentServices.map((service, i) => (
        <WebDevPackageCard key={service.slug} service={service} index={i} />
      ))}
    </div>
  );
}

export function ServicesPageHero({
  title,
  subtitle,
  backHref,
  backLabel = "Back to Home",
}: {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mb-4 lg:mb-5">
      {backHref && (
        <div className="mb-2.5 border-b border-border/40 pb-2">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
      )}

      <div className="text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand sm:text-xs">
          What We Do
        </span>
        <div className="mt-1.5">
          <IridescentTitle size="lg" className="!text-[clamp(2rem,5vw,3.25rem)] !leading-[1.1]">
            {title}
          </IridescentTitle>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
