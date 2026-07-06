"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { industries } from "@/data/siteData";
import { images } from "@/data/images";

function IndustrySlideCard({ name, image }: { name: string; image: string }) {
  return (
    <div className="group flex w-[120px] shrink-0 flex-col items-center sm:w-[130px]">
      <div className="relative h-[88px] w-[88px] transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-[100px] sm:w-[100px]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain"
          sizes="100px"
        />
      </div>
      <p className="mt-2 text-center text-xs font-semibold leading-tight text-brand sm:text-sm">
        {name}
      </p>
    </div>
  );
}

export default function Industry360Section() {
  const slides = [...industries, ...industries];

  return (
    <section className="relative overflow-hidden py-14 pastel-section lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand"
        >
          360° Result Driven Digital Marketing
        </motion.p>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-16">
          {/* Rotating 360° landmark ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto h-[260px] w-[260px] shrink-0 sm:h-[320px] sm:w-[320px] lg:mx-0 lg:h-[400px] lg:w-[400px]"
          >
            <div className="tf-circle-rotate absolute inset-0 rounded-full">
              <Image
                src={images.industries.seo360}
                alt="360 degree global digital marketing"
                fill
                className="rounded-full object-cover"
                sizes="400px"
                priority
              />
            </div>

            <div className="absolute left-1/2 top-1/2 flex h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white text-center shadow-lg sm:h-[200px] sm:w-[200px] lg:h-[220px] lg:w-[220px]">
              <h2 className="text-4xl font-black text-brand sm:text-5xl lg:text-[55px]">360°</h2>
              <p className="mt-1 text-xs font-medium text-foreground sm:text-sm">Result Driven</p>
              <strong className="text-xs font-bold text-brand sm:text-sm">Digital Marketing</strong>
              <strong className="text-xs font-bold text-brand sm:text-sm">Company</strong>
            </div>
          </motion.div>

          {/* Auto-sliding industry images */}
          <div className="w-full flex-1 overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex w-max gap-6 py-2"
            >
              {slides.map((industry, i) => (
                <IndustrySlideCard
                  key={`${industry.name}-${i}`}
                  name={industry.name}
                  image={industry.image}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
