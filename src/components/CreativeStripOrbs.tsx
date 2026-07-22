"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";

/** Same animations as before — only run while the orb is on (or near) screen. */
function useOrbActive() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "120px 0px", amount: 0.01 });
  return { ref, active: inView };
}

/** Hex mesh orb — sits to the right of CREATIVE */
export function CreativeHexOrb() {
  const { ref, active } = useOrbActive();

  return (
    <div ref={ref} className="creative-orb creative-orb-hex pointer-events-none" aria-hidden>
      <m.div
        className="creative-orb-inner"
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={
          active
            ? { duration: 28, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c2410c" stopOpacity="1" />
              <stop offset="45%" stopColor="#9a3412" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id="hexCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="88" fill="url(#hexCore)" />
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <polygon
                points="100,20 130,70 100,120 70,70"
                fill="none"
                stroke="url(#hexGrad)"
                strokeWidth="2.2"
                opacity="0.92"
              />
              <polygon
                points="100,40 115,75 100,100 85,75"
                fill="url(#hexGrad)"
                opacity="0.35"
              />
            </g>
          ))}
          <circle cx="100" cy="100" r="42" fill="none" stroke="#9a3412" strokeWidth="1.8" opacity="0.75" />
          <circle cx="100" cy="100" r="26" fill="#0f172a" opacity="0.45" />
        </svg>
      </m.div>
      <m.div
        className="creative-orb-glow creative-orb-glow-orange"
        animate={
          active
            ? { scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }
            : { scale: 1, opacity: 0.55 }
        }
        transition={
          active
            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
    </div>
  );
}

/** Ring wave orb — sits to the left of SOLUTIONS */
export function CreativeRingOrb() {
  const { ref, active } = useOrbActive();

  return (
    <div ref={ref} className="creative-orb creative-orb-ring pointer-events-none" aria-hidden>
      <m.div
        className="creative-orb-inner"
        animate={active ? { rotate: -360 } : { rotate: 0 }}
        transition={
          active
            ? { duration: 22, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#be185d" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#5b21b6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="ringCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="88" fill="url(#ringCore)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={i}
              cx="100"
              cy="100"
              rx={72 - i * 10}
              ry={28 + i * 8}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="2.2"
              opacity={0.85 - i * 0.1}
              transform={`rotate(${i * 18} 100 100)`}
            />
          ))}
          {[0, 45, 90, 135].map((angle) => (
            <line
              key={angle}
              x1="100"
              y1="100"
              x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 70 * Math.sin((angle * Math.PI) / 180)}
              stroke="url(#ringGrad)"
              strokeWidth="1.6"
              opacity="0.7"
            />
          ))}
          <circle cx="100" cy="100" r="18" fill="#0f172a" opacity="0.5" stroke="#6d28d9" strokeWidth="1.5" />
        </svg>
      </m.div>
      <m.div
        className="creative-orb-pulse"
        animate={
          active
            ? { scale: [0.85, 1.12, 0.85], opacity: [0.45, 0.75, 0.45] }
            : { scale: 0.85, opacity: 0.45 }
        }
        transition={
          active
            ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
      <m.div
        className="creative-orb-glow creative-orb-glow-violet"
        animate={
          active
            ? { scale: [1, 1.22, 1], opacity: [0.45, 0.7, 0.45] }
            : { scale: 1, opacity: 0.45 }
        }
        transition={
          active
            ? { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            : { duration: 0 }
        }
      />
    </div>
  );
}

/** Floating particles for extra depth */
export function CreativeParticles({ variant }: { variant: "hex" | "ring" }) {
  const { ref, active } = useOrbActive();
  const colors =
    variant === "hex"
      ? ["#c2410c", "#9a3412", "#1e3a8a"]
      : ["#7c3aed", "#be185d", "#0e7490"];

  return (
    <div ref={ref} className="creative-particles pointer-events-none" aria-hidden>
      {colors.map((color, i) => (
        <m.span
          key={i}
          className="creative-particle"
          style={{ backgroundColor: color }}
          animate={
            active
              ? {
                  y: [0, -12 - i * 4, 0],
                  x: [0, i % 2 === 0 ? 8 : -8, 0],
                  opacity: [0.55, 1, 0.55],
                  scale: [1, 1.5, 1],
                }
              : { y: 0, x: 0, opacity: 0.55, scale: 1 }
          }
          transition={
            active
              ? {
                  duration: 2.5 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }
              : { duration: 0 }
          }
        />
      ))}
    </div>
  );
}
