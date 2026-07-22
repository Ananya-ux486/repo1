"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

const loadFeatures = () =>
  import("@/lib/motionFeatures").then((module) => module.default);

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
