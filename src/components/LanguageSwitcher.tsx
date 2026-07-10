"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Languages, Search } from "lucide-react";
import {
  getLanguageByCode,
  LANGUAGE_CODES,
  readStoredLanguage,
  SITE_LANGUAGES,
} from "@/data/languages";
import { languageFlag, DEFAULT_LANGUAGE_FLAG } from "@/data/images";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            autoDisplay: boolean;
            includedLanguages: string;
            layout?: number;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

function setTranslateCookie(lang: string) {
  const hostname = window.location.hostname;
  const clear = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

  document.cookie = clear;
  document.cookie = `${clear};domain=${hostname}`;
  if (hostname.includes(".")) {
    document.cookie = `${clear};domain=.${hostname}`;
  }

  if (lang === "en") return;

  const value = `/en/${lang}`;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/;domain=${hostname}`;
  if (hostname.includes(".")) {
    document.cookie = `googtrans=${value};path=/;domain=.${hostname}`;
  }
}

function getTranslateCombo(): HTMLSelectElement | null {
  return document.querySelector(".goog-te-combo");
}

function flashSwitching() {
  document.documentElement.classList.add("gt-switching");
  window.setTimeout(() => {
    document.documentElement.classList.remove("gt-switching");
  }, 900);
}

function triggerTranslate(lang: string): boolean {
  const combo = getTranslateCombo();
  if (!combo) return false;

  const option = Array.from(combo.options).find(
    (opt) => opt.value === lang || opt.value === lang.replace("-", "_")
  );

  combo.value = option?.value ?? lang;
  combo.dispatchEvent(new Event("change"));
  return true;
}

function loadGoogleTranslateScript() {
  if (document.getElementById("google-translate-script")) return;

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
        includedLanguages: LANGUAGE_CODES,
        layout: 0,
      },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

export default function LanguageSwitcher() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [currentCode, setCurrentCode] = useState("en");
  const [ready, setReady] = useState(false);
  const [switching, setSwitching] = useState(false);

  const current = getLanguageByCode(currentCode);

  const filtered = SITE_LANGUAGES.filter((lang) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      lang.label.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const applyLanguage = useCallback(
    (lang: string) => {
      if (switching || lang === currentCode) {
        setOpen(false);
        return;
      }

      setSwitching(true);
      setOpen(false);
      setQuery("");
      flashSwitching();

      setTranslateCookie(lang);

      if (lang === "en") {
        window.location.reload();
        return;
      }

      const applied = triggerTranslate(lang);
      if (applied) {
        setCurrentCode(lang);
        setSwitching(false);
      } else {
        window.location.reload();
      }
    },
    [currentCode, switching]
  );

  useEffect(() => {
    setCurrentCode(readStoredLanguage());
  }, []);

  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored === "en") return;

    const boot = () => loadGoogleTranslateScript();
    if (document.body.dataset.tfLoading === "done") {
      boot();
    } else {
      window.addEventListener("tf-loader-done", boot, { once: true });
    }
    return () => window.removeEventListener("tf-loader-done", boot);
  }, []);

  useEffect(() => {
    if (!open) return;

    loadGoogleTranslateScript();

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const combo = getTranslateCombo();
      if (combo) {
        setReady(true);
        const stored = readStoredLanguage();
        if (stored !== "en") {
          triggerTranslate(stored);
          setCurrentCode(stored);
        }
        window.clearInterval(timer);
      } else if (attempts > 40) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const onWheel = (e: Event) => e.stopPropagation();
    const list = rootRef.current?.querySelector(".lang-switcher-list");
    if (!list) return;
    list.addEventListener("wheel", onWheel, { passive: true, capture: true });
    return () => list.removeEventListener("wheel", onWheel, { capture: true });
  }, [open]);

  return (
    <>
      <div id="google_translate_element" aria-hidden />
      <div ref={rootRef} className="lang-switcher relative" data-lenis-prevent="true">
        <button
          type="button"
          className="lang-switcher-trigger flex min-h-[40px] min-w-[108px] cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-white px-3.5 py-2 text-xs font-semibold text-foreground shadow-md transition hover:shadow-lg active:scale-[0.98] disabled:cursor-wait"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Change website language"
          disabled={switching}
          onClick={() => setOpen((v) => !v)}
        >
          <img
            src={languageFlag(current.flag)}
            alt=""
            width={22}
            height={22}
            className="h-[22px] w-[22px] shrink-0 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_LANGUAGE_FLAG;
            }}
          />
          <span className="max-w-[72px] truncate">{current.label}</span>
          <ChevronDown
            className={`ml-auto h-4 w-4 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="lang-switcher-panel absolute bottom-[calc(100%+8px)] left-0 z-[10002] w-[min(92vw,220px)] overflow-hidden rounded-xl border border-border bg-white shadow-xl">
            <div className="border-b border-border p-2">
              <label className="relative flex items-center">
                <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search language…"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-2 text-xs outline-none ring-accent/30 focus:ring-2"
                  autoFocus
                />
              </label>
            </div>
            <ul
              className="lang-switcher-list max-h-[min(55vh,320px)] overflow-y-auto overscroll-contain p-1.5"
              role="listbox"
              data-lenis-prevent="true"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-center text-xs text-muted">
                  No language found
                </li>
              ) : (
                filtered.map((lang) => (
                  <li key={lang.code} role="option" aria-selected={lang.code === currentCode}>
                    <button
                      type="button"
                      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition hover:bg-accent/10 ${
                        lang.code === currentCode
                          ? "bg-accent/15 text-accent"
                          : "text-foreground"
                      }`}
                      onClick={() => applyLanguage(lang.code)}
                    >
                      <img
                        src={languageFlag(lang.flag)}
                        alt=""
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px] shrink-0 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_LANGUAGE_FLAG;
                        }}
                      />
                      <span className="truncate">{lang.label}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            {!ready && (
              <p className="border-t border-border px-3 py-1.5 text-[10px] text-muted">
                <Languages className="mr-1 inline h-3 w-3" />
                Translator loading…
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
