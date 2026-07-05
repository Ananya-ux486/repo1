"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bot, ChevronDown } from "lucide-react";
import { navLinks } from "@/data/siteData";
import MagneticButton from "@/components/MagneticButton";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col leading-none"
          >
            <span className="text-xl font-bold tracking-tight">
              <span className="text-brand">Tasma</span>
              <span className="text-white">Five</span>
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-brand uppercase">
              Solutions
            </span>
          </motion.div>
        </Link>

        {/* Buzzworthy-style center tagline — desktop only */}
        <div className="hidden items-center gap-2 lg:flex">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">
            WE
          </span>
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block h-2 w-2 rounded-full bg-brand shadow-[0_0_12px_rgba(249,115,22,0.8)]"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            Unlock Potential
          </span>
        </div>

        {/* Desktop Nav — hidden on smaller, shown on xl */}
        <nav className="hidden items-center gap-1 xl:flex">
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
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-brand"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
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
                        className="absolute top-full left-0 mt-1 w-52 rounded-xl border border-white/10 bg-surface-light p-2 shadow-2xl"
                      >
                        {[
                          "Web Development",
                          "Cloud Solutions",
                          "Cyber Security",
                          "Digital Marketing",
                        ].map((item) => (
                          <Link
                            key={item}
                            href="/services"
                            className="block rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-brand"
                          >
                            {item}
                          </Link>
                        ))}
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
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive ? "text-brand" : "text-white/70 hover:text-white"
                }`}
              >
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

        {/* Lusion-style pill buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="AI Chatbot — Coming Soon"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand sm:flex"
          >
            <Bot className="h-5 w-5" />
          </motion.button>

          <div className="hidden sm:block">
            <MagneticButton href="/contact" variant="pill-dark" className="!px-5 !py-2 !text-xs !font-bold !uppercase !tracking-wider">
              Let&apos;s Talk •
            </MagneticButton>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "Close" : "Menu"}
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 bg-black/95 xl:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
