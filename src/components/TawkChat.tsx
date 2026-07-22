"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget?: () => void;
      maximize: () => void;
      minimize?: () => void;
      endChat?: (callback?: () => void) => void;
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

function clearTawkBrowserState() {
  const matchesTawk = (key: string) => /tawk|twk_/i.test(key);
  try {
    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
      const key = localStorage.key(i);
      if (key && matchesTawk(key)) localStorage.removeItem(key);
    }
    for (let i = sessionStorage.length - 1; i >= 0; i -= 1) {
      const key = sessionStorage.key(i);
      if (key && matchesTawk(key)) sessionStorage.removeItem(key);
    }
    document.cookie.split(";").forEach((entry) => {
      const name = entry.split("=")[0]?.trim();
      if (!name || !matchesTawk(name)) return;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    });
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }
}

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

    const hideDefaultLauncher = () => {
      try {
        window.Tawk_API?.hideWidget?.();
      } catch {
        /* widget may still be booting */
      }
    };

    const openChat = () => {
      const api = window.Tawk_API;
      if (!readyRef.current || !api) {
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

    const loadChat = () => {
      if (document.getElementById("tawkto-script")) {
        openChat();
        return;
      }

      pendingOpenRef.current = true;
      clearTawkBrowserState();
      const api = (window.Tawk_API = window.Tawk_API || {
        hideWidget: () => {},
        maximize: () => {},
      });
      window.Tawk_LoadStart = new Date();

      api.onLoad = () => {
        readyRef.current = true;
        try {
          api.endChat?.(hideDefaultLauncher);
        } catch {
          hideDefaultLauncher();
        }
        if (pendingOpenRef.current) {
          pendingOpenRef.current = false;
          openChat();
        }
      };
      api.onChatMinimized = hideDefaultLauncher;
      api.onChatEnded = hideDefaultLauncher;
      api.onChatHidden = hideDefaultLauncher;

      const style = document.createElement("style");
      style.id = "tawkto-hide-launcher";
      style.textContent = `
        .widget-visible iframe#tawkchat-minified-iframe-element,
        .widget-visible .tawk-min-container,
        div.tawk-min-container { display: none !important; }
      `;
      document.head.appendChild(style);

      const script = document.createElement("script");
      script.id = "tawkto-script";
      script.async = true;
      script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.head.appendChild(script);
    };

    const onOpen = () => loadChat();
    window.addEventListener("tf-open-chatbot", onOpen);

    return () => {
      window.removeEventListener("tf-open-chatbot", onOpen);
    };
  }, [propertyId, widgetId]);

  return null;
}
