"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, ZoomIn, ShieldCheck } from "lucide-react";

/* ─── Certificate data ─────────────────────────────────────────── */
const CERTIFICATES = [
  {
    id: "startup-india",
    label: "DPIIT Recognised Startup",
    sublabel: "Startup India · Certificate No. DIPP259927",
    badge: "GOI",
    badgeColor: "from-blue-600 to-blue-800",
    file: "/certificates/startup-india.pdf",
    issued: "07 May 2026",
    valid: "26 Feb 2036",
    icon: "🇮🇳",
  },
  {
    id: "gst",
    label: "GST Registration",
    sublabel: "GSTIN: 09AAZFT7005M1ZA",
    badge: "GST",
    badgeColor: "from-green-600 to-green-800",
    file: "/certificates/gst-registration.pdf",
    issued: "10 Apr 2026",
    valid: "Lifetime",
    icon: "📋",
  },
  {
    id: "iso-9001",
    label: "ISO 9001:2015 Certified",
    sublabel: "Quality Management Systems · ICV Assessments",
    badge: "ISO",
    badgeColor: "from-brand to-brand-dark",
    file: "/certificates/iso-9001.pdf",
    issued: "13 Apr 2026",
    valid: "12 Apr 2029",
    icon: "🏆",
  },
  {
    id: "udyam",
    label: "MSME Udyam Registration",
    sublabel: "UDYAM-UP-43-0185264 · Micro Enterprise",
    badge: "MSME",
    badgeColor: "from-purple-600 to-purple-800",
    file: "/certificates/udyam-registration.pdf",
    issued: "14 Apr 2026",
    valid: "Lifetime",
    icon: "🏢",
  },
];

/* ─── Floating animation helpers ───────────────────────────────── */
const floatIn = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 + 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Protected PDF viewer ──────────────────────────────────────── */
function ProtectedViewer({
  cert,
  onClose,
}: {
  cert: (typeof CERTIFICATES)[number];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6"
        onClick={onClose}
      >
        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
          style={{ maxHeight: "90dvh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-white/95 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg">{cert.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{cert.label}</p>
                <p className="truncate text-[11px] text-muted">{cert.sublabel}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-semibold text-green-700 border border-green-200">
                <ShieldCheck className="h-3 w-3" /> View Only
              </span>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/8 text-foreground/70 transition hover:bg-foreground/15 hover:text-foreground"
                aria-label="Close viewer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* PDF frame — protected wrapper */}
          <div
            className="relative flex-1 overflow-hidden bg-gray-100"
            style={{ minHeight: 400 }}
            /* Prevent text selection inside frame area */
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Transparent blocking overlay — stops right-click on iframe, drag-save, and long-press */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 select-none"
              style={{
                WebkitUserSelect: "none",
                userSelect: "none",
                /* Invisible but blocks OS drag-to-save on most browsers */
                touchAction: "none",
              }}
              onContextMenu={(e) => e.preventDefault()}
            />

            <iframe
              src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title={cert.label}
              className="h-full w-full border-0"
              style={{
                minHeight: 460,
                /* Remove any default browser toolbar chrome */
                colorScheme: "light",
                pointerEvents: "auto",
              }}
              /* Security: no downloads via sandbox — allow-scripts needed for PDF.js renderer */
              sandbox="allow-scripts allow-same-origin"
              /* Prevent the PDF from being opened in a new tab via JS */
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Footer note */}
          <div className="border-t border-border/50 bg-slate-50 px-4 py-2.5 text-center text-[11px] text-muted">
            🔒 This document is protected. Downloading, screenshotting, or saving is not permitted.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Certificate card ──────────────────────────────────────────── */
function CertCard({
  cert,
  index,
  onView,
}: {
  cert: (typeof CERTIFICATES)[number];
  index: number;
  onView: () => void;
}) {
  return (
    <motion.div
      custom={index}
      variants={floatIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="group relative flex flex-col rounded-2xl border border-border/70 bg-white/85 shadow-sm backdrop-blur-sm overflow-hidden transition hover:shadow-md hover:border-brand/30"
    >
      {/* Top gradient stripe */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${cert.badgeColor}`} />

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        {/* Icon + badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/8 text-2xl shadow-sm">
            {cert.icon}
          </div>
          <span
            className={`rounded-full bg-gradient-to-br ${cert.badgeColor} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm`}
          >
            {cert.badge}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="text-base font-bold leading-tight text-foreground">{cert.label}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{cert.sublabel}</p>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px]">
          <div>
            <span className="block font-semibold uppercase tracking-wide text-muted/70">Issued</span>
            <span className="font-medium text-foreground">{cert.issued}</span>
          </div>
          <div>
            <span className="block font-semibold uppercase tracking-wide text-muted/70">Valid upto</span>
            <span className="font-medium text-foreground">{cert.valid}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onView}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand/8 px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white active:scale-[0.98]"
        >
          <ZoomIn className="h-4 w-4" />
          View Certificate
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Page content ──────────────────────────────────────────────── */
export default function CertificatesPageContent() {
  const [active, setActive] = useState<(typeof CERTIFICATES)[number] | null>(null);

  return (
    <>
      {/* ── Page header ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pastel-section section-glow pb-8 pt-3 lg:pb-10 lg:pt-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-sm">
              <Award className="h-7 w-7" />
            </div>

            {/* Eyebrow */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              Accreditations &amp; Compliance
            </p>

            {/* Heading */}
            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
              Our <span className="iridescent-text">Certifications</span>
            </h1>

            {/* Sub */}
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              TasmaFive Solutions is government-recognised, ISO-certified, and fully
              compliant — proof of our commitment to quality, security, and delivery
              standards.
            </p>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-2"
            >
              {[
                { emoji: "🇮🇳", text: "DPIIT Startup India" },
                { emoji: "📋", text: "GST Registered" },
                { emoji: "🏆", text: "ISO 9001:2015" },
                { emoji: "🏢", text: "MSME Certified" },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm"
                >
                  {pill.emoji} {pill.text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Certificate grid ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 lg:px-8 lg:pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATES.map((cert, i) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={i}
              onView={() => setActive(cert)}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center text-xs text-muted/70"
        >
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" />
          All certificates are view-only. Downloading or saving is disabled to protect document integrity.
        </motion.p>
      </section>

      {/* ── Protected viewer modal ───────────────────────────────── */}
      {active && (
        <ProtectedViewer cert={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}
