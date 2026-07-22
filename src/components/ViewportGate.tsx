"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ViewportGateProps = {
  children: ReactNode;
  /** Placeholder height before section hydrates — prevents layout jump */
  minHeight?: string;
  rootMargin?: string;
};

/**
 * Defers mounting (and hydrating) children until the slot is near the viewport.
 * Same visuals once visible; less work on initial load and during fast scroll.
 */
export default function ViewportGate({
  children,
  minHeight = "480px",
  rootMargin = "280px 0px",
}: ViewportGateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
