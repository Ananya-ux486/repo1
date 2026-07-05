"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronUp, Bot } from "lucide-react";
import { siteConfig } from "@/data/siteData";

const languages = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "hi", label: "HI", flag: "🇮🇳" },
];

export default function FloatingWidgets() {
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(languages[0]);
  const [chatTooltip, setChatTooltip] = useState(false);

  return (
    <>
      {/* Language Switcher — Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-2 overflow-hidden rounded-xl border border-white/10 bg-surface-light shadow-2xl"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setActiveLang(lang);
                    setLangOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-white/5 ${
                    activeLang.code === lang.code
                      ? "text-brand"
                      : "text-white/70"
                  }`}
                >
                  <span>{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setLangOpen(!langOpen)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-medium text-black shadow-lg"
        >
          <span>{activeLang.flag}</span>
          {activeLang.label}
          <ChevronUp
            className={`h-4 w-4 transition-transform ${langOpen ? "" : "rotate-180"}`}
          />
        </motion.button>
      </div>

      {/* WhatsApp — Bottom Right */}
      <motion.a
        href={`https://wa.me/${siteConfig.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black shadow-lg animate-pulse-glow"
      >
        <MessageCircle className="h-5 w-5" />
        Expert Support
      </motion.a>

      {/* AI Chatbot — Above WhatsApp */}
      <div className="fixed bottom-24 right-6 z-50">
        <AnimatePresence>
          {chatTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-2 max-w-[200px] rounded-xl border border-white/10 bg-surface-light px-4 py-3 text-xs text-muted shadow-xl"
            >
              AI Chatbot coming soon! Stay tuned.
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setChatTooltip(true)}
          onMouseLeave={() => setChatTooltip(false)}
          onClick={() => setChatTooltip(true)}
          title="AI Chatbot — Coming Soon"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand/40 bg-black text-brand shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </motion.button>
      </div>
    </>
  );
}
