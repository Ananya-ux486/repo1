import { NextResponse } from "next/server";
import { fallbackInstagramPosts } from "@/data/instagramPosts";
import type { InstagramPost } from "@/types/instagram";

export const revalidate = 300;

type GraphMediaItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

function mapGraphPost(item: GraphMediaItem): InstagramPost | null {
  const image = item.media_url ?? item.thumbnail_url;
  if (!image) return null;

  return {
    id: item.id,
    image,
    permalink: item.permalink ?? "https://www.instagram.com/tasmafivesolutions/",
    caption: item.caption ?? "",
    likes: item.like_count ?? 0,
    comments: item.comments_count ?? 0,
    timestamp: item.timestamp,
    mediaType:
      item.media_type === "VIDEO"
        ? "VIDEO"
        : item.media_type === "CAROUSEL_ALBUM"
          ? "CAROUSEL_ALBUM"
          : "IMAGE",
  };
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return NextResponse.json({
      posts: fallbackInstagramPosts,
      source: "fallback" as const,
    });
  }

  try {
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "timestamp",
      "like_count",
      "comments_count",
    ].join(",");

    const res = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=12&access_token=${token}`,
      { next: { revalidate: 300 } },
    );

    if (!res.ok) throw new Error("Instagram API request failed");

    const data = (await res.json()) as { data?: GraphMediaItem[] };
    const posts = (data.data ?? [])
      .map(mapGraphPost)
      .filter((post): post is InstagramPost => post !== null);

    if (posts.length === 0) throw new Error("No posts returned");

    return NextResponse.json({
      posts: posts.slice(0, 12),
      source: "live" as const,
    });
  } catch {
    return NextResponse.json({
      posts: fallbackInstagramPosts,
      source: "fallback" as const,
    });
  }
}
