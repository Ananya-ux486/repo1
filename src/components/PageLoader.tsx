"use client";

import { useEffect, useState } from "react";
import { releaseDocumentScroll } from "@/lib/scrollLock";

/**
 * Full-screen intro on every hard refresh.
 * Network diagram + “TasmaFive” → “Solutions” word-by-word reveal.
 */
export default function PageLoader() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    const body = document.body;

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

    let seenBefore = false;
    try {
      seenBefore = localStorage.getItem("tf-seen-loader") === "1";
    } catch {
      /* private mode */
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mem = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;
    const cores = navigator.hardwareConcurrency ?? 4;
    const lowSpec =
      reducedMotion ||
      (mem !== undefined && mem <= 4) ||
      (cores <= 4 && window.innerWidth < 1024);

    const revealMs = reducedMotion ? 700 : seenBefore ? 1900 : lowSpec ? 2200 : 2600;
    const hideMs = reducedMotion ? 1000 : seenBefore ? 2500 : lowSpec ? 2900 : 3300;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      body.dataset.tfLoading = "done";
      releaseDocumentScroll();
      window.dispatchEvent(new CustomEvent("tf-loader-done"));
      try {
        localStorage.setItem("tf-seen-loader", "1");
      } catch {
        /* private mode */
      }
    };

    const revealTimer = window.setTimeout(() => {
      setPhase("out");
      body.dataset.tfLoading = "revealing";
    }, revealMs);

    const hideTimer = window.setTimeout(() => {
      setPhase("gone");
      finish();
    }, hideMs);

    const failsafe = window.setTimeout(finish, hideMs + 1200);

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
      aria-label="Loading TasmaFive Solutions"
    >
      <div className="tf-loader__glow" aria-hidden />

      {/* Tech network diagram */}
      <div className="tf-loader__diagram" aria-hidden>
        <svg className="tf-loader__svg" viewBox="0 0 280 180" fill="none">
          <defs>
            <linearGradient id="tfNetStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#fb923c" stopOpacity="1" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Connection lines — draw on */}
          <g className="tf-loader__links" stroke="url(#tfNetStroke)" strokeWidth="1.6" strokeLinecap="round">
            <path className="tf-loader__link tf-loader__link--1" d="M40 130 L100 70" />
            <path className="tf-loader__link tf-loader__link--2" d="M100 70 L180 55" />
            <path className="tf-loader__link tf-loader__link--3" d="M180 55 L240 95" />
            <path className="tf-loader__link tf-loader__link--4" d="M100 70 L140 130" />
            <path className="tf-loader__link tf-loader__link--5" d="M180 55 L140 130" />
            <path className="tf-loader__link tf-loader__link--6" d="M140 130 L220 145" />
            <path className="tf-loader__link tf-loader__link--7" d="M240 95 L220 145" />
          </g>

          {/* Nodes */}
          <g className="tf-loader__nodes">
            <circle className="tf-loader__node tf-loader__node--1" cx="40" cy="130" r="6" />
            <circle className="tf-loader__node tf-loader__node--2" cx="100" cy="70" r="7" />
            <circle className="tf-loader__node tf-loader__node--3" cx="180" cy="55" r="8" />
            <circle className="tf-loader__node tf-loader__node--4" cx="240" cy="95" r="6.5" />
            <circle className="tf-loader__node tf-loader__node--5" cx="140" cy="130" r="9" />
            <circle className="tf-loader__node tf-loader__node--6" cx="220" cy="145" r="6" />
          </g>

          {/* Center pulse ring on hub */}
          <circle className="tf-loader__hub-ring" cx="140" cy="130" r="16" />
        </svg>
      </div>

      {/* Word-by-word brand name */}
      <h1 className="tf-loader__title" aria-hidden>
        <span className="tf-loader__word tf-loader__word--1">TasmaFive</span>
        <span className="tf-loader__word tf-loader__word--2">Solutions</span>
      </h1>

      <p className="tf-loader__tagline" aria-hidden>
        Smart IT · Real Growth
      </p>

      <div className="tf-loader__bar" aria-hidden>
        <span />
      </div>
    </div>
  );
}
