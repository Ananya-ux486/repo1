"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { releaseDocumentScroll } from "@/lib/scrollLock";

const ease = [0.16, 1, 0.3, 1] as const;

/** Smooth wave paths — organic flow, not polygons or orbits */
const WAVES = [
  {
    d: "M 10 55 C 45 20, 75 90, 110 55 S 175 20, 190 55",
    opacity: 0.18,
    width: 0.7,
    delay: 0,
  },
  {
    d: "M 10 100 C 50 55, 80 145, 120 100 S 170 55, 190 100",
    opacity: 0.45,
    width: 1.2,
    delay: 0.08,
  },
  {
    d: "M 10 145 C 40 110, 85 180, 115 145 S 165 110, 190 145",
    opacity: 0.18,
    width: 0.7,
    delay: 0.16,
  },
];

const PULSE_PATH = WAVES[1].d;

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    body.dataset.tfLoading = "true";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const finish = () => {
      body.dataset.tfLoading = "done";
      releaseDocumentScroll();
      window.dispatchEvent(new CustomEvent("tf-loader-done"));
    };

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const exitAt = reduced ? 120 : 450;
    const hideAt = reduced ? 200 : 700;
    const failsafeAt = reduced ? 400 : 1200;

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
      body.dataset.tfLoading = "revealing";
    }, exitAt);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      finish();
    }, hideAt);

    const failsafeTimer = window.setTimeout(finish, failsafeAt);

    const onPageShow = () => {
      if (body.dataset.tfLoading === "true") {
        setVisible(false);
        finish();
      }
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(failsafeTimer);
      window.removeEventListener("pageshow", onPageShow);
      finish();
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting ? 1.02 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.95, ease }}
          className="tf-loader fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#06080f]"
          aria-live="polite"
          aria-label="Loading TasmaFive Solutions"
        >
          {/* Soft vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,rgba(249,115,22,0.07),transparent_70%)]" />

          {/* Wave pulse diagram */}
          <div className="relative mb-16 w-full max-w-md px-8 sm:max-w-lg">
            <svg
              viewBox="0 0 200 200"
              className="h-44 w-full sm:h-52"
              fill="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="tf-wave-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
                  <stop offset="50%" stopColor="#fb923c" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
                <filter id="tf-pulse-blur">
                  <feGaussianBlur stdDeviation="2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {WAVES.map(({ d, opacity, width, delay }, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke={`rgba(148, 163, 184, ${opacity})`}
                  strokeWidth={width}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.1, delay, ease }}
                />
              ))}

              {/* Bright pulse traveling along center wave */}
              <motion.path
                d={PULSE_PATH}
                stroke="url(#tf-wave-glow)"
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="none"
                filter="url(#tf-pulse-blur)"
                initial={{ pathLength: 0, pathOffset: 0 }}
                animate={{
                  pathLength: [0, 0.35, 0],
                  pathOffset: [0, 0.65, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Traveling dot — native SVG motion = buttery smooth */}
              <circle r="5" fill="#f97316" opacity="0.95">
                <animateMotion
                  dur="1.8s"
                  repeatCount="indefinite"
                  path={PULSE_PATH}
                  calcMode="linear"
                />
              </circle>
              <circle r="10" fill="#f97316" opacity="0.2">
                <animateMotion
                  dur="1.8s"
                  repeatCount="indefinite"
                  path={PULSE_PATH}
                  calcMode="linear"
                />
              </circle>

              {/* Code brackets — TasmaFive dev identity */}
              <motion.text
                x="100"
                y="100"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(249, 115, 22, 0.85)"
                fontSize="22"
                fontFamily="monospace"
                fontWeight="700"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: [0.6, 1, 0.6], scale: 1 }}
                transition={{
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.6, ease },
                }}
              >
                {"{ }"}
              </motion.text>
            </svg>

            {/* Floating particles along wave feel */}
            {[0, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-brand/60"
                style={{ left: `${18 + i * 20}%`, top: `${35 + (i % 2) * 28}%` }}
                animate={{ y: [0, -8, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.25,
                }}
              />
            ))}
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: exiting ? 0 : 1, y: exiting ? -8 : 0 }}
            transition={{ delay: exiting ? 0 : 0.15, duration: 0.6, ease }}
            className="relative z-10 text-center"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.55em] text-slate-500 sm:text-[11px]">
              Initializing
            </p>
            <motion.p
              className="mt-3 bg-gradient-to-r from-slate-100 via-orange-200 to-brand bg-clip-text text-sm font-black uppercase tracking-[0.26em] text-transparent sm:text-base"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            >
              TasmaFive Solutions
            </motion.p>
            <p className="mt-3 text-[10px] tracking-[0.35em] text-slate-600">
              Smart IT · Web · Software
            </p>
          </motion.div>

          {/* Sweep progress */}
          <div className="absolute bottom-14 left-1/2 h-px w-48 -translate-x-1/2 overflow-hidden bg-white/[0.08] sm:w-64">
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-brand to-transparent"
              initial={{ x: "-120%" }}
              animate={{ x: "420%" }}
              transition={{ duration: 2.2, ease, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
