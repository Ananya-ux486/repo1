"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  X,
  ShieldCheck,
  BadgeCheck,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  FileCheck2,
  Trophy,
  Factory,
  Lock,
} from "lucide-react";
import { lockPageScroll, unlockPageScroll } from "@/lib/scrollLock";
import { pdfLayoutWidth, pdfMaxScale } from "@/lib/devicePerf";
import { usePostLoaderReady } from "@/lib/usePostLoaderReady";

const prefetchedAssets = new Set<string>();

function prefetchAsset(url: string) {
  if (prefetchedAssets.has(url)) return;
  prefetchedAssets.add(url);
  try {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    link.as = url.endsWith(".pdf") ? "fetch" : "script";
    document.head.appendChild(link);
  } catch {
    /* ignore */
  }
}

/* ─── Certificate data (files in /public/certificates/) ─────────── */
const CERTIFICATES = [
  {
    id: "startup-india",
    label: "DPIIT Recognised Startup",
    sublabel: "Startup India · Certificate No. DIPP259927",
    badge: "GOI",
    badgeGradient: "from-sky-500 via-blue-600 to-indigo-700",
    cardGlow: "hover:shadow-blue-200/70",
    borderAccent: "border-blue-200/80",
    iconBg: "bg-blue-50 text-blue-600",
    stripeGradient: "from-sky-500 to-indigo-600",
    file: "/certificates/startup-india.pdf",
    issued: "07 May 2026",
    authority: "Govt. of India",
    Icon: Building2,
  },
  {
    id: "gst",
    label: "GST Registration",
    sublabel: "GSTIN: 09AAZFT7005M1ZA",
    badge: "GST",
    badgeGradient: "from-emerald-500 via-green-600 to-teal-700",
    cardGlow: "hover:shadow-emerald-200/70",
    borderAccent: "border-emerald-200/80",
    iconBg: "bg-emerald-50 text-emerald-600",
    stripeGradient: "from-emerald-500 to-teal-600",
    file: "/certificates/gst-registration.pdf",
    issued: "10 Apr 2026",
    authority: "Govt. of India",
    Icon: FileCheck2,
  },
  {
    id: "iso-9001",
    label: "ISO 9001:2015 Certified",
    sublabel: "Quality Management Systems · ICV Assessments",
    badge: "ISO",
    badgeGradient: "from-orange-500 via-amber-500 to-yellow-500",
    cardGlow: "hover:shadow-orange-200/70",
    borderAccent: "border-orange-200/80",
    iconBg: "bg-orange-50 text-brand",
    stripeGradient: "from-orange-500 to-amber-500",
    file: "/certificates/iso-9001.pdf",
    issued: "13 Apr 2026",
    authority: "ICV Assessments",
    Icon: Trophy,
  },
  {
    id: "udyam",
    label: "MSME Udyam Registration",
    sublabel: "UDYAM-UP-43-0185264 · Micro Enterprise",
    badge: "MSME",
    badgeGradient: "from-violet-500 via-purple-600 to-fuchsia-700",
    cardGlow: "hover:shadow-violet-200/70",
    borderAccent: "border-violet-200/80",
    iconBg: "bg-violet-50 text-violet-600",
    stripeGradient: "from-violet-500 to-purple-600",
    file: "/certificates/udyam-registration.pdf",
    issued: "14 Apr 2026",
    authority: "Ministry of MSME",
    Icon: Factory,
  },
] as const;

type Cert = (typeof CERTIFICATES)[number];

const ease = [0.22, 1, 0.36, 1] as const;

