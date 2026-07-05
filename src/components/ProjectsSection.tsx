"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { projects } from "@/data/siteData";

export default function ProjectsSection() {
  return (
    <section className="relative py-24 bg-surface section-glow">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Portfolio
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Completed Projects
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Explore our portfolio of successful projects delivering innovative
              IT solutions across various industries.
            </p>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-full border border-brand/30 px-5 py-2.5 text-sm font-medium text-brand transition hover:bg-brand/10"
          >
            View All Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface-light"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand/20 to-surface">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white/5 transition group-hover:text-brand/10">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-60" />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-brand">
                  {project.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-brand transition">
                  {project.title}
                </h3>
                <Link
                  href="/projects"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-muted transition group-hover:text-brand"
                >
                  View Details <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
