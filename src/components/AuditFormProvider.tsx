"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, X } from "lucide-react";
import AuditReportForm from "@/components/AuditReportForm";
import { lockPageScroll, unlockPageScroll } from "@/lib/scrollLock";

type AuditFormContextValue = {
  open: boolean;
  openAuditForm: () => void;
  closeAuditForm: () => void;
};

const AuditFormContext = createContext<AuditFormContextValue | null>(null);

export function useAuditForm() {
  const ctx = useContext(AuditFormContext);
  if (!ctx) {
    throw new Error("useAuditForm must be used within AuditFormProvider");
  }
  return ctx;
}

export function useOptionalAuditForm() {
  return useContext(AuditFormContext);
}

export default function AuditFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const clearAuditQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("audit")) return;
    params.delete("audit");
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const openAuditForm = useCallback(() => {
    setOpen(true);
  }, []);

  const closeAuditForm = useCallback(() => {
    setOpen(false);
    clearAuditQuery();
  }, [clearAuditQuery]);

  useEffect(() => {
    const v = searchParams.get("audit");
    if (v === "1" || v === "open" || v === "true") {
      setOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (open) lockPageScroll();
    else unlockPageScroll();
    return () => {
      if (open) unlockPageScroll();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuditForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAuditForm]);

  const value = useMemo(
    () => ({ open, openAuditForm, closeAuditForm }),
    [open, openAuditForm, closeAuditForm],
  );

  return (
    <AuditFormContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[10050] flex items-end justify-center p-0 sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close audit form"
              className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
              onClick={closeAuditForm}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="audit-form-title"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative z-[1] max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                    <ClipboardCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2
                      id="audit-form-title"
                      className="text-lg font-bold text-foreground"
                    >
                      Get a Free Audit Report
                    </h2>
                    <p className="mt-0.5 text-sm text-muted">
                      Share your details — our team will reply soon.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeAuditForm}
                  className="rounded-full border border-border p-2 text-muted transition hover:border-brand hover:bg-brand hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <AuditReportForm compact />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuditFormContext.Provider>
  );
}
