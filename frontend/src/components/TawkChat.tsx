"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget?: () => void;
      maximize: () => void;
      minimize?: () => void;
      onLoad?: () => void;
      onChatMinimized?: () => void;
      onChatEnded?: () => void;
      onChatHidden?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

const DEFAULT_PROPERTY_ID = "6a5e3e8f1a1df41d5c178534";
const DEFAULT_WIDGET_ID = "1ju028oi0";

/**
 * Loads tawk.to once, hides the default green bubble, and opens the widget
 * when any custom launcher fires `tf-open-chatbot` (ChatbotTrigger / FAB).
 * Visual UI of the site is unchanged — only the chat engine is tawk.to.
 */
export default function TawkChat() {
  const propertyId =
    process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || DEFAULT_PROPERTY_ID;
  const widgetId =
    process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || DEFAULT_WIDGET_ID;
  const readyRef = useRef(false);
  const pendingOpenRef = useRef(false);

  useEffect(() => {
    if (!propertyId || !widgetId) return;

    const api = (window.Tawk_API = window.Tawk_API || {
      hideWidget: () => {},
      maximize: () => {},
    });
    window.Tawk_LoadStart = new Date();

    const hideDefaultLauncher = () => {
      try {
        api.hideWidget?.();
      } catch {
        /* widget may still be booting */
      }
    };

    const openChat = () => {
      if (!readyRef.current) {
        pendingOpenRef.current = true;
        return;
      }
      try {
        api.showWidget?.();
        api.maximize();
      } catch {
        pendingOpenRef.current = true;
      }
    };

    api.onLoad = () => {
      readyRef.current = true;
      hideDefaultLauncher();
      if (pendingOpenRef.current) {
        pendingOpenRef.current = false;
        openChat();
      }
    };

    api.onChatMinimized = hideDefaultLauncher;
    api.onChatEnded = hideDefaultLauncher;
    api.onChatHidden = hideDefaultLauncher;

    if (!document.getElementById("tawkto-script")) {
      const s = document.createElement("script");
      s.id = "tawkto-script";
      s.async = true;
      s.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      s.charset = "UTF-8";
      s.setAttribute("crossorigin", "*");
      document.head.appendChild(s);
    }

    // Extra CSS safety: hide default tawk launcher if dashboard setting is missed
    if (!document.getElementById("tawkto-hide-launcher")) {
      const style = document.createElement("style");
      style.id = "tawkto-hide-launcher";
      style.textContent = `
        .widget-visible iframe#tawkchat-minified-iframe-element,
        .widget-visible .tawk-min-container,
        div.tawk-min-container { display: none !important; }
      `;
      document.head.appendChild(style);
    }

    const onOpen = () => openChat();
    window.addEventListener("tf-open-chatbot", onOpen);

    return () => {
      window.removeEventListener("tf-open-chatbot", onOpen);
    };
  }, [propertyId, widgetId]);

  return null;
}
