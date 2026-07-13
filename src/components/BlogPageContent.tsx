"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { blogPosts, type BlogPost } from "@/data/siteData";
import { IMAGE_BLUR } from "@/lib/motion";

export function BlogIndexContent() {
  return (
    <div className="relative overflow-hidden pb-12 pt-4 lg:pb-16 lg:pt-5">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-3 border-b border-border/40 pb-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            From our blog
          </span>
          <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Latest Blogs
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted sm:text-base">
            Guides and insights on web development, software, and digital
            security from TasmaFive Solutions.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand">
            {post.category}
          </span>
          <h2 className="mt-2 text-base font-semibold leading-snug text-foreground group-hover:text-brand">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {post.date}
            </span>
            <span className="font-semibold text-brand">Read more →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="relative overflow-hidden pb-12 pt-4 lg:pb-16 lg:pt-5">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-4 border-b border-border/40 pb-2.5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            All blogs
          </Link>
        </div>

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          {post.category}
        </span>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Calendar className="h-4 w-4" />
          {post.date} · TasmaFive Solutions
        </p>

        <div className="relative mt-6 aspect-[5/4] overflow-hidden rounded-2xl border border-border shadow-sm sm:aspect-[16/9]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
            className="object-cover object-[center_30%] sm:object-center"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <p className="mt-6 text-base font-medium leading-relaxed text-foreground/90">
          {post.excerpt}
        </p>

        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
          {post.content.map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Talk to our team
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
          >
            Explore services
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <h2 className="text-lg font-bold text-foreground">More blogs</h2>
            <ul className="mt-4 space-y-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 transition hover:border-brand/40"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                        {p.category}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground group-hover:text-brand">
                        {p.title}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
