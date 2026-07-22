"use client";

import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import { blogPosts } from "@/data/siteData";
import { IMAGE_BLUR } from "@/lib/motion";
import { floatEase, floatStagger } from "@/lib/floatMotion";
import { FloatImageWrap, FloatLine } from "@/components/FloatReveal";
import { useScrollReplay } from "@/lib/useScrollReplay";

export default function TeamBlogSection() {
  const { ref, replayKey } = useScrollReplay(0.18);

  return (
    <section ref={ref} className="relative bg-transparent py-8 lg:py-11">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-6 flex flex-col items-center text-center lg:mb-8">
          <FloatLine replayKey={replayKey}>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              From our blog
            </span>
          </FloatLine>
          <FloatLine replayKey={replayKey} delay={0.08} className="mt-2">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Latest Blogs
            </h2>
          </FloatLine>
          <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
            Practical tips on websites, software, and security from the TasmaFive
            team.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {blogPosts.map((post, i) => (
            <m.article
              key={post.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: floatStagger(i, 0.06),
                ease: floatEase,
              }}
              className="blog-card group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <FloatImageWrap
                  scroll={false}
                  replayKey={replayKey}
                  className="aspect-[5/4] sm:aspect-video"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                      className="object-cover object-[center_30%] transition duration-500 ease-out group-hover:scale-[1.03] sm:object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  </div>
                </FloatImageWrap>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                    {post.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-brand">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {post.date}
                    </span>
                    <span className="inline-flex items-center gap-0.5 font-semibold text-brand transition duration-300 group-hover:gap-1">
                      Read blog
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </m.article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/40 hover:text-brand"
          >
            View all blogs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
