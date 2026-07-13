import { NextResponse } from "next/server";
import { fallbackInstagramPosts } from "@/data/instagramPosts";
import type { InstagramPost } from "@/types/instagram";

export const revalidate = 300;

/**
 * READ-ONLY Instagram media fetch.
 * Permissions used: instagram_business_basic (or legacy instagram_basic)
 * NEVER requests: content_publish, manage_comments, manage_messages
 */

type GraphMediaItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

type GraphErrorBody = {
  error?: { message?: string; code?: number; type?: string };
};

function mapGraphPost(item: GraphMediaItem): InstagramPost | null {
  const image = item.media_url ?? item.thumbnail_url;
  if (!image) return null;

  return {
    id: item.id,
    image,
    permalink: item.permalink ?? "https://www.instagram.com/tasmafivesolutions/",
    caption: item.caption ?? "",
    likes: 0,
    comments: 0,
    timestamp: item.timestamp,
    mediaType:
      item.media_type === "VIDEO"
        ? "VIDEO"
        : item.media_type === "CAROUSEL_ALBUM"
          ? "CAROUSEL_ALBUM"
          : "IMAGE",
  };
}

/** Only public media display fields — no insights, no write fields */
const MEDIA_FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
].join(",");

async function fetchMedia(
  url: string,
): Promise<{ posts: InstagramPost[]; error?: string }> {
  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  const json = (await res.json()) as {
    data?: GraphMediaItem[];
  } & GraphErrorBody;

  if (!res.ok || json.error) {
    return {
      posts: [],
      error: json.error?.message ?? `HTTP ${res.status}`,
    };
  }

  const posts = (json.data ?? [])
    .map(mapGraphPost)
    .filter((post): post is InstagramPost => post !== null);

  return { posts };
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const userId = process.env.INSTAGRAM_USER_ID?.trim() || "me";

  if (!token) {
    return NextResponse.json({
      posts: fallbackInstagramPosts,
      source: "fallback" as const,
      reason: "missing_token",
    });
  }

  try {
    // 1) Instagram API with Instagram Login (preferred, read-only)
    const igUrl =
      `https://graph.instagram.com/v21.0/${encodeURIComponent(userId)}/media` +
      `?fields=${MEDIA_FIELDS}&limit=12&access_token=${encodeURIComponent(token)}`;

    let result = await fetchMedia(igUrl);

    // 2) Fallback: Facebook Graph (Page-linked IG Business account)
    if (result.posts.length === 0 && userId !== "me") {
      const fbUrl =
        `https://graph.facebook.com/v21.0/${encodeURIComponent(userId)}/media` +
        `?fields=${MEDIA_FIELDS}&limit=12&access_token=${encodeURIComponent(token)}`;
      result = await fetchMedia(fbUrl);
    }

    if (result.posts.length === 0) {
      return NextResponse.json({
        posts: fallbackInstagramPosts,
        source: "fallback" as const,
        reason: result.error ?? "empty_feed",
      });
    }

    return NextResponse.json({
      posts: result.posts.slice(0, 12),
      source: "live" as const,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({
      posts: fallbackInstagramPosts,
      source: "fallback" as const,
      reason: message,
    });
  }
}
