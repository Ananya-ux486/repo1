"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  MessageCircle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { catalogueFaqs } from "@/data/catalogueData";
import { floatEase, floatStagger } from "@/lib/floatMotion";

const CATEGORIES = ["All", "General", "Pricing & Timeline", "Technical", "Support"];

const categoryColors: Record<string, string> = {
  General: "bg-orange-50 text-orange-700 border-orange-200",
  "Pricing & Timeline": "bg-sky-50 text-sky-700 border-sky-200",
  Technical: "bg-violet-50 text-violet-700 border-violet-200",
  Support: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function CatalogueFaqsContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? catalogueFaqs
      : catalogueFaqs.filter((f) => f.category === activeCategory);

  return (
    <div className="relative overflow-hidden pb-12 pt-4 lg:pb-16 lg:pt-5">
      {/* Hero */}
      <section className="pastel-section section-glow pb-8 pt-6 lg:pb-10 lg:pt-8">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: floatEase }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-lg"
          >
            <HelpCircle className="h-8 w-8" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: floatEase }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-brand"
          >
            FAQs
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: floatEase }}
            className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: floatEase }}
            className="mt-3 text-sm leading-relaxed text-muted sm:text-base"
          >
            Everything you need to know about working with TasmaFive — from
            pricing and timelines to technical stack and post-launch support.
          </motion.p>
        </div>
      </section>

      {/* Category filter */}
      <div className="mx-auto max-w-3xl px-4 pt-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-border bg-white text-muted hover:border-brand/40 hover:text-brand"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ count */}
        <p className="mt-3 text-xs text-muted">
          Showing {filtered.length} question{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        </p>
      </div>

      {/* FAQ list */}
      <section className="mx-auto mt-4 max-w-3xl px-4 pb-8 lg:px-8 lg:pb-10">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((faq, i) => {
              const open = openIndex === i;
              const catColor =
                categoryColors[faq.category] ??
                "bg-slate-50 text-slate-700 border-slate-200";

              return (
                <motion.div
                  key={faq.q}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: 0.35,
                    delay: floatStagger(i, 0.03),
                    ease: floatEase,
                  }}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-300 ${
                    open ? "border-brand/30 shadow-md" : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
                    aria-expanded={open}
                  >
                    <div className="flex-1">
                      <span
                        className={`mb-2 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${catColor}`}
                      >
                        {faq.category}
                      </span>
                      <p className="text-sm font-semibold text-foreground sm:text-base">
                        {faq.q}
                      </p>
                    </div>
                    <span
                      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                        open
                          ? "bg-brand text-white"
                          : "bg-brand/10 text-brand"
                      }`}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: floatEase }}
                      >
                        <p className="border-t border-border/50 px-5 pb-5 pt-3.5 text-sm leading-relaxed text-muted">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, ease: floatEase }}
          className="flex flex-col items-center gap-4 rounded-3xl border border-brand/20 bg-gradient-to-br from-orange-50 via-white to-sky-50 p-7 text-center shadow-sm sm:flex-row sm:text-left"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">
              Still have a question?
            </h3>
            <p className="mt-1 text-sm text-muted">
              Our team typically responds within a few hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
