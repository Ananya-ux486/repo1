"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, ShieldCheck, BadgeCheck, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

/* ─── Certificate data ─────────────────────────────────────────── */
const CERTIFICATES = [
  {
    id: "startup-india",
    label: "DPIIT Recognised Startup",
    sublabel: "Startup India · Certificate No. DIPP259927",
    badge: "GOI",
    badgeGradient: "from-blue-500 via-blue-600 to-indigo-700",
    cardGlow: "hover:shadow-blue-200/60",
    borderAccent: "border-blue-200",
    iconBg: "bg-blue-50",
    stripeGradient: "from-blue-500 to-indigo-600",
    file: "/certificates/startup-india.pdf",
    issued: "07 May 2026",
    icon: "🇮🇳",
    authority: "Govt. of India",
  },
  {
    id: "gst",
    label: "GST Registration",
    sublabel: "GSTIN: 09AAZFT7005M1ZA",
    badge: "GST",
    badgeGradient: "from-emerald-500 via-green-600 to-teal-700",
    cardGlow: "hover:shadow-green-200/60",
    borderAccent: "border-green-200",
    iconBg: "bg-emerald-50",
    stripeGradient: "from-emerald-500 to-teal-600",
    file: "/certificates/gst-registration.pdf",
    issued: "10 Apr 2026",
    icon: "📋",
    authority: "Govt. of India",
  },
  {
    id: "iso-9001",
    label: "ISO 9001:2015 Certified",
    sublabel: "Quality Management Systems · ICV Assessments",
    badge: "ISO",
    badgeGradient: "from-orange-500 via-amber-500 to-yellow-500",
    cardGlow: "hover:shadow-orange-200/60",
    borderAccent: "border-orange-200",
    iconBg: "bg-orange-50",
    stripeGradient: "from-orange-500 to-amber-500",
    file: "/certificates/iso-9001.pdf",
    issued: "13 Apr 2026",
    icon: "🏆",
    authority: "ICV Assessments",
  },
  {
    id: "udyam",
    label: "MSME Udyam Registration",
    sublabel: "UDYAM-UP-43-0185264 · Micro Enterprise",
    badge: "MSME",
    badgeGradient: "from-purple-500 via-violet-600 to-purple-700",
    cardGlow: "hover:shadow-purple-200/60",
    borderAccent: "border-purple-200",
    iconBg: "bg-purple-50",
    stripeGradient: "from-purple-500 to-violet-600",
    file: "/certificates/udyam-registration.pdf",
    issued: "14 Apr 2026",
    icon: "🏢",
    authority: "Ministry of MSME",
  },
];

type Cert = (typeof CERTIFICATES)[number];

