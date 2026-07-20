"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Download,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
  Smartphone,
  Cloud,
  Bot,
  Palette,
  Megaphone,
  Briefcase,
  CheckCircle2,
  Star,
  Users,
  Workflow,
  ShieldCheck,
  Timer,
  MessageSquare,
  Headphones,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  catalogueCategories,
  catalogueTechnologies,
  catalogueProcess,
  catalogueFeatures,
  catalogueAudience,
  catalogueFaqs,
} from "@/data/catalogueData";
import { siteConfig } from "@/data/siteData";

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
  Users, Workflow, ShieldCheck, Timer, MessageSquare, Headphones,
];

// ── Page definitions ──────────────────────────────────────────
// Each "page" is a newspaper spread that flips in
const TOTAL_PAGES = 7;

// ── Page flip animation ───────────────────────────────────────
const flipVariants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 90 : -90,
    opacity: 0,
    transformOrigin: dir > 0 ? "left center" : "right center",
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    transformOrigin: "center center",
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -90 : 90,
    opacity: 0,
    transformOrigin: dir > 0 ? "right center" : "left center",
    transition: { duration: 0.45, ease: "easeIn" as const },
  }),
};

// ── Newspaper section divider ─────────────────────────────────
function Rule({ label }: { label: string }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-800" />
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-700">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-800" />
    </div>
  );
}

// ── Column rule (vertical divider) ───────────────────────────
function ColRule() {
  return <div className="mx-3 hidden w-px self-stretch bg-slate-300 sm:block" />;
}

