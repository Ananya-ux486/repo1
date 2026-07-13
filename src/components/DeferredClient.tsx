"use client";

import dynamic from "next/dynamic";
import { usePostLoaderReady } from "@/lib/usePostLoaderReady";

const FloatingWidgets = dynamic(() => import("@/components/FloatingWidgets"), {
  ssr: false,
});
const AiChatbot = dynamic(() => import("@/components/AiChatbot"), { ssr: false });

export function DeferredFloatingWidgets() {
  const ready = usePostLoaderReady(0);
  return ready ? <FloatingWidgets /> : null;
}

export function DeferredAiChatbot() {
  const ready = usePostLoaderReady(80);
  return ready ? <AiChatbot /> : null;
}
