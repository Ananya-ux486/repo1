"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  ExternalLink,
  Play,
  Check,
} from "lucide-react";
import { FloatLine, FloatBlock } from "@/components/FloatReveal";
import { InstagramIcon } from "@/components/SocialIcons";
import { useScrollReplay } from "@/lib/useScrollReplay";
import { floatEase, floatStagger } from "@/lib/floatMotion";
import { IMAGE_BLUR } from "@/lib/motion";
import { lockPageScroll, unlockPageScroll } from "@/lib/scrollLock";
import {
  fallbackInstagramPosts,
  INSTAGRAM_PROFILE_URL,
  INSTAGRAM_USERNAME,
} from "@/data/instagramPosts";
import { siteConfig } from "@/data/siteData";
import type { InstagramFeedResponse, InstagramPost } from "@/types/instagram";

const VISIBLE_COUNT = 6;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: floatEase },
  },
};

function formatLikes(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

function captionPreview(caption: string, max = 72) {
  const line = caption.split("\n")[0]?.trim() ?? "";
  if (line.length <= max) return line;
  return `${line.slice(0, max)}…`;
}

function timeAgo(timestamp?: string) {
  if (!timestamp) return "";
  const days = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "TODAY";
  if (days === 1) return "1 DAY AGO";
  return `${days} DAYS AGO`;
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function PostImage({
  src,
  alt,
  className = "object-cover",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (isRemoteImage(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={`h-full w-full ${className}`}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={IMAGE_BLUR}
    />
  );
}

function ModalPostBlock({
  post,
  isFirst,
}: {
  post: InstagramPost;
  isFirst: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const postUrl = post.permalink || INSTAGRAM_PROFILE_URL;

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: INSTAGRAM_USERNAME, url: postUrl });
        return;
      }
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* cancelled */
    }
  }, [postUrl]);

  return (
    <article className="instagram-modal-post">
      {/* Per-post header — username opens this post on Instagram */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-avatar-ring shrink-0 rounded-full p-[2px] transition hover:opacity-90"
            aria-label={`Open post by ${INSTAGRAM_USERNAME} on Instagram`}
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white">
              <Image
                src="/images/brand/tasmafive-logo.svg"
                alt="TasmaFive"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </div>
          </a>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-semibold text-foreground underline-offset-2 transition hover:text-[#0095f6] hover:underline"
          >
            {INSTAGRAM_USERNAME}
          </a>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#0095f6] hover:text-[#00376b]"
          >
            Follow
          </a>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on Instagram"
            className="text-foreground/70 transition hover:text-foreground"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Media */}
      <div className="relative aspect-square w-full bg-slate-100">
        <PostImage
          src={post.image}
          alt="Instagram post"
          sizes="(max-width: 768px) 100vw, 448px"
          priority={isFirst}
        />
        {post.mediaType === "VIDEO" && (
          <div className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-black/55 text-white">
            <Play className="h-3.5 w-3.5 fill-white" />
          </div>
        )}
      </div>

      {/* Likes + Share */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-sm font-semibold text-foreground">
          {formatLikes(post.likes)} likes
        </p>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Share"}
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline-offset-2 hover:text-[#0095f6] hover:underline"
          >
            {INSTAGRAM_USERNAME}
          </a>{" "}
          {post.caption}
        </p>

        {isFirst && (
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted">
            <p className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">📍</span>
              <span>{siteConfig.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <span>📩</span>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-[#0095f6] hover:underline"
              >
                {siteConfig.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span>🌐</span>
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0095f6] hover:underline"
              >
                instagram.com/{INSTAGRAM_USERNAME}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        )}

        {post.timestamp && (
          <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-muted/70">
            {timeAgo(post.timestamp)}
          </p>
        )}
      </div>
    </article>
  );
}

function InstagramModal({
  posts,
  initialIndex,
  onClose,
}: {
  posts: InstagramPost[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    lockPageScroll();
    return () => {
      unlockPageScroll();
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!mounted || !el) return;

    const keepScrollInside = (e: WheelEvent) => {
      e.stopPropagation();
    };

    el.addEventListener("wheel", keepScrollInside, { passive: true });
    return () => el.removeEventListener("wheel", keepScrollInside);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const target = postRefs.current[initialIndex];
    if (!target || !scrollRef.current) return;

    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [mounted, initialIndex]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Instagram feed"
      className="instagram-modal-root fixed inset-0 z-[10050] flex items-center justify-center p-4 sm:p-6"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.button
        type="button"
        aria-label="Close feed"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6 sm:top-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <X className="h-5 w-5" />
      </motion.button>

      <motion.div
        className="instagram-modal-card relative z-[1] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-md"
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.35, ease: floatEase }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable feed — all posts stacked vertically */}
        <div
          ref={scrollRef}
          className="instagram-modal-feed max-h-[min(92vh,820px)] overflow-y-auto overscroll-contain"
          data-lenis-prevent
        >
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={(el) => {
                postRefs.current[index] = el;
              }}
              className={
                index > 0
                  ? "border-t-4 border-slate-100"
                  : undefined
              }
            >
              <ModalPostBlock post={post} isFirst={index === 0} />
            </div>
          ))}

          {/* End CTA */}
          <div className="border-t border-border bg-slate-50 px-4 py-5 text-center">
            <p className="mb-3 text-xs text-muted">
              You&apos;ve scrolled through our latest posts
            </p>
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            >
              <InstagramIcon className="h-4 w-4" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function PostTile({
  post,
  index,
  onOpen,
}: {
  post: InstagramPost;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      variants={tileVariants}
      custom={index}
      onClick={onOpen}
      className="instagram-post-tile group relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:rounded-2xl"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: floatEase }}
    >
      <div className="absolute inset-0">
        <PostImage
          src={post.image}
          alt="Instagram post preview"
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 16vw, 12vw"
        />
      </div>

      {post.mediaType === "VIDEO" && (
        <div className="pointer-events-none absolute right-2 top-2 z-[2] flex h-6 w-6 items-center justify-center rounded-md bg-black/50 text-white sm:h-7 sm:w-7">
          <Play className="h-3 w-3 fill-white sm:h-3.5 sm:w-3.5" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/45 to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

      <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 px-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 translate-y-2">
        <div className="flex items-center gap-5 text-white">
          <span className="flex items-center gap-1.5 text-sm font-bold drop-shadow sm:text-base">
            <Heart className="h-4 w-4 fill-white sm:h-5 sm:w-5" />
            {formatLikes(post.likes)}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-bold drop-shadow sm:text-base">
            <MessageCircle className="h-4 w-4 fill-white/20 sm:h-5 sm:w-5" />
            {post.comments}
          </span>
        </div>
        <p className="line-clamp-2 max-w-[92%] text-center text-[10px] leading-snug text-white/90 sm:text-xs">
          {captionPreview(post.caption)}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[3] rounded-xl ring-2 ring-brand/0 transition duration-300 group-hover:ring-brand/60 sm:rounded-2xl" />
    </motion.button>
  );
}

export default function InstagramFeedSection() {
  const { ref, replayKey, isInView } = useScrollReplay(0.15);
  const [posts, setPosts] = useState<InstagramPost[]>(fallbackInstagramPosts);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);

  const visiblePosts = useMemo(() => posts.slice(0, VISIBLE_COUNT), [posts]);

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;

    async function loadFeed() {
      try {
        const res = await fetch("/api/instagram");
        if (!res.ok) return;
        const data = (await res.json()) as InstagramFeedResponse;
        if (!cancelled && data.posts?.length) {
          setPosts(data.posts);
          setIsLive(data.source === "live");
        }
      } catch {
        /* keep fallback */
      }
    }

    loadFeed();
    const interval = window.setInterval(loadFeed, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isInView]);

  const openPost = (index: number) => setActiveIndex(index);
  const closePost = () => setActiveIndex(null);

  return (
    <section
      ref={ref}
      className="instagram-feed-section relative overflow-hidden bg-transparent py-8 lg:py-11"
      aria-labelledby="instagram-feed-heading"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="instagram-feed-glow absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-[#f58529]/15 blur-2xl" />
        <div className="instagram-feed-glow absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-[#8134af]/12 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-6 text-center lg:mb-8">
          <FloatLine replayKey={replayKey}>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Social
            </span>
          </FloatLine>
          <FloatLine replayKey={replayKey} delay={0.08} className="mt-3">
            <h2
              id="instagram-feed-heading"
              className="instagram-hashtag text-2xl font-bold text-foreground sm:text-3xl md:text-4xl"
            >
              #{INSTAGRAM_USERNAME}
            </h2>
          </FloatLine>
          <FloatBlock replayKey={replayKey} scroll={false} index={2} className="mt-3">
            <p className="text-muted">
              Follow our journey — projects, tech tips & behind-the-scenes on{" "}
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand hover:underline"
              >
                @{INSTAGRAM_USERNAME}
              </a>
              .
              {isLive ? (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live feed
                </span>
              ) : null}
            </p>
          </FloatBlock>
        </div>

        <motion.div
          key={replayKey}
          className="instagram-feed-row mx-auto max-w-6xl gap-2.5 lg:grid lg:grid-cols-6 lg:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
        >
          {visiblePosts.map((post, i) => (
            <PostTile
              key={post.id}
              post={post}
              index={i}
              onOpen={() => openPost(i)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            delay: floatStagger(VISIBLE_COUNT, 0.08),
            duration: 0.6,
            ease: floatEase,
          }}
          className="mt-8 flex justify-center sm:mt-10"
        >
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-follow-btn group inline-flex items-center gap-2.5 rounded-full border border-border bg-white/80 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition hover:border-brand/40 hover:shadow-md"
          >
            <span className="instagram-avatar-ring flex h-8 w-8 items-center justify-center rounded-full">
              <InstagramIcon className="h-4 w-4 text-white" />
            </span>
            Follow @{INSTAGRAM_USERNAME}
            <ExternalLink className="h-3.5 w-3.5 text-muted transition group-hover:text-brand" />
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <InstagramModal
            key="instagram-feed-modal"
            posts={posts}
            initialIndex={activeIndex}
            onClose={closePost}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
