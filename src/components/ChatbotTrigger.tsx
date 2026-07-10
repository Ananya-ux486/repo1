"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { openAiChatbot } from "@/components/AiChatbot";

type ChatbotTriggerProps = {
  showNeedHelp?: boolean;
  className?: string;
};

export default function ChatbotTrigger({
  showNeedHelp = true,
  className = "",
}: ChatbotTriggerProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showNeedHelp && (
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="need-help-bubble hidden whitespace-nowrap rounded-full border border-brand/25 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-brand shadow-sm backdrop-blur-sm sm:inline-flex lg:px-3 lg:text-[11px]"
        >
          <motion.span
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Need help?
          </motion.span>
        </motion.span>
      )}

      <motion.button
        type="button"
        onClick={openAiChatbot}
        aria-label="Open AI Assistant"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="ai-chat-fab relative flex h-9 w-9 items-center justify-center rounded-full shadow-lg sm:h-10 sm:w-10"
      >
        <span className="ai-chat-pulse absolute inset-0 rounded-full" aria-hidden />
        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand via-orange-500 to-amber-400">
          <Bot className="h-4 w-4 text-white sm:h-[18px] sm:w-[18px]" />
        </span>
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-brand shadow sm:h-4 sm:w-4">
          <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
        </span>
      </motion.button>
    </div>
  );
}
