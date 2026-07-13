"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Send, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteData";
import { lockPageScroll, unlockPageScroll } from "@/lib/scrollLock";
import ChatbotIcon from "@/components/ChatbotIcon";

const quickReplies = [
  { label: "Web Development", href: "/services/web-development" },
  { label: "Get a Quote", href: "/contact" },
  { label: "View Projects", href: "/projects" },
];

const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hello Tasmafive Solutions, I need help with a project.")}`;

export function openAiChatbot() {
  window.dispatchEvent(new CustomEvent("tf-open-chatbot"));
}

export default function AiChatbot() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("tf-open-chatbot", handler);
    return () => window.removeEventListener("tf-open-chatbot", handler);
  }, []);

  useEffect(() => {
    if (open) {
      lockPageScroll();
    } else {
      unlockPageScroll();
    }
    return () => {
      if (open) unlockPageScroll();
    };
  }, [open]);

  return (
    <>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close chat overlay"
            className="pointer-events-auto fixed inset-0 z-[47] bg-black/20 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />
          <div
            className="pointer-events-auto fixed right-3 top-[calc(env(safe-area-inset-top)+3.75rem)] z-[48] flex max-h-[min(520px,calc(100dvh-5rem))] w-[min(340px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl sm:right-5 lg:top-[4.75rem] lg:right-6 lg:max-h-[min(560px,calc(100dvh-6rem))]"
            role="dialog"
            aria-label="AI Assistant"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 shadow-inner">
                <ChatbotIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  Tasma AI Assistant
                </p>
                <p className="flex items-center gap-1 text-[10px] text-white/80 sm:text-[11px]">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-300" />
                  Online — replies instantly
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages — scrollable */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-sky-50/50 to-white p-4">
              <div className="flex gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100">
                  <ChatbotIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-border">
                  <p className="text-sm leading-relaxed text-foreground">
                    Hi! I&apos;m the TasmaFive AI Assistant. How can I help you
                    grow your business today?
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 pl-10">
                {quickReplies.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand transition hover:bg-brand hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border bg-white p-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-brand/40 hover:text-brand"
              >
                <Send className="h-4 w-4" />
                Send us a message
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
