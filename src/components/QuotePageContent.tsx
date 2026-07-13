"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Calculator,
} from "lucide-react";
import { floatEase } from "@/lib/floatMotion";
import { siteConfig } from "@/data/siteData";
import PhoneWithCountryField from "@/components/PhoneWithCountryField";

const projectTypes = [
  "Website",
  "E-Commerce",
  "Mobile App",
  "Custom Software",
  "Cloud / DevOps",
  "UI/UX Design",
  "Digital Marketing",
  "Other",
];

const budgets = [
  "Under ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000 – ₹2,00,000",
  "₹2,00,000+",
  "Not sure yet",
];

export default function QuotePageContent() {
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
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not submit quote.");
      setDone(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden pb-12 pt-4 lg:pb-16 lg:pt-5">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm transition duration-200 hover:border-brand hover:bg-brand hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contact Us
          </Link>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm transition duration-200 hover:border-brand hover:bg-brand hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalogue
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: floatEase }}
          className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                Project estimate
              </p>
              <h1 className="mt-1 text-2xl font-black text-foreground sm:text-3xl">
                Request a Quote
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Share your project details — we&apos;ll reply with a clear
                scope, timeline, and pricing estimate. This is different from
                Contact Us (general questions).
              </p>
            </div>
          </div>

          {done ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-2 font-bold text-emerald-900">
                Quote request received
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Our team will review and get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-4 text-sm font-semibold text-brand hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3.5">
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Field name="name" label="Full name" required />
                <Field name="email" label="Email" type="email" required />
              </div>
              <PhoneWithCountryField name="phone" required />
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Project type
                </span>
                <select
                  name="projectType"
                  required
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {projectTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Budget range
                </span>
                <select
                  name="budget"
                  required
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select budget
                  </option>
                  {budgets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Project details
                </span>
                <textarea
                  name="details"
                  required
                  rows={4}
                  placeholder="Tell us what you need, timeline, and any must-have features…"
                  className="w-full resize-y rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full min-h-[46px] items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition duration-200 hover:bg-brand-dark hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Submit quote request
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted">
                Or email us at {siteConfig.email}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
