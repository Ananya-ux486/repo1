"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/siteData";
import {
  WhatsAppIcon,
  InstagramIcon,
  LinkedinIcon,
  FacebookIcon,
} from "@/components/SocialIcons";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hello Tasmafive Solutions")}`;

const socialLinks = [
  {
    href: siteConfig.social.instagram,
    label: "Instagram",
    icon: InstagramIcon,
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
  },
  {
    href: siteConfig.social.linkedin,
    label: "LinkedIn",
    icon: LinkedinIcon,
    className: "bg-[#0A66C2] text-white",
  },
  {
    href: siteConfig.social.facebook,
    label: "Facebook",
    icon: FacebookIcon,
    className: "bg-[#1877F2] text-white",
  },
];

export default function FloatingWidgets() {
  return (
    <>
      {/* Language switcher — bottom-left */}
      <div className="site-floating-widgets tf-language-widget relative bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 sm:left-5 lg:bottom-4 lg:left-6">
        <LanguageSwitcher />
      </div>

      {/* Social icons — bottom-right */}
      <div className="site-floating-widgets bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-3 flex flex-row items-center gap-1.5 sm:right-5 sm:gap-2 lg:bottom-6 lg:right-6 lg:flex-col-reverse lg:gap-3">
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-[#25D366]/20 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
        >
          <WhatsAppIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px] lg:h-5 lg:w-5" />
        </motion.a>

        {socialLinks.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${item.className}`}
            >
              <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </motion.a>
          );
        })}
      </div>
    </>
  );
}
