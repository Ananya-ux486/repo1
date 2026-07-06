"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MessageSquare } from "lucide-react";
import { team, blogPosts } from "@/data/siteData";

export default function TeamBlogSection() {
  return (
    <>
      {/* Team */}
      <section className="relative bg-transparent py-16 lg:py-24">
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
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Our Team
            </h2>
            <p className="mt-3 text-muted">
              Meet our experienced professionals behind success.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-full gap-6 sm:grid-cols-2 sm:max-w-2xl lg:max-w-lg lg:gap-8">
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
                <h3 className="text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-brand">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="relative bg-transparent py-16 lg:py-24">
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
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Latest Articles & Insights
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-brand">
                    {post.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-foreground group-hover:text-brand transition">
                    {post.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
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
