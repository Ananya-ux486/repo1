"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  siteConfig,
  navLinks,
  webDevelopmentServices,
  services,
} from "@/data/siteData";
import { images } from "@/data/images";
import {
  InstagramIcon,
  LinkedinIcon,
  FacebookIcon,
  Mail,
  Phone,
  MapPin,
} from "@/components/SocialIcons";

const socialIcons = [
  { icon: InstagramIcon, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: LinkedinIcon, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: FacebookIcon, href: siteConfig.social.facebook, label: "Facebook" },
];

const footerServices = [
  ...webDevelopmentServices.map((s) => ({
    label: s.title,
    href: s.href,
  })),
  ...services
    .filter((s) => s.slug === "cyber-security" || s.slug === "data-analytics")
    .map((s) => ({ label: s.title, href: s.href })),
];

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-foreground">
      <span className="relative inline-block pb-2">
        {children}
        <span
          className="absolute bottom-0 left-0 h-[3px] w-8 rounded-full bg-gradient-to-r from-brand to-orange-300"
          aria-hidden
        />
      </span>
    </h3>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white/80 to-orange-50/40" />
      <div
        className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-brand/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:px-8 lg:py-16 lg:pb-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="min-w-0 rounded-2xl border border-white/70 bg-white/55 p-5 shadow-sm backdrop-blur-sm lg:p-6">
            <Link href="/" className="inline-block transition hover:opacity-90">
              <Image
                src={images.logo}
                alt="TasmaFive Solutions"
                width={180}
                height={58}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Professional IT company providing website development, software
              solutions, digital marketing, and government project services.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socialIcons
                .filter(({ href }) => href)
                .map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href || "#"}
                    target={href ? "_blank" : undefined}
                    rel={href ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-white text-muted shadow-sm transition hover:border-brand/40 hover:bg-brand hover:text-white hover:shadow-md"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0 rounded-2xl border border-white/70 bg-white/45 p-5 backdrop-blur-sm lg:border-transparent lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 rounded-lg px-1 py-1.5 text-sm text-muted transition hover:bg-brand/[0.06] hover:text-brand"
                  >
                    <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-ml-4 transition group-hover:ml-0">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services — deep links to pricing / detail sections */}
          <div className="min-w-0 rounded-2xl border border-white/70 bg-white/45 p-5 backdrop-blur-sm lg:border-transparent lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <FooterHeading>Our Services</FooterHeading>
            <ul className="space-y-1">
              {footerServices.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 rounded-lg px-1 py-1.5 text-sm text-muted transition hover:bg-brand/[0.06] hover:text-brand"
                  >
                    <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-ml-4 transition group-hover:ml-0">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0 rounded-2xl border border-brand/15 bg-gradient-to-br from-white/80 to-orange-50/50 p-5 shadow-sm backdrop-blur-sm lg:p-6">
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="min-w-0 space-y-3.5 text-sm text-muted">
              <li className="flex min-w-0 items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 break-words leading-relaxed">
                  {siteConfig.address}
                </span>
              </li>
              {siteConfig.phones.map((phone) => (
                <li key={phone} className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="min-w-0 font-medium transition hover:text-brand"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex min-w-0 items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="min-w-0 break-all text-[13px] font-medium leading-snug transition hover:text-brand sm:text-sm"
                  title={siteConfig.email}
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/60 px-5 py-4 text-center shadow-sm backdrop-blur-sm sm:flex-row sm:text-left">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} TasmaFive Solutions. All rights reserved.
          </p>
          <p className="max-w-xs text-xs font-medium text-foreground/70 sm:max-w-none">
            Top IT Company in Kanpur | Digital Solutions Across India & Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
