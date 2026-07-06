"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, navLinks } from "@/data/siteData";
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

export default function Footer() {
  return (
    <footer className="relative border-t border-white/50 bg-gradient-to-b from-transparent via-sky-50/40 to-pink-50/50">
      <div className="section-glow absolute inset-0 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 pb-[calc(3rem+env(safe-area-inset-bottom))] lg:px-8 lg:py-16 lg:pb-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block">
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
            <div className="mt-6 flex gap-3">
              {socialIcons
                .filter(({ href }) => href)
                .map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href || "#"}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted transition hover:border-brand/50 hover:bg-brand/10 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Our Services
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              {[
                "Web Development",
                "Cloud Solutions",
                "Cyber Security",
                "Data Analytics",
                "Digital Marketing",
                "Government Projects",
              ].map((s) => (
                <li key={s}>
                  <Link href="/services" className="transition hover:text-brand">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2 max-lg:break-words">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {siteConfig.address}
              </li>
              {siteConfig.phones.map((phone) => (
                <li key={phone} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-brand" />
                  <a href={`tel:${phone}`} className="hover:text-brand">
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-brand">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} TasmaFive Solutions. All rights reserved.
          </p>
          <p className="max-w-xs text-xs text-muted sm:max-w-none">
            Top IT Company in Kanpur | Digital Solutions Across India & Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
