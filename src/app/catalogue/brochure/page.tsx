"use client";

import Link from "next/link";
import {
  catalogueCategories,
  catalogueTechnologies,
  catalogueProcess,
  catalogueFeatures,
} from "@/data/catalogueData";
import { siteConfig } from "@/data/siteData";

export default function CatalogueBrochurePage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl print:max-w-none">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
              TasmaFive Solutions LLP
            </p>
            <h1 className="mt-1 text-3xl font-black">Technology Brochure</h1>
            <p className="mt-2 text-sm text-slate-600">
              Capabilities · Stack · Process · Partnership standards
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => typeof window !== "undefined" && window.print()}
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white"
            >
              Print / Save PDF
            </button>
            <Link
              href="/catalogue"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
            >
              Back to Catalogue
            </Link>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-orange-600">Who we are</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            TasmaFive Solutions LLP delivers websites, custom software, cloud,
            AI automation, and digital growth systems for startups, SMEs, and
            enterprises — with transparent process and long-term support.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Email: {siteConfig.email} · Phone: {siteConfig.phones.join(" / ")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-orange-600">
            Solution categories
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {catalogueCategories.map((c) => (
              <li
                key={c.title}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <strong>{c.title}</strong>
                <p className="mt-0.5 text-slate-600">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-orange-600">Technology stack</h2>
          <p className="mt-2 text-sm text-slate-700">
            {catalogueTechnologies.map((t) => t.name).join(" · ")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-orange-600">
            Delivery process
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {catalogueProcess.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-orange-600">Why partner</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {catalogueFeatures.map((f) => (
              <li key={f.title}>
                <strong>{f.title}:</strong> {f.description}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-orange-50 p-5">
          <h2 className="text-lg font-bold text-orange-700">Next step</h2>
          <p className="mt-1 text-sm text-slate-700">
            Request a quote or contact our team to map the right solution for
            your business.
          </p>
          <p className="mt-2 text-sm font-semibold">
            {siteConfig.email} · tasmafivesolutions.com
          </p>
        </section>
      </div>
    </main>
  );
}
