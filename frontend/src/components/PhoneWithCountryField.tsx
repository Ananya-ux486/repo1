"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { countryCodes, defaultCountry, type CountryDial } from "@/data/countryCodes";
import { dialFlag } from "@/data/images";

function flagUrl(code: string) {
  return dialFlag(code);
}

type Props = {
  name?: string;
  countryFieldName?: string;
  required?: boolean;
  label?: string;
  className?: string;
  defaultCountryCode?: string;
  /** Controlled phone number (without dial code) */
  value?: string;
  onChange?: (phone: string) => void;
  onDialChange?: (dial: string) => void;
};

export default function PhoneWithCountryField({
  name = "phone",
  countryFieldName = "countryCode",
  required = false,
  label = "Phone",
  className = "",
  defaultCountryCode = defaultCountry.code,
  value,
  onChange,
  onDialChange,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [innerPhone, setInnerPhone] = useState("");

  const selected =
    countryCodes.find((c) => c.code === countryCode) || defaultCountry;
  const phoneValue = value !== undefined ? value : innerPhone;
  const controlled = value !== undefined && onChange !== undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countryCodes;
    return countryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    onDialChange?.(selected.dial);
    // intentionally only when dial changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.dial]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (c: CountryDial) => {
    setCountryCode(c.code);
    setOpen(false);
    setQuery("");
  };

  const setPhone = (next: string) => {
    if (controlled) onChange?.(next);
    else setInnerPhone(next);
  };

  return (
    <div className={`block ${className}`} ref={rootRef}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className="flex gap-2">
        <div className="relative w-[9.5rem] shrink-0 sm:w-[11rem]">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Select country code"
            onClick={() => setOpen((v) => !v)}
            className="flex h-[44px] w-full items-center gap-2 rounded-xl border border-border bg-white px-2.5 text-left text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <img
              src={flagUrl(selected.code)}
              alt=""
              width={22}
              height={16}
              className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover"
              loading="lazy"
            />
            <span className="min-w-0 flex-1 truncate">{selected.dial}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
            />
          </button>

          <input type="hidden" name={countryFieldName} value={selected.code} />
          <input type="hidden" name={`${countryFieldName}Dial`} value={selected.dial} />

          {open && (
            <div
              role="listbox"
              className="absolute left-0 top-[calc(100%+6px)] z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
            >
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <Search className="h-3.5 w-3.5 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                  autoFocus
                />
              </div>
              <ul className="max-h-56 overflow-y-auto overscroll-contain py-1">
                {filtered.map((c) => {
                  const active = c.code === selected.code;
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => pick(c)}
                        className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-brand/10 ${
                          active ? "bg-brand/10 font-semibold text-brand" : "text-foreground"
                        }`}
                      >
                        <img
                          src={flagUrl(c.code)}
                          alt=""
                          width={22}
                          height={16}
                          className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover"
                          loading="lazy"
                        />
                        <span className="w-12 shrink-0 font-semibold">{c.dial}</span>
                        <span className="min-w-0 truncate text-muted">{c.name}</span>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="px-3 py-3 text-sm text-muted">No country found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <input
          name={controlled ? undefined : name}
          type="tel"
          required={required}
          inputMode="tel"
          value={phoneValue}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="min-w-0 flex-1 rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );
}
