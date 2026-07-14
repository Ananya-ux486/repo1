"use client";

import { useEffect, useState } from "react";
import { releaseDocumentScroll } from "@/lib/scrollLock";

/**
 * Full-screen intro on every hard refresh.
 * CSS-driven so the hex animation always paints reliably.
 */
export default function PageLoader() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    const body = document.body;

    // Language switches reload the page — skip the long intro so it feels instant.
    let skipLoader = false;
    try {
      skipLoader = sessionStorage.getItem("tf-skip-loader") === "1";
      if (skipLoader) sessionStorage.removeItem("tf-skip-loader");
    } catch {
      /* private mode */
    }

    if (skipLoader) {
      body.dataset.tfLoading = "done";
      releaseDocumentScroll();
      window.dispatchEvent(new CustomEvent("tf-loader-done"));
      setPhase("gone");
      return;
    }

    body.dataset.tfLoading = "true";

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      body.dataset.tfLoading = "done";
      releaseDocumentScroll();
      window.dispatchEvent(new CustomEvent("tf-loader-done"));
    };

    const revealTimer = window.setTimeout(() => {
      setPhase("out");
      body.dataset.tfLoading = "revealing";
    }, 2100);

    const hideTimer = window.setTimeout(() => {
      setPhase("gone");
      finish();
    }, 2800);

    const failsafe = window.setTimeout(finish, 4000);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(failsafe);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`tf-loader${phase === "out" ? " tf-loader--out" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading TasmaFive"
    >
      <div className="tf-loader__glow" aria-hidden />
      <div className="tf-loader__stage" aria-hidden>
        <svg className="tf-loader__svg" viewBox="0 0 320 300" fill="none">
          <defs>
            <linearGradient id="tfHexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#fb923c" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="tfHexPulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
              <stop offset="50%" stopColor="#fdba74" stopOpacity="1" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
            <filter id="tfHexGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g
            className="tf-loader__lattice"
            stroke="url(#tfHexStroke)"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M120 40 L160 63 L160 109 L120 132 L80 109 L80 63 Z" />
            <path d="M200 63 L240 86 L240 132 L200 155 L160 132 L160 86 Z" />
            <path d="M80 109 L120 132 L120 178 L80 201 L40 178 L40 132 Z" />
            <path d="M160 109 L200 132 L200 178 L160 201 L120 178 L120 132 Z" />
            <path d="M240 132 L280 155 L280 201 L240 224 L200 201 L200 155 Z" />
            <path d="M120 178 L160 201 L160 247 L120 270 L80 247 L80 201 Z" />
            <path d="M200 178 L240 201 L240 247 L200 270 L160 247 L160 201 Z" />
          </g>

          <path
            className="tf-loader__trace"
            d="M120 40 L160 63 L200 63 L240 86 L280 155 L240 201 L200 270 L160 247 L120 270 L80 247 L40 178 L80 109 L120 40"
            stroke="url(#tfHexPulse)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#tfHexGlow)"
          />

          <circle className="tf-loader__core" cx="160" cy="155" r="6" fill="#f97316" />
          <circle
            className="tf-loader__ring"
            cx="160"
            cy="155"
            r="14"
            fill="none"
            stroke="#f97316"
          />
        </svg>
      </div>

      <p className="tf-loader__brand">TASMAFIVE</p>
      <div className="tf-loader__bar" aria-hidden>
        <span />
      </div>
    </div>
  );
}
