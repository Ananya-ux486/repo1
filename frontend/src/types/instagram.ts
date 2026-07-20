export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramPost = {
  id: string;
  image: string;
  permalink: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp?: string;
  mediaType?: InstagramMediaType;
};

export type InstagramFeedResponse = {
  posts: InstagramPost[];
  source: "live" | "fallback";
  /** Present only when source is fallback — helps debug token/permission issues */
  reason?: string;
};
