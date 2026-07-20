"use client";

/**
 * Dispatches the custom event that TawkChat listens for.
 * ChatbotTrigger / FloatingWidgets keep their existing animations & layout.
 */
export function openAiChatbot() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tf-open-chatbot"));
}

/**
 * Mount point for DeferredAiChatbot — chat UI lives in ChatbotTrigger;
 * conversation engine is tawk.to via TawkChat in layout.
 */
export default function AiChatbot() {
  return null;
}
