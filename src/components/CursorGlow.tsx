"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -500, y: -500 });
  const visible = useRef(false);
  const rafId = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const paint = () => {
      rafId.current = 0;
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = visible.current ? "1" : "0";
    };

    const schedule = () => {
      if (!rafId.current) rafId.current = requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      visible.current = true;
      schedule();
    };

    const onLeave = () => {
      visible.current = false;
      schedule();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-glow hidden lg:block"
      aria-hidden
      style={{ opacity: 0, willChange: "transform, opacity" }}
    />
  );
}
