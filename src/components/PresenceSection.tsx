"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { indiaPresence, internationalPresence } from "@/data/siteData";

export default function PresenceSection() {
  return (
    <section className="relative py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* India */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Nationwide Reach
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Our Presence in India
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {indiaPresence.map((city, i) => (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group overflow-hidden rounded-2xl border border-white/5 bg-surface-light"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={city.image}
                  alt={`${city.landmark}, ${city.city}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-semibold text-white">{city.city}</p>
                  <p className="text-[10px] text-white/50">{city.landmark}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* International */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Our Presence in International
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {internationalPresence.map((loc, i) => (
            <motion.div
              key={loc.country}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-surface-light p-6 transition hover:border-brand/30"
            >
              <div className="relative mb-3 h-16 w-24 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={`https://flagcdn.com/w320/${loc.code}.png`}
                  alt={`${loc.country} flag`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <p className="text-sm font-semibold text-white">{loc.country}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