// ── PAGE 1 — Cover / Masthead ─────────────────────────────────
function PageCover() {
  return (
    <div className="newspaper-page">
      {/* Masthead */}
      <div className="border-b-4 border-slate-900 pb-2 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-slate-500">
          Est. 2022 · Kanpur, India · Digital Edition
        </p>
        <h1 className="font-serif text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          TasmaFive
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand sm:text-base">
          Solutions LLP — Technology Brochure
        </p>
      </div>

      {/* Dateline strip */}
      <div className="flex items-center justify-between border-b border-t border-slate-300 py-1 text-[10px] text-slate-500">
        <span>Vol. 4, Issue 2026</span>
        <span className="font-bold text-slate-700">
          &quot;Smart IT Solutions. Full Control. Real Results.&quot;
        </span>
        <span>July 2026</span>
      </div>

      {/* Lead story grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-[1.4fr_1px_1fr]">
        {/* Left — hero story */}
        <div>
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-brand">
            Lead Story
          </p>
          <h2 className="font-serif text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            Building Digital India, One Project at a Time
          </h2>
          <p className="mt-1 text-[11px] italic text-slate-500">
            By TasmaFive Solutions LLP · Kanpur, UP
          </p>

          {/* Hero image — regular img for print */}
          <div className="print-img-wrap my-3 overflow-hidden rounded border border-slate-200">
            <img
              src="/images/expertise/custom-development.jpg"
              alt="TasmaFive technology delivery"
              className="h-44 w-full object-cover sm:h-56"
            />
            <p className="bg-slate-100 px-2 py-0.5 text-[9px] italic text-slate-500">
              TasmaFive team delivering enterprise-grade digital solutions across India and 10+ countries.
            </p>
          </div>

          <p className="text-justify text-[12px] leading-[1.7] text-slate-700 first-letter:float-left first-letter:mr-1 first-letter:font-serif first-letter:text-5xl first-letter:font-black first-letter:leading-none first-letter:text-slate-900">
            TasmaFive Solutions LLP was founded with a singular mission: to bring enterprise-grade technology within reach of every business, from local startups in Kanpur to international enterprises across 10+ countries. Over four years, we have shipped 50+ projects spanning web development, custom software, cloud infrastructure, AI automation, digital marketing, and CRM systems — consistently on time and within budget.
          </p>
          <p className="mt-2 text-justify text-[12px] leading-[1.7] text-slate-700">
            Our team combines modern technology stacks — MERN, Laravel, Next.js, AWS, Azure — with a transparent, client-first process that ensures every stakeholder knows exactly what is being built, why, and when it will land.
          </p>
        </div>

        <ColRule />

        {/* Right — stats + contact */}
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-brand">
            Company at a Glance
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { v: "50+", l: "Projects Delivered" },
              { v: "12+", l: "Industries Served" },
              { v: "5.0 ★", l: "Google Rating" },
              { v: "10+", l: "Countries" },
              { v: "4+", l: "Years Active" },
              { v: "24/7", l: "Support" },
            ].map((s) => (
              <div key={s.l} className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                <p className="font-serif text-xl font-black text-brand">{s.v}</p>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3">
            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-brand">
              Contact
            </p>
            {[
              { icon: Mail, text: siteConfig.email },
              { icon: Phone, text: siteConfig.phones[0] },
              { icon: Phone, text: siteConfig.phones[1] },
              { icon: MapPin, text: siteConfig.address },
              { icon: Globe, text: "tasmafivesolutions.com" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-1.5 py-1 text-[11px] text-slate-700">
                <Icon className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded border border-slate-200">
            <img
              src="/images/about/team-collab.jpg"
              alt="TasmaFive team"
              className="h-32 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAGE 2 — Solution Categories ─────────────────────────────
function PageCategories() {
  return (
    <div className="newspaper-page">
      <Rule label="Solution Categories" />
      <h2 className="font-serif text-2xl font-black text-slate-900 sm:text-3xl">
        Eight Capabilities. One Partner.
      </h2>
      <p className="mt-1 text-[12px] italic text-slate-500">
        Full-spectrum digital services for startups, SMEs, and enterprises.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {catalogueCategories.map((cat, i) => {
          const Icon = categoryIcons[cat.icon] ?? Globe;
          return (
            <div key={cat.title} className="flex gap-3 overflow-hidden rounded border border-slate-200 bg-white">
              <div className="print-img-wrap relative w-24 shrink-0">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full object-cover"
                  style={{ minHeight: "90px" }}
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-2">
                <div className="mb-1 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <h3 className="text-xs font-black text-slate-900">{cat.title}</h3>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">{cat.description}</p>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-brand">
                  0{i + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PAGE 3 — Technology Stack ─────────────────────────────────
function PageTechnology() {
  return (
    <div className="newspaper-page">
      <Rule label="Technology Stack" />
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1px_1fr]">
        <div>
          <h2 className="font-serif text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            The Tools That Power Our Delivery
          </h2>
          <p className="mt-2 text-justify text-[12px] leading-[1.7] text-slate-700">
            Every project starts with choosing the right technology. Our core stack is modern, battle-tested, and chosen for performance, security, and long-term maintainability. We do not follow trends — we follow results.
          </p>
          <p className="mt-2 text-justify text-[12px] leading-[1.7] text-slate-700">
            From React and Next.js powering lightning-fast frontends, to Node.js and Laravel handling robust backends, to PostgreSQL and MongoDB managing structured and flexible data — our full-stack capability means one team handles your entire product lifecycle.
          </p>

          <div className="mt-4 overflow-hidden rounded border border-slate-200">
            <img
              src="/images/blog/ai-web-development.jpg"
              alt="Technology and AI"
              className="h-36 w-full object-cover"
            />
            <p className="bg-slate-100 px-2 py-0.5 text-[9px] italic text-slate-500">
              Modern tech stack in action — AI-augmented development workflows.
            </p>
          </div>
        </div>

        <ColRule />

        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-brand">
            Our Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {catalogueTechnologies.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                {t.name}
              </span>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded border border-slate-200">
            <img
              src="/images/expertise/scalable-solutions.jpg"
              alt="Scalable architecture"
              className="h-28 w-full object-cover"
            />
          </div>

          <div className="mt-3 rounded border border-brand/20 bg-brand/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-brand">
              Also Integrate With
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              Razorpay · Stripe · Twilio · Firebase · Google APIs · Meta APIs · Shopify · WooCommerce · Zoho · Mailchimp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAGE 4 — Delivery Process ─────────────────────────────────
function PageProcess() {
  return (
    <div className="newspaper-page">
      <Rule label="Delivery Process" />
      <div className="grid gap-4 sm:grid-cols-[1fr_1px_1.2fr]">
        <div>
          <h2 className="font-serif text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            From Brief to Long-Term Care
          </h2>
          <p className="mt-2 text-justify text-[12px] leading-[1.7] text-slate-700">
            Our seven-step delivery process is designed for zero surprises. Every stage has a clear owner, a defined output, and a sign-off checkpoint. You always know where your project stands — not because you have to ask, but because we proactively update.
          </p>
          <p className="mt-2 text-justify text-[12px] leading-[1.7] text-slate-700">
            Post-launch, we do not disappear. Maintenance, monitoring, and improvements are part of the engagement — ensuring your digital product stays fast, secure, and relevant as your business evolves.
          </p>

          <div className="mt-4 overflow-hidden rounded border border-slate-200">
            <img
              src="/images/expertise/agile-execution.jpg"
              alt="Agile delivery"
              className="h-36 w-full object-cover"
            />
            <p className="bg-slate-100 px-2 py-0.5 text-[9px] italic text-slate-500">
              Agile execution with sprint cycles and transparent milestone tracking.
            </p>
          </div>
        </div>

        <ColRule />

        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-brand">
            Our 7-Step Process
          </p>
          <div className="space-y-2">
            {catalogueProcess.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-black text-sm text-white shadow">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[12px] font-bold text-slate-900">{step}</p>
                  <p className="text-[10px] text-slate-500">
                    {[
                      "Understanding goals, constraints, and user needs in depth.",
                      "Clear scope, timeline, and resource allocation.",
                      "UX/UI wireframes and design system creation.",
                      "Clean, tested, documented code delivery.",
                      "QA across devices, browsers, and edge cases.",
                      "Smooth go-live with monitoring from day one.",
                      "Ongoing support, updates, and optimisations.",
                    ][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAGE 5 — Why Partner With Us ─────────────────────────────
function PageFeatures() {
  return (
    <div className="newspaper-page">
      <Rule label="Why Partner With Us" />
      <h2 className="font-serif text-2xl font-black text-slate-900 sm:text-3xl">
        Six Reasons Clients Stay, Grow, and Refer
      </h2>
      <p className="mt-1 text-[12px] italic text-slate-500">
        Our delivery standards — built into every project, not bolted on after.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {catalogueFeatures.map((feat, i) => {
          const Icon = featureIcons[i] ?? CheckCircle2;
          return (
            <div key={feat.title} className="overflow-hidden rounded border border-slate-200 bg-white">
              <div className="print-img-wrap">
                <img
                  src={feat.image}
                  alt={feat.title}
                  className="h-28 w-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <div className="mb-1 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <h3 className="text-xs font-black text-slate-900">{feat.title}</h3>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">{feat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PAGE 6 — Built For + FAQs ────────────────────────────────
function PageAudienceFaqs() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="newspaper-page">
      {/* Audience */}
      <Rule label="Built For" />
      <h2 className="font-serif text-xl font-black text-slate-900 sm:text-2xl">
        Teams Ready to Ship Better Digital Products
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {catalogueAudience.map((item) => (
          <div key={item.title} className="overflow-hidden rounded border border-slate-200">
            <img
              src={item.image}
              alt={item.title}
              className="h-28 w-full object-cover"
            />
            <div className="p-2.5">
              <h3 className="text-xs font-black text-slate-900">{item.title}</h3>
              <p className="mt-0.5 text-[11px] text-slate-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="mt-5">
        <Rule label="Frequently Asked Questions" />
        <div className="grid gap-2 sm:grid-cols-2">
          {catalogueFaqs.slice(0, 8).map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="rounded border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left"
                >
                  <p className="text-[11px] font-bold text-slate-800">{faq.q}</p>
                  <ChevronDown
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-brand transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-slate-100 px-3 pb-3 pt-2 text-[11px] leading-relaxed text-slate-600">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── PAGE 7 — Next Steps / CTA ─────────────────────────────────
function PageCta() {
  return (
    <div className="newspaper-page">
      <Rule label="Next Steps" />
      <div className="grid gap-6 sm:grid-cols-[1.2fr_1px_1fr]">
        <div>
          <h2 className="font-serif text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            Ready to Start Your Digital Journey?
          </h2>
          <p className="mt-3 text-justify text-[12px] leading-[1.7] text-slate-700">
            Whether you are launching your first website, scaling an existing platform, or digitising your business operations — TasmaFive Solutions LLP is the partner that takes ownership of outcomes, not just deliverables.
          </p>
          <p className="mt-2 text-justify text-[12px] leading-[1.7] text-slate-700">
            We begin every engagement with a free consultation to understand your goals, review your current setup, and propose a tailored roadmap with clear pricing and timelines. No hidden costs. No vague scope. Just honest, professional technology delivery.
          </p>

          <div className="mt-4 overflow-hidden rounded border border-slate-200">
            <img
              src="/images/hero/slide-2.jpg"
              alt="Build with TasmaFive"
              className="h-40 w-full object-cover"
            />
            <p className="bg-slate-100 px-2 py-0.5 text-[9px] italic text-slate-500">
              Trusted by startups, SMEs, and enterprises across India and 10+ countries worldwide.
            </p>
          </div>
        </div>

        <ColRule />

        <div>
          <div className="rounded border border-brand/20 bg-brand/5 p-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-brand">
              Get in Touch
            </p>
            <div className="mt-3 space-y-2">
              {[
                { icon: Mail, text: siteConfig.email, label: "Email" },
                { icon: Phone, text: siteConfig.phones[0], label: "Phone" },
                { icon: Phone, text: siteConfig.phones[1], label: "WhatsApp" },
                { icon: MapPin, text: siteConfig.address, label: "Office" },
                { icon: Globe, text: "tasmafivesolutions.com", label: "Website" },
              ].map(({ icon: Icon, text, label }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="text-[11px] font-semibold text-slate-800">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded border border-slate-200 bg-slate-900 p-4 text-center print:hidden">
            <p className="text-xs font-bold text-white">Start a Conversation</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/contact"
                className="block rounded-full bg-brand py-2 text-xs font-bold text-white transition hover:bg-orange-400"
              >
                Contact Us
              </Link>
              <Link
                href="/quote"
                className="block rounded-full border border-white/20 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-orange-400 text-orange-400" />
              ))}
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-700">5.0 Google Rating</p>
            <p className="text-[10px] text-slate-500">Verified reviews · Kanpur, India</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t-2 border-slate-900 pt-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          TasmaFive Solutions LLP · {siteConfig.address}
        </p>
        <p className="mt-0.5 text-[10px] text-slate-400">
          {siteConfig.email} · tasmafivesolutions.com · © 2026
        </p>
      </div>
    </div>
  );
}

// ── Page registry ─────────────────────────────────────────────
const PAGES = [
  { title: "Cover", component: PageCover },
  { title: "Solution Categories", component: PageCategories },
  { title: "Technology Stack", component: PageTechnology },
  { title: "Delivery Process", component: PageProcess },
  { title: "Why Partner With Us", component: PageFeatures },
  { title: "Audience & FAQs", component: PageAudienceFaqs },
  { title: "Next Steps", component: PageCta },
];

// ── Main export ───────────────────────────────────────────────
export default function CatalogueBrochurePage() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [mounted, setMounted] = useState(false);

  // Mount guard — prevents hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Hide site chrome via DOM after mount
    const toHide = document.querySelectorAll<HTMLElement>(
      "header.site-header, footer, [data-floating-widgets]"
    );
    toHide.forEach((el) => { el.style.visibility = "hidden"; el.style.pointerEvents = "none"; });
    return () => {
      toHide.forEach((el) => { el.style.visibility = ""; el.style.pointerEvents = ""; });
    };
  }, []);

  const paginate = (dir: number) => {
    const next = page + dir;
    if (next < 0 || next >= TOTAL_PAGES) return;
    setPage([next, dir]);
  };

  const CurrentPage = PAGES[page].component;

  // Print all pages function — renders all pages into a hidden div then prints
  const handlePrint = () => {
    const printWin = window.open("", "_blank", "width=900,height=700");
    if (!printWin) { window.print(); return; }

    // Collect all page HTML
    const container = document.createElement("div");
    document.body.appendChild(container);

    // Copy current stylesheets
    const styles = Array.from(document.styleSheets)
      .map((ss) => {
        try { return Array.from(ss.cssRules).map((r) => r.cssText).join("\n"); }
        catch { return ""; }
      })
      .join("\n");

    // Build print HTML with all pages
    const pageComponents = PAGES.map((p) => p.title);
    const allPagesHtml = document.getElementById("print-all-pages")?.innerHTML ?? "";

    printWin.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>TasmaFive Solutions — Technology Catalogue</title>
      <style>
        body { margin: 0; padding: 16px; background: white; font-family: serif; color: #1e293b; }
        .print-page { page-break-after: always; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 16px; background: white; }
        img { display: block !important; max-width: 100%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media print { .print-page { page-break-after: always; margin: 0; border: none; } }
        ${styles}
      </style>
    </head><body>${allPagesHtml}</body></html>`);
    printWin.document.close();
    setTimeout(() => { printWin.focus(); printWin.print(); }, 600);
    document.body.removeChild(container);
  };

  if (!mounted) {
    // Render nothing on server — prevents hydration mismatch
    return null;
  }

  return (
    <>
      {/* All pages rendered invisibly for print */}
      <div id="print-all-pages" style={{ display: "none" }}>
        {PAGES.map((p, i) => {
          const PageComp = p.component;
          return (
            <div key={i} className="print-page">
              <PageComp />
            </div>
          );
        })}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          #brochure-viewer { display: none !important; }
          #print-all-pages { display: block !important; }
          #print-all-pages .print-page { page-break-after: always; padding: 24px; }
          img { display: block !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* FULL-SCREEN OVERLAY — covers header, footer, everything */}
      <div
        id="brochure-viewer"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#1a1a2e",
        }}
      >
        {/* ── Decorative background ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }} />
          <div style={{ position: "absolute", left: "-8rem", top: "25%", width: "24rem", height: "24rem", borderRadius: "50%", background: "rgba(249,115,22,0.08)", filter: "blur(100px)" }} />
          <div style={{ position: "absolute", right: "-8rem", bottom: "25%", width: "24rem", height: "24rem", borderRadius: "50%", background: "rgba(249,115,22,0.06)", filter: "blur(100px)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(249,115,22,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        {/* ── Toolbar ── */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", padding: "0.5rem 1rem" }}>
          <button
            type="button"
            onClick={() => window.close()}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft style={{ width: "0.875rem", height: "0.875rem" }} />
            Close
          </button>

          {/* Page dots */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {PAGES.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage([i, i > page ? 1 : -1])}
                aria-label={p.title}
                style={{ height: "0.5rem", width: i === page ? "1.5rem" : "0.5rem", borderRadius: "9999px", background: i === page ? "#f97316" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
              />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.5)" }}>
              {page + 1} / {TOTAL_PAGES} · {PAGES[page].title}
            </span>
            <button
              type="button"
              onClick={handlePrint}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: "9999px", background: "#f97316", padding: "0.375rem 0.875rem", fontSize: "0.6875rem", fontWeight: 700, color: "white", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(249,115,22,0.4)" }}
            >
              <Download style={{ width: "0.875rem", height: "0.875rem" }} />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Scrollable newspaper area ── */}
        <div style={{ position: "relative", zIndex: 10, flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "1rem 1.5rem" }}>

            {/* Page flip */}
            <div style={{ perspective: "2000px" }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={flipVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ transformStyle: "preserve-3d", width: "100%" }}
                >
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: "0.75rem", background: "white", boxShadow: "0 20px 80px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ pointerEvents: "none", position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, #000 28px)" }} />
                    <div style={{ padding: "1.5rem 2rem" }}>
                      <CurrentPage />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div style={{ marginTop: "1rem", paddingBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => paginate(-1)}
                disabled={page === 0}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "white", cursor: page === 0 ? "not-allowed" : "pointer", opacity: page === 0 ? 0.3 : 1 }}
              >
                <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
                {page > 0 ? PAGES[page - 1].title : "Previous"}
              </button>

              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{PAGES[page].title}</p>
                <p style={{ margin: 0, fontSize: "0.625rem", color: "rgba(255,255,255,0.4)" }}>Page {page + 1} of {TOTAL_PAGES}</p>
              </div>

              <button
                type="button"
                onClick={() => paginate(1)}
                disabled={page === TOTAL_PAGES - 1}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "white", cursor: page === TOTAL_PAGES - 1 ? "not-allowed" : "pointer", opacity: page === TOTAL_PAGES - 1 ? 0.3 : 1 }}
              >
                {page < TOTAL_PAGES - 1 ? PAGES[page + 1].title : "Next"}
                <ChevronRight style={{ width: "1rem", height: "1rem" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
