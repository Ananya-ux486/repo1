"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, ArrowRight, ShieldCheck } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="relative flex min-h-[min(70vh,640px)] items-center justify-center section-glow py-10 lg:py-12">
      <div className="mx-auto max-w-xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-border/70 bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-10"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Award className="h-8 w-8" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Coming next
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
          <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-foreground/70">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            This section will be updated with official certificates soon.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
