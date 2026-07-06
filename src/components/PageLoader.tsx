"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEX_PATHS = [
  "M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z",
  "M50 25 L75 38 L75 62 L50 75 L25 62 L25 38 Z",
  "M50 0 L95 25 L95 75 L50 100 L5 75 L5 25 Z",
];

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const exitTimer = setTimeout(() => setExiting(true), 2200);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 2900);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-pink-100"
        >
          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Geometric hex animation */}
          <div className="relative mb-10 h-32 w-32 sm:h-40 sm:w-40">
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {HEX_PATHS.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke="rgba(249, 115, 22, 0.9)"
                  strokeWidth={i === 0 ? 1.2 : 0.8}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0],
                    rotate: [0, 0, 120, 120],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.25,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ originX: "50%", originY: "50%" }}
                />
              ))}
              {/* Connecting lines */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <motion.line
                  key={`line-${deg}`}
                  x1="50"
                  y1="50"
                  x2={50 + 42 * Math.cos((deg * Math.PI) / 180)}
                  y2={50 + 42 * Math.sin((deg * Math.PI) / 180)}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <motion.circle
                cx="50"
                cy="50"
                r="4"
                fill="#f97316"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </svg>

            {/* Orbiting dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  transformOrigin: `${50 + (i + 1) * 18}px 50%`,
                }}
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.55em] text-muted sm:text-xs">
              Loading
            </p>
            <motion.p
              className="mt-2 text-sm font-bold uppercase tracking-[0.35em] text-foreground sm:text-base"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              Digital Ecosystem
            </motion.p>
            <p className="mt-3 text-[10px] tracking-widest text-brand/80">
              TasmaFive Solutions
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 h-px w-48 -translate-x-1/2 overflow-hidden bg-foreground/10 sm:w-64"
          >
            <motion.div
              className="h-full bg-brand"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
