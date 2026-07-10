"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MessageSquare } from "lucide-react";
import { blogPosts } from "@/data/siteData";
import { IMAGE_BLUR } from "@/lib/motion";
import { floatEase, floatStagger } from "@/lib/floatMotion";
import { FloatImageWrap, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";

export default function TeamBlogSection() {
  const blogReplay = useScrollReplay(0.18);

  return (
    <>
      <section ref={blogReplay.ref} className="relative bg-transparent py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <FloatLine replayKey={blogReplay.replayKey}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Insights
              </span>
            </FloatLine>
            <FloatLine replayKey={blogReplay.replayKey} delay={0.08} className="mt-3">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Latest Articles & Insights
              </h2>
            </FloatLine>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2, margin: "0px 0px -40px 0px" }}
                transition={{
                  duration: 0.8,
                  delay: floatStagger(i, 0.1),
                  ease: floatEase,
                }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <FloatImageWrap scroll={false} replayKey={blogReplay.replayKey} className="aspect-video">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </FloatImageWrap>
                <div className="p-5">
                  <span className="text-xs font-medium text-brand">
                    {post.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-foreground transition group-hover:text-brand">
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
