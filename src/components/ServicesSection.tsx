"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Cloud,
  Shield,
  BarChart3,
  ArrowRight,
  Code2,
  Smartphone,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "@/data/siteData";
import IridescentTitle from "@/components/IridescentTitle";

const iconMap: Record<string, LucideIcon> = {
  "Web Development": Globe,
  "Cloud Solutions": Cloud,
  "Cyber Security": Shield,
  "Data Analytics": BarChart3,
};

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ServicesSection() {
  return (
    <section className="relative py-16 pastel-section section-glow lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            What We Do
          </span>
          <div className="mt-4">
            <IridescentTitle size="lg">Our IT Services</IridescentTitle>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            We deliver innovative and scalable IT solutions designed to help
            businesses grow, streamline operations, and achieve digital success.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = iconMap[service.title] || Code2;
            return (
              <TiltCard key={service.title}>
                <motion.div
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group glass-card relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:border-brand/40"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/0 via-brand/0 to-brand/0 opacity-0 transition-opacity duration-500 group-hover:from-brand/15 group-hover:via-orange-400/10 group-hover:to-brand/20 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_40px_rgba(249,115,22,0.18)] transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-[1] mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-black">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative z-[1] text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="relative z-[1] mt-2 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <ul className="relative z-[1] mt-4 space-y-1.5">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-muted"
                    >
                      <span className="h-1 w-1 rounded-full bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="relative z-[1] mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100"
                >
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                </motion.div>
              </TiltCard>
            );
          })}
        </div>

        {/* Extra service pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Smartphone, label: "Mobile Apps" },
            { icon: Megaphone, label: "Digital Marketing" },
            { icon: Code2, label: "Enterprise Software" },
          ].map(({ icon: Icon, label }) => (
            <Link
              key={label}
              href="/services"
              className="flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm text-muted transition hover:border-brand/40 hover:text-brand"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
