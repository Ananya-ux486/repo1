"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  getLanguageByCode,
  LANGUAGE_CODES,
  readStoredLanguage,
  SITE_LANGUAGES,
  writeStoredLanguage,
} from "@/data/languages";
import { languageFlag, languageFlagCdn, DEFAULT_LANGUAGE_FLAG } from "@/data/images";

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

const SKIP_LOADER_KEY = "tf-skip-loader";

function setTranslateCookie(lang: string) {
  const hostname = window.location.hostname;
  const clear = "googtrans=;path=/;max-age=0";

  document.cookie = clear;
  document.cookie = `${clear};domain=${hostname}`;
  if (hostname.includes(".")) {
    document.cookie = `${clear};domain=.${hostname}`;
  }

  if (lang === "en") return;

  const value = `/en/${lang}`;
  document.cookie = `googtrans=${value};path=/;max-age=31536000`;
  document.cookie = `googtrans=${value};path=/;domain=${hostname};max-age=31536000`;
  if (hostname.includes(".")) {
    document.cookie = `googtrans=${value};path=/;domain=.${hostname};max-age=31536000`;
  }
}

function getTranslateCombo(): HTMLSelectElement | null {
  return document.querySelector(".goog-te-combo");
}

function triggerTranslate(lang: string): boolean {
  const combo = getTranslateCombo();
  if (!combo) return false;

  const option = Array.from(combo.options).find(
    (opt) => opt.value === lang || opt.value === lang.replace("-", "_")
  );

  const next = option?.value ?? lang;
  if (combo.value === next) {
    combo.dispatchEvent(new Event("change"));
    return true;
  }

  combo.value = next;
  combo.dispatchEvent(new Event("change"));
  return true;
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleTranslateScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (getTranslateCombo()) return Promise.resolve();

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const finish = () => {
      window.setTimeout(() => resolve(), 0);
    };

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) {
        finish();
        return;
      }
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            includedLanguages: LANGUAGE_CODES,
            layout: 0,
          },
          "google_translate_element"
        );
      } catch {
        /* already initialized */
      }
      finish();
    };

    const existing = document.getElementById("google-translate-script");
    if (existing) {
      if (window.google?.translate) {
        window.googleTranslateElementInit();
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });

  return scriptPromise;
}

function waitForCombo(timeoutMs = 3500): Promise<HTMLSelectElement | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      const combo = getTranslateCombo();
      if (combo && combo.options.length > 1) {
        resolve(combo);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        resolve(null);
        return;
      }
      window.setTimeout(tick, 30);
    };
    tick();
  });
}

function FlagImg({
  code,
  size,
  className,
}: {
  code: string;
  size: number;
  className?: string;
}) {
  return (
    <img
      src={languageFlag(code)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        const el = e.currentTarget;
        const cdn = languageFlagCdn(code);
        if (el.src !== cdn && !el.src.includes("flagcdn.com")) {
          el.src = cdn;
          return;
        }
        if (code !== "us" && !el.dataset.fellBack) {
          el.dataset.fellBack = "1";
          el.src = DEFAULT_LANGUAGE_FLAG;
        }
      }}
    />
  );
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

  const ensureTranslator = useCallback(async () => {
    await loadGoogleTranslateScript();
    const combo = await waitForCombo();
    setReady(Boolean(combo));
    return combo;
  }, []);

  const applyLanguage = useCallback(
    async (lang: string) => {
      if (switching || lang === currentCode) {
        setOpen(false);
        return;
      }

      setSwitching(true);
      setOpen(false);
      setQuery("");
      writeStoredLanguage(lang);
      setTranslateCookie(lang);

      // Soft fade — feels instant, avoids hang perception
      document.documentElement.classList.add("gt-switching");

      const combo = await ensureTranslator();

      // Prefer in-place Google Translate (no reload) when combo is ready
      // and we're not clearing back to English (English needs a clean reload).
      if (combo && lang !== "en") {
        const ok = triggerTranslate(lang);
        if (ok) {
          setCurrentCode(lang);
          // Give GT a brief moment to rewrite the DOM, then clear overlay
          window.setTimeout(() => {
            document.documentElement.classList.remove("gt-switching");
            setSwitching(false);
          }, 180);
          return;
        }
      }

      // English restore OR combo unavailable → cookie + fast reload (skip intro loader)
      try {
        sessionStorage.setItem(SKIP_LOADER_KEY, "1");
      } catch {
        /* private mode */
      }
      window.location.reload();
    },
    [currentCode, ensureTranslator, switching]
  );

  useEffect(() => {
    setCurrentCode(readStoredLanguage());
  }, []);

  // Only warm Google Translate when a non-English language is already stored.
  // Loading GT for English users trashes scroll FPS across browsers.
  useEffect(() => {
    const warm = () => {
      const stored = readStoredLanguage();
      if (stored === "en") return;
      void ensureTranslator().then((combo) => {
        if (combo) {
          triggerTranslate(stored);
          setCurrentCode(stored);
        }
      });
    };

    if (document.body.dataset.tfLoading === "done") {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(warm, { timeout: 2500 });
        return () => window.cancelIdleCallback(id);
      }
      const t = window.setTimeout(warm, 900);
      return () => window.clearTimeout(t);
    }

    window.addEventListener("tf-loader-done", warm, { once: true });
    return () => window.removeEventListener("tf-loader-done", warm);
  }, [ensureTranslator]);

  useEffect(() => {
    if (!open) return;
    void ensureTranslator();
  }, [open, ensureTranslator]);

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
          <FlagImg
            code={current.flag}
            size={22}
            className="h-[22px] w-[22px] shrink-0 rounded-full bg-slate-100 object-cover shadow-sm ring-1 ring-black/10"
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
                      onClick={() => void applyLanguage(lang.code)}
                    >
                      <FlagImg
                        code={lang.flag}
                        size={18}
                        className="h-[18px] w-[18px] shrink-0 rounded-full bg-slate-100 object-cover shadow-sm ring-1 ring-black/10"
                      />
                      <span className="truncate">{lang.label}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            {switching && (
              <p className="border-t border-border px-3 py-1.5 text-[10px] text-muted">
                Switching…
              </p>
            )}
            {!ready && !switching && (
              <p className="border-t border-border px-3 py-1.5 text-[10px] text-muted">
                Preparing translator…
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
