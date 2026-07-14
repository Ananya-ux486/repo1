"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock3,
  Calculator,
  ClipboardCheck,
  Headphones,
  Handshake,
  HelpCircle,
  Briefcase,
} from "lucide-react";
import { floatEase, floatStagger } from "@/lib/floatMotion";
import { siteConfig } from "@/data/siteData";
import MagneticButton from "@/components/MagneticButton";
import PhoneWithCountryField from "@/components/PhoneWithCountryField";

const contactReasons = [
  "General inquiry",
  "Website / project discussion",
  "Support / maintenance",
  "Partnership / collaboration",
  "Careers / internship",
  "Billing / payments",
  "Other",
];

const highlights = [
  {
    icon: Headphones,
    title: "Fast response",
    text: "We typically reply within one business day.",
  },
  {
    icon: Handshake,
    title: "Clear next steps",
    text: "Honest guidance — no pressure sales talk.",
  },
  {
    icon: Briefcase,
    title: "Business-ready",
    text: "From startups to enterprises across India & abroad.",
  },
];

const fieldClass =
  "w-full rounded-xl border border-border/80 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function ContactPageContent() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;
    const dial = raw.countryCodeDial || "";
    const data = {
      ...raw,
      phone: [dial, raw.phone].filter(Boolean).join(" ").trim(),
      countryCode: dial,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not send message.");
      setDone(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden contact-page-shell pb-12 pt-3 lg:pb-16 lg:pt-4">
      <div
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: floatEase }}
          className="mb-7 text-center lg:mb-9"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand sm:text-xs">
            Contact
          </p>
          <h1 className="mt-2 text-[1.85rem] font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
            Let&apos;s talk about your{" "}
            <span className="iridescent-text">next move</span>
          </h1>
          <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
            Ask a question, discuss support, or explore partnership — we&apos;re
            here to help.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="/contact?audit=1" variant="primary" openAudit>
              <ClipboardCheck className="h-4 w-4" />
              Get a Free Audit Report
            </MagneticButton>
            <MagneticButton href="/quote?from=contact" variant="outline">
              <Calculator className="h-4 w-4" />
              Need a quote?
            </MagneticButton>
          </div>
        </motion.div>

        {/* Main grid: info + form aligned */}
        <div className="grid items-start gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-6">
          {/* Left — contact details */}
          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: floatEase }}
            className="flex flex-col gap-3"
          >
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:p-6">
              <h2 className="text-lg font-bold text-foreground">
                Reach us directly
              </h2>
              <p className="mt-1 text-sm text-muted">
                Prefer a quick call or email? Use the details below.
              </p>

              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-white px-3.5 py-3 transition hover:border-brand/40 hover:shadow-sm"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        Email
                      </p>
                      <p className="mt-0.5 break-all text-sm font-semibold text-foreground">
                        {siteConfig.email}
                      </p>
                    </div>
                  </a>
                </li>

                <li className="rounded-2xl border border-border/70 bg-white px-3.5 py-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        Phone
                      </p>
                      <div className="mt-0.5 flex flex-col gap-0.5">
                        {siteConfig.phones.map((p) => (
                          <a
                            key={p}
                            href={`tel:${p.replace(/\s/g, "")}`}
                            className="text-sm font-semibold text-foreground transition hover:text-brand"
                          >
                            {p}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-white px-3.5 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Location
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      Kanpur, UP · India
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      {siteConfig.address}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-white px-3.5 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Hours
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      Mon–Sat · 10 AM – 7 PM IST
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-brand/15 bg-gradient-to-br from-orange-50/90 to-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-semibold text-foreground">
                Looking for pricing?
              </p>
              <p className="mt-1 text-sm text-muted">
                Share your requirements and get a clear project estimate.
              </p>
              <Link
                href="/quote?from=contact"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand transition hover:gap-2"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.aside>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: floatEase }}
            className="contact-form-card rounded-3xl border border-border/80 bg-white p-5 shadow-md sm:p-7 lg:p-8"
          >
            <div className="mb-5 flex items-start gap-3 border-b border-border/60 pb-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-orange-400 text-white shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                  Send a message
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  Tell us why you&apos;re reaching out so we can help faster.
                </p>
              </div>
            </div>

            {done ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-10 text-center"
              >
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <p className="mt-3 text-lg font-bold text-emerald-900">
                  Successfully submitted!
                </p>
                <p className="mt-1.5 text-sm text-emerald-800">
                  Thanks — our team will reply soon.
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-5 text-sm font-semibold text-brand transition hover:text-brand-dark hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3.5">
                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                    <HelpCircle className="h-3.5 w-3.5 text-brand" />
                    What are you contacting us about?
                  </span>
                  <select
                    name="reason"
                    required
                    defaultValue=""
                    className={fieldClass}
                  >
                    <option value="" disabled>
                      Select a reason
                    </option>
                    {contactReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Name
                    </span>
                    <input
                      name="name"
                      required
                      placeholder="Your full name"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Email
                    </span>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </label>
                </div>

                <PhoneWithCountryField name="phone" />

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                    Message
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="How can we help?"
                    className={`${fieldClass} resize-y`}
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition duration-200 hover:bg-brand-dark hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Highlights — full width, equal columns */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:mt-8 lg:gap-4">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: floatStagger(i, 0.05) + 0.12,
                  ease: floatEase,
                }}
                className="rounded-2xl border border-border/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:border-brand/35 hover:shadow-md sm:p-5"
              >
                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted sm:text-[13px]">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