/* ─── Canvas PDF Renderer ───────────────────────────────────────── */
function CanvasPdfViewer({ file, label }: { file: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    try {
      // Cancel any ongoing render
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      const page = await pdfDocRef.current.getPage(pageNum);
      const container = containerRef.current;
      const containerWidth = container ? container.clientWidth - 2 : 680;
      const viewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      const renderTask = page.render({ canvasContext: ctx, viewport: scaledViewport });
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      renderTaskRef.current = null;

      // Draw watermark overlay on canvas
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.font = `bold ${Math.max(18, scaledViewport.width / 20)}px Arial`;
      ctx.fillStyle = "#1e293b";
      ctx.translate(scaledViewport.width / 2, scaledViewport.height / 2);
      ctx.rotate(-Math.PI / 5);
      ctx.textAlign = "center";
      const wm = "TASMAFIVE SOLUTIONS LLP";
      for (let y = -scaledViewport.height; y < scaledViewport.height; y += 120) {
        ctx.fillText(wm, 0, y);
        ctx.fillText(wm, -scaledViewport.width / 2, y + 60);
        ctx.fillText(wm, scaledViewport.width / 2, y + 60);
      }
      ctx.restore();

      setLoading(false);
    } catch (e: unknown) {
      // Ignore cancelled renders
      if (e instanceof Error && e.message === "Rendering cancelled") return;
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setCurrentPage(1);

    const load = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const loadingTask = pdfjsLib.getDocument(file);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        await renderPage(1);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [file, renderPage]);

  useEffect(() => {
    if (pdfDocRef.current) {
      setLoading(true);
      renderPage(currentPage);
    }
  }, [currentPage, renderPage]);

  return (
    <div
      ref={containerRef}
      className="relative select-none bg-slate-100 flex flex-col items-center"
      style={{ minHeight: 460 }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-20 gap-2">
          <p className="text-sm text-slate-500 font-medium">Unable to load certificate</p>
          <p className="text-xs text-slate-400">Please try again later</p>
        </div>
      )}

      {/* Canvas — PDF renders here, no right-click menu */}
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          pointerEvents: "none", // prevents any interaction
        }}
        aria-label={label}
      />

      {/* Transparent shield overlay — blocks all mouse events on canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          cursor: "default",
        }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="relative z-20 flex items-center gap-3 py-2.5 bg-white/90 w-full justify-center border-t border-slate-100">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 disabled:opacity-40 hover:bg-slate-200 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-slate-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 disabled:opacity-40 hover:bg-slate-200 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Protected Viewer Modal ────────────────────────────────────── */
function ProtectedViewer({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  // Block keyboard shortcuts: Ctrl+S, Ctrl+P, Ctrl+C
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "c", "a"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
          style={{ maxHeight: "92dvh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient top bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${cert.stripeGradient}`} />

          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-white px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cert.iconBg} text-xl`}>
                {cert.icon}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{cert.label}</p>
                <p className="truncate text-[11px] text-muted">{cert.sublabel}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3 w-3" /> View Only
              </span>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-foreground"
                aria-label="Close viewer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Canvas viewer — scrollable */}
          <div className="overflow-y-auto flex-1">
            <CanvasPdfViewer file={cert.file} label={cert.label} />
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-center text-[11px] text-slate-400">
            🔒 Protected document — downloading, printing or saving is not permitted
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Certificate card ──────────────────────────────────────────── */
function CertCard({ cert, index, onView }: { cert: Cert; index: number; onView: () => void }) {
  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition-shadow duration-300 hover:shadow-xl ${cert.cardGlow} ${cert.borderAccent}`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${cert.stripeGradient}`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${cert.stripeGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div
            className={`flex items-center justify-center rounded-2xl ${cert.iconBg} text-2xl shadow-sm border border-white`}
            style={{ height: "3.25rem", width: "3.25rem" }}
          >
            {cert.icon}
          </div>
          <span className={`rounded-full bg-gradient-to-br ${cert.badgeGradient} px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow`}>
            {cert.badge}
          </span>
        </div>

        <h3 className="text-[15px] font-bold leading-snug text-foreground mb-1">{cert.label}</h3>
        <p className="text-[11px] leading-relaxed text-muted mb-4">{cert.sublabel}</p>

        <div className="mt-auto mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
          <div>
            <span className="block text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Issued by</span>
            <span className="text-[11px] font-semibold text-foreground">{cert.authority}</span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Date</span>
            <span className="text-[11px] font-semibold text-foreground">{cert.issued}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span className="text-[11px] font-medium text-emerald-600">Verified &amp; Active</span>
        </div>

        <button
          onClick={onView}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${cert.stripeGradient} px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md hover:opacity-90 active:scale-[0.98]`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Certificate
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Page content ──────────────────────────────────────────────── */
export default function CertificatesPageContent() {
  const [active, setActive] = useState<Cert | null>(null);

  return (
    <>
      <section className="relative overflow-hidden pastel-section section-glow pb-8 pt-3 lg:pb-10 lg:pt-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-sm">
              <Award className="h-7 w-7" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              Accreditations &amp; Compliance
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
              Our <span className="iridescent-text">Certifications</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              TasmaFive Solutions is government-recognised, ISO-certified, and fully
              compliant — proof of our commitment to quality, security, and delivery standards.
            </p>
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

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 lg:px-8 lg:pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATES.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} onView={() => setActive(cert)} />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center text-xs text-muted/60"
        >
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" />
          All certificates are view-only. Downloading or saving is disabled to protect document integrity.
        </motion.p>
      </section>

      {active && <ProtectedViewer cert={active} onClose={() => setActive(null)} />}
    </>
  );
}
