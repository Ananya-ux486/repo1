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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services, webDevelopmentServices } from "@/data/siteData";
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
      transition={{ duration: 0.6, delay: floatStagger(index, 0.05), ease: floatEase }}
      className="scroll-mt-28 glass-card rounded-2xl p-6 lg:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-3 text-muted leading-relaxed">{description}</p>
          {details && (
            <p className="mt-4 text-sm leading-relaxed text-muted/90">{details}</p>
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
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => {
          const Icon = mainIcons[service.title] || Globe;
          return (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: floatStagger(i, 0.08), ease: floatEase }}
            >
              <div className="group glass-card flex h-full flex-col rounded-2xl p-6 transition hover:border-brand/40">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted">
                      <span className="h-1 w-1 rounded-full bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand"
                >
                  {service.title === "Web Development" ? "View all services" : "Learn more"}{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 space-y-8">
        <h2 className="text-center text-2xl font-bold text-foreground lg:text-3xl">
          Service Details
        </h2>
        {services
          .filter((s) => s.slug !== "web-development")
          .map((service, i) => (
            <ServiceDetailBlock
              key={service.slug}
              id={service.slug}
              icon={mainIcons[service.title] || Cloud}
              title={service.title}
              description={service.description}
              features={service.features}
              index={i}
            />
          ))}
      </div>
    </>
  );
}

export function WebDevelopmentDetail() {
  return (
    <div className="space-y-8">
      {webDevelopmentServices.map((service, i) => {
        const Icon = webDevIcons[service.title] || Layout;
        return (
          <ServiceDetailBlock
            key={service.slug}
            id={service.slug}
            icon={Icon}
            title={service.title}
            description={service.description}
            features={service.features}
            details={service.details}
            index={i}
          />
        );
      })}
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
    <div className="mb-12 lg:mb-16">
      {backHref && (
        <div className="mb-8 border-b border-border/40 pb-4">
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
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          What We Do
        </span>
        <div className="mt-4">
          <IridescentTitle size="lg">{title}</IridescentTitle>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
