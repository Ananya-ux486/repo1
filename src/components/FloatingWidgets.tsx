"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/siteData";
import {
  WhatsAppIcon,
  InstagramIcon,
  LinkedinIcon,
  FacebookIcon,
} from "@/components/SocialIcons";
import GTranslateWidget from "@/components/GTranslateWidget";

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
      <div className="site-floating-widgets bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 max-lg:bottom-[max(5.5rem,env(safe-area-inset-bottom))] sm:left-5 lg:bottom-6 lg:left-6">
        <GTranslateWidget />
      </div>

      {/* Social icons — bottom-right */}
      <div className="site-floating-widgets bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 flex flex-row items-center gap-2 sm:right-5 lg:bottom-6 lg:right-6 lg:flex-col-reverse lg:gap-3">
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
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-[#25D366]/20 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
        >
          <WhatsAppIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
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
              className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${item.className}`}
            >
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
            </motion.a>
          );
        })}
      </div>
    </>
  );
}
