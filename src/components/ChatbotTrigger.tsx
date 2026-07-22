"use client";

import { m } from "framer-motion";
import { openAiChatbot } from "@/components/AiChatbot";
import ChatbotIcon from "@/components/ChatbotIcon";

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
        <m.span
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="need-help-bubble hidden whitespace-nowrap rounded-full border border-cyan-400/30 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-sky-700 shadow-sm backdrop-blur-sm 2xl:inline-flex 2xl:px-3 2xl:text-[11px]"
        >
          <m.span
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Need help?
          </m.span>
        </m.span>
      )}

      <m.button
        type="button"
        onClick={openAiChatbot}
        aria-label="Open AI Assistant"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: -4 }}
        whileTap={{ scale: 0.94 }}
        className="ai-chat-fab relative flex h-9 w-9 items-center justify-center rounded-full xl:h-10 xl:w-10"
      >
        <span className="ai-chat-pulse absolute inset-0 rounded-full" aria-hidden />
        <span className="ai-chat-3d relative flex h-full w-full items-center justify-center rounded-full">
          <ChatbotIcon className="relative z-[1] h-5 w-5 drop-shadow-sm xl:h-[22px] xl:w-[22px]" />
        </span>
      </m.button>
    </div>
  );
}
