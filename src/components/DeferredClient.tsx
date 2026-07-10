"use client";

import dynamic from "next/dynamic";
import { usePostLoaderReady } from "@/lib/usePostLoaderReady";

const CursorGlow = dynamic(() => import("@/components/CursorGlow"), { ssr: false });
const FloatingWidgets = dynamic(() => import("@/components/FloatingWidgets"), {
  ssr: false,
});
const AiChatbot = dynamic(() => import("@/components/AiChatbot"), { ssr: false });

export function DeferredCursorGlow() {
  const ready = usePostLoaderReady();
  return ready ? <CursorGlow /> : null;
}

export function DeferredFloatingWidgets() {
  const ready = usePostLoaderReady(200);
  return ready ? <FloatingWidgets /> : null;
}

export function DeferredAiChatbot() {
  const ready = usePostLoaderReady(350);
  return ready ? <AiChatbot /> : null;
}
