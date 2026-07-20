"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { defaultCountry } from "@/data/countryCodes";
import PhoneWithCountryField from "@/components/PhoneWithCountryField";

const auditFocus = [
  "Website performance & SEO",
  "UI / UX & conversion",
  "Security & infrastructure",
  "Mobile / app experience",
  "Full digital presence audit",
  "Other",
];

type Props = {
  onSuccess?: () => void;
  compact?: boolean;
};

export default function AuditReportForm({ onSuccess, compact }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          countryCode: data.countryCodeDial || data.countryCode || defaultCountry.dial,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not submit request.");
      setDone(true);
      form.reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <p className="mt-3 text-lg font-bold text-emerald-900">
          Successfully submitted!
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-emerald-800">
          Your free audit request has been received. Our team will review your
          details and share the report soon.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-5 text-sm font-semibold text-brand transition hover:text-brand-dark hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      {!compact && (
        <div className="mb-1 flex items-start gap-3 border-b border-border/60 pb-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-orange-400 text-white shadow-sm">
            <ClipboardCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              Free Audit Report
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Share your details so we can prepare your report.
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Full name
          </span>
          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
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
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
      </div>

      <PhoneWithCountryField name="phone" required />

      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Company
          </span>
          <input
            name="company"
            placeholder="Company / brand"
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Website
          </span>
          <input
            name="website"
            type="url"
            placeholder="https://"
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          What should we audit?
        </span>
        <select
          name="focus"
          required
          defaultValue=""
          className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="" disabled>
            Select focus area
          </option>
          {auditFocus.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Description
        </span>
        <textarea
          name="message"
          rows={3}
          placeholder="Goals, competitors, or anything we should know…"
          className="w-full resize-y rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
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
            Request free audit report
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
