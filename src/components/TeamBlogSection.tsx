"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, MessageSquare } from "lucide-react";
import { team, blogPosts, expertise } from "@/data/siteData";

export default function TeamBlogSection() {
  return (
    <>
      {/* CTA Banner */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-r from-brand/10 via-surface-light to-brand/5 p-10 md:p-16"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand/10 blur-3xl" />
            <h2 className="relative text-2xl font-bold text-white md:text-4xl">
              We handle your IT needs, so you can focus on growing your business.
            </h2>
            <Link
              href="/contact"
              className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-dark"
            >
              Get a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Leadership
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Our Team
            </h2>
            <p className="mt-3 text-muted">
              Meet our experienced professionals behind success.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-lg gap-8 sm:grid-cols-2">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-2xl font-bold text-black">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-brand">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Expertise & Capabilities
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Delivering secure, scalable, and high-performance IT solutions
              tailored for modern businesses.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-white/5 p-5 transition hover:border-brand/20 hover:bg-white/[0.02]"
              >
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="relative py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Insights
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Latest Articles & Insights
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-surface-light"
              >
                <div className="aspect-video bg-gradient-to-br from-brand/20 to-transparent" />
                <div className="p-5">
                  <span className="text-xs font-medium text-brand">
                    {post.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-white group-hover:text-brand transition">
                    {post.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> {post.comments}{" "}
                      Comments
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
