"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, CreditCard } from "lucide-react";
import { navLinks, siteConfig } from "@/data/siteData";
import { images } from "@/data/images";
import ChatbotTrigger from "@/components/ChatbotTrigger";
import ServicesNavDropdown from "@/components/ServicesNavDropdown";
import { lockPageScroll, unlockPageScroll, releaseDocumentScroll } from "@/lib/scrollLock";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
    releaseDocumentScroll();
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      lockPageScroll();
    } else {
      unlockPageScroll();
    }
    return () => {
      if (mobileOpen) unlockPageScroll();
    };
  }, [mobileOpen]);

  const linkClass = (isActive: boolean) =>
    `relative whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-semibold tracking-wide transition-all duration-300 lg:px-2.5 lg:text-sm ${
      isActive ? "text-brand" : "text-foreground/75 hover:text-foreground"
    }`;

  return (
    <header className="site-header border-b border-white/60 bg-gradient-to-r from-sky-100/90 via-white/85 to-pink-100/90 backdrop-blur-xl shadow-sm max-lg:pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 py-1.5 pl-2 pr-3 sm:gap-3 sm:pl-3 sm:pr-4 lg:py-2 lg:pl-4 lg:pr-5">
        <Link href="/" className="group shrink-0">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
            <Image
              src={images.logo}
              alt="TasmaFive Solutions"
              width={160}
              height={52}
              priority
              className="h-9 w-auto sm:h-10 md:h-11 lg:h-12"
            />
          </motion.div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            if (link.label === "Services") {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link href={link.href} className={`flex items-center gap-1 ${linkClass(isActive)}`}>
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 z-50 pt-1"
                      >
                        <div className="w-56 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
                          <ServicesNavDropdown />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={linkClass(isActive)}>
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ChatbotTrigger className="shrink-0" />

          <Link
            href={siteConfig.payNowUrl}
            className="hidden items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-brand-dark sm:flex lg:px-5 lg:text-xs"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Pay Now
          </Link>

          <Link
            href="/contact"
            className="hidden rounded-full border border-border bg-white/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground transition hover:border-brand/40 hover:text-brand xl:inline-flex"
          >
            Let&apos;s Talk
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-border bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "Close" : "Menu"}
            {mobileOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-white lg:hidden"
          >
            <nav className="flex max-h-[calc(100dvh-var(--tf-header-height)-0.5rem)] flex-col gap-1 overflow-y-auto overscroll-contain p-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                if (link.label === "Services") {
                  return (
                    <div key={link.href}>
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
                          isActive
                            ? "bg-brand/10 text-brand"
                            : "text-muted hover:bg-surface hover:text-foreground"
                        }`}
                      >
                        Services
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            mobileServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-2"
                          >
                            <ServicesNavDropdown onNavigate={() => setMobileOpen(false)} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition hover:border-brand/40 hover:text-brand"
              >
                Let&apos;s Talk
              </Link>

              <Link
                href={siteConfig.payNowUrl}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg"
              >
                <CreditCard className="h-4 w-4" />
                Pay Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