/** Draw repeating watermark on rendered certificate canvas */
function watermarkCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.globalAlpha = 0.11;
  ctx.fillStyle = "#0f172a";
  ctx.font = `bold ${Math.max(18, width / 20)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 5);
  const line = "TASMAFIVE · VIEW ONLY";
  for (let y = -height; y < height; y += 72) {
    ctx.fillText(line, 0, y);
    ctx.fillText(line, -width * 0.35, y + 36);
    ctx.fillText(line, width * 0.35, y + 36);
  }
  ctx.restore();
}

async function clearClipboard() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText("");
    }
  } catch {
    /* denied — ok */
  }
}

/* ─── Canvas PDF Renderer (view-only) ───────────────────────────── */
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
  const hasRenderedRef = useRef(false);
  const lastLayoutWidthRef = useRef(0);

  const renderPage = useCallback(async (pageNum: number, showOverlay = true) => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    if (showOverlay) setLoading(true);
    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          /* ignore */
        }
        renderTaskRef.current = null;
      }

      const page = await pdfDocRef.current.getPage(pageNum);
      const container = containerRef.current;
      const viewportW =
        typeof window !== "undefined" ? window.innerWidth : 680;
      const containerWidth = Math.max(
        260,
        (container?.clientWidth ?? 680) - 8,
      );
      // On phones render wider than the screen so text stays readable;
      // horizontal pan + outer vertical scroll let the whole page move.
      const layoutWidth = pdfLayoutWidth(viewportW, containerWidth);
      if (
        hasRenderedRef.current &&
        lastLayoutWidthRef.current > 0 &&
        Math.abs(layoutWidth - lastLayoutWidthRef.current) < 48
      ) {
        return;
      }
      lastLayoutWidthRef.current = layoutWidth;
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(pdfMaxScale(viewportW), layoutWidth / base.width);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
        canvas,
      });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;

      hasRenderedRef.current = true;
      setLoading(false);
      setError(false);

      const applyWatermark = () => {
        if (!canvasRef.current) return;
        const wctx = canvasRef.current.getContext("2d");
        if (!wctx) return;
        watermarkCanvas(wctx, canvas.width, canvas.height);
      };
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(applyWatermark, { timeout: 600 });
      } else {
        window.setTimeout(applyWatermark, 40);
      }
    } catch (e: unknown) {
      if (e instanceof Error && /cancel/i.test(e.message)) return;
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setCurrentPage(1);
    pdfDocRef.current = null;
    hasRenderedRef.current = false;
    lastLayoutWidthRef.current = 0;

    const load = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        // Hostinger often serves /pdf.worker.min.mjs as text/plain (breaks workers).
        // Use CDN worker, but fetch the PDF on the page origin first and pass bytes
        // so the cross-origin worker never has to fetch the file (CORS).
        const version = pdfjsLib.version || "4.10.38";
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

        const pdfResponse = await fetch(file, {
          cache: "force-cache",
          credentials: "same-origin",
        });
        if (!pdfResponse.ok) {
          throw new Error(`Certificate file HTTP ${pdfResponse.status}`);
        }
        const pdfBytes = new Uint8Array(await pdfResponse.arrayBuffer());
        if (pdfBytes.byteLength < 100) {
          throw new Error("Certificate file is empty or missing.");
        }

        const loadingTask = pdfjsLib.getDocument({
          data: pdfBytes,
          withCredentials: false,
          isEvalSupported: false,
          useSystemFonts: true,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        await renderPage(1);
      } catch (err) {
        console.error("[certificates] load failed:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          /* ignore */
        }
      }
    };
  }, [file, renderPage]);

  useEffect(() => {
    if (!pdfDocRef.current || currentPage < 1) return;
    void renderPage(currentPage, true);
  }, [currentPage, renderPage]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      const onResize = () => {
        if (pdfDocRef.current) void renderPage(currentPage);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
    let t = 0;
    let lastW = el.clientWidth;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (Math.abs(w - lastW) < 40) return;
      lastW = w;
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        if (pdfDocRef.current) void renderPage(currentPage, false);
      }, 180);
    });
    ro.observe(el);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [currentPage, renderPage]);

  return (
    <div
      ref={containerRef}
      className="cert-protected relative flex min-h-[240px] w-full flex-col items-stretch overflow-x-auto overscroll-x-contain bg-slate-100 sm:min-h-[360px] sm:items-center"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-slate-100 px-4 text-center">
          <Lock className="h-8 w-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            Unable to load certificate
          </p>
          <p className="text-xs text-slate-400">
            Check your connection and try again
          </p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="cert-canvas mx-auto block h-auto max-w-none"
        aria-label={label}
        draggable={false}
      />

      {/* Interaction shield — blocks save-as / long-press / selection */}
      <div
        aria-hidden
        className="cert-shield absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onTouchStart={(e) => {
          /* Kill iOS/Android image callout / long-press save */
          if (e.touches.length > 1) e.preventDefault();
        }}
      />

      {/* Extra CSS watermark layer so OS screenshots still show VIEW ONLY */}
      <div aria-hidden className="cert-watermark-layer" />

      {totalPages > 1 && (
        <div className="relative z-20 flex w-full items-center justify-center gap-3 border-t border-slate-100 bg-white/95 py-2.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-slate-600">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Protected Viewer (full overlay scrolls as one unit) ───────── */
function ProtectedViewer({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const [blurred, setBlurred] = useState(false);
  const Icon = cert.Icon;
  const privacyTimer = useRef(0);
  const openedAt = useRef(Date.now());

  const flashPrivacy = useCallback((ms = 2800) => {
    setBlurred(true);
    void clearClipboard();
    window.clearTimeout(privacyTimer.current);
    privacyTimer.current = window.setTimeout(() => {
      if (!document.hidden && document.hasFocus()) setBlurred(false);
    }, ms);
  }, []);

  useEffect(() => {
    // Soft lock — keep html from scrolling under the overlay without body:fixed
    // (body:fixed was collapsing the viewer height on mobile).
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    document.body.classList.add("cert-viewer-open");
    lockPageScroll();
    // Undo body:fixed side-effects from lockPageScroll for this viewer.
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "hidden";

    return () => {
      unlockPageScroll();
      html.style.overflow = prevHtmlOverflow;
      document.body.classList.remove("cert-viewer-open");
      window.clearTimeout(privacyTimer.current);
    };
  }, []);

  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const key = e.key;

      if (key === "PrintScreen" || key === "Snapshot") {
        e.preventDefault();
        e.stopPropagation();
        flashPrivacy(3500);
        return;
      }

      if (
        ((e.ctrlKey || e.metaKey) &&
          ["s", "p", "c", "a", "u"].includes(k)) ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c", "s"].includes(k)) ||
        (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(k))
      ) {
        e.preventDefault();
        e.stopPropagation();
        flashPrivacy(2200);
      }

      if (key === "Escape") onClose();
    };

    const onVis = () => {
      if (Date.now() - openedAt.current < 900) return;
      if (document.hidden || !document.hasFocus()) {
        setBlurred(true);
        void clearClipboard();
      } else {
        setBlurred(false);
      }
    };

    const blockContext = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      flashPrivacy(1600);
    };

    const blockDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", blockKeys, true);
    window.addEventListener("keyup", blockKeys, true);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onVis);
    window.addEventListener("focus", onVis);
    document.addEventListener("contextmenu", blockContext, true);
    document.addEventListener("copy", blockCopy, true);
    document.addEventListener("cut", blockCopy, true);
    document.addEventListener("dragstart", blockDrag, true);
    return () => {
      window.removeEventListener("keydown", blockKeys, true);
      window.removeEventListener("keyup", blockKeys, true);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onVis);
      window.removeEventListener("focus", onVis);
      document.removeEventListener("contextmenu", blockContext, true);
      document.removeEventListener("copy", blockCopy, true);
      document.removeEventListener("cut", blockCopy, true);
      document.removeEventListener("dragstart", blockDrag, true);
    };
  }, [onClose, flashPrivacy]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={cert.label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="cert-viewer-overlay fixed inset-0 z-[2147482000] overflow-y-auto overscroll-contain bg-black/88 sm:bg-black/85"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Outer scroller — title + PDF + footer scroll together */}
      <div className="flex min-h-[100dvh] items-start justify-center px-0 py-0 sm:items-center sm:px-4 sm:py-6 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.32, ease }}
          className="cert-protected relative my-0 w-full max-w-3xl bg-white shadow-2xl sm:my-4 sm:rounded-3xl"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className={`h-1.5 w-full bg-gradient-to-r ${cert.stripeGradient}`} />

          {/* Sticky toolbar so Close always stays reachable while scrolling */}
          <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-3 py-3 backdrop-blur-sm supports-[padding:max(0px)]:pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${cert.iconBg}`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {cert.label}
                </p>
                <p className="truncate text-[11px] text-muted">{cert.sublabel}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:inline-flex">
                <ShieldCheck className="h-3 w-3" /> View Only
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-foreground"
                aria-label="Close viewer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className={`relative transition-[filter] duration-150 ${
              blurred ? "blur-2xl brightness-75 contrast-75" : ""
            }`}
          >
            <CanvasPdfViewer file={cert.file} label={cert.label} />
          </div>

          {blurred && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/55 px-6 text-center">
              <p className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-xl">
                Preview hidden — screenshots &amp; capture tools are blocked
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[11px] text-slate-500">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Protected — download, print, save &amp; screenshot shortcuts are blocked
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Certificate card ──────────────────────────────────────────── */
function CertCard({
  cert,
  index,
  onView,
}: {
  cert: Cert;
  index: number;
  onView: () => void;
}) {
  const Icon = cert.Icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-24px" }}
      transition={{ delay: index * 0.08, duration: 0.55, ease }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition-shadow duration-300 hover:shadow-xl ${cert.cardGlow} ${cert.borderAccent}`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${cert.stripeGradient}`} />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cert.stripeGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]`}
      />

      <div className="relative flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
        <div className="mb-3 flex items-start justify-between gap-2 sm:mb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white shadow-sm sm:h-14 sm:w-14 ${cert.iconBg}`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span
            className={`rounded-full bg-gradient-to-br ${cert.badgeGradient} px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow`}
          >
            {cert.badge}
          </span>
        </div>

        <h3 className="mb-1 text-[15px] font-bold leading-snug text-foreground">
          {cert.label}
        </h3>
        <p className="mb-3 text-[11px] leading-relaxed text-muted sm:mb-4">
          {cert.sublabel}
        </p>

        <div className="mb-3 mt-auto flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 sm:mb-4 sm:px-3.5">
          <div className="min-w-0 pr-2">
            <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              Issued by
            </span>
            <span className="block truncate text-[11px] font-semibold text-foreground">
              {cert.authority}
            </span>
          </div>
          <div className="shrink-0 text-right">
            <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              Date
            </span>
            <span className="text-[11px] font-semibold text-foreground">
              {cert.issued}
            </span>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1.5">
          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className="text-[11px] font-medium text-emerald-600">
            Verified &amp; Active
          </span>
        </div>

        <button
          type="button"
          onClick={onView}
          onPointerEnter={() => prefetchAsset(cert.file)}
          onFocus={() => prefetchAsset(cert.file)}
          className={`inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${cert.stripeGradient} px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md active:scale-[0.98]`}
        >
          <Eye className="h-4 w-4" />
          View Certificate
        </button>
      </div>
    </motion.article>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function CertificatesPageContent() {
  const [active, setActive] = useState<Cert | null>(null);
  const postLoaderReady = usePostLoaderReady(0);

  useEffect(() => {
    if (!postLoaderReady) return;
    const warm = () => {
      prefetchAsset(
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs",
      );
      CERTIFICATES.forEach((c) => prefetchAsset(c.file));
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(warm, 800);
    return () => window.clearTimeout(t);
  }, [postLoaderReady]);

  return (
    <>
      <section className="relative overflow-hidden pastel-section section-glow pb-6 pt-3 sm:pb-8 lg:pb-10 lg:pt-4">
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.45, ease }}
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-sm sm:mb-4 sm:h-14 sm:w-14"
            >
              <Award className="h-6 w-6 sm:h-7 sm:w-7" />
            </motion.div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              Accreditations &amp; Compliance
            </p>
            <h1 className="mt-2 text-[1.75rem] font-black tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
              Our <span className="iridescent-text">Certifications</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Government-recognised, ISO-certified, and fully compliant — view
              official documents securely on any device.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5"
            >
              {CERTIFICATES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-border bg-white/85 px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur-sm transition hover:border-brand/40 hover:text-foreground"
                >
                  <c.Icon className="h-3.5 w-3.5 text-brand" />
                  {c.badge}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-1 sm:pb-16 sm:pt-2 lg:px-8 lg:pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {CERTIFICATES.map((cert, i) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={i}
              onView={() => setActive(cert)}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-8 px-2 text-center text-xs text-muted/70"
        >
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-brand" />
          View-only gallery — right-click, download, print &amp; capture shortcuts
          are blocked on desktop and mobile.
        </motion.p>
      </section>

      <AnimatePresence>
        {active && (
          <ProtectedViewer cert={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
