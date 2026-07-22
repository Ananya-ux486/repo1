import { Router } from "express";
import { isSafePublicUrl } from "../utils/security.js";

const router = Router();

router.get("/", async (_req, res) => {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim() || "";
  if (!token) {
    return res.json({
      posts: [],
      source: "fallback",
      reason: "missing_token",
    });
  }

  const userId = (process.env.INSTAGRAM_USER_ID || "me").trim();
  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.instagram.com/v21.0/${encodeURIComponent(userId)}/media?fields=${fields}&limit=12&access_token=${encodeURIComponent(token)}`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return res.json({
        posts: [],
        source: "fallback",
        reason: "fetch_error",
      });
    }
    const data = await r.json();
    const posts = Array.isArray(data.data) ? data.data : [];
    const mapped = posts
      .map((item) => {
        const image = item.media_url || item.thumbnail_url;
        if (!image || !isSafePublicUrl(image)) return null;
        const mediaType =
          item.media_type === "VIDEO"
            ? "VIDEO"
            : item.media_type === "CAROUSEL_ALBUM"
              ? "CAROUSEL_ALBUM"
              : "IMAGE";
        return {
          id: item.id,
          image,
          permalink:
            item.permalink && isSafePublicUrl(item.permalink)
              ? item.permalink
              : "https://www.instagram.com/tasmafivesolutions/",
          caption: item.caption || "",
          likes: 0,
          comments: 0,
          timestamp: item.timestamp,
          mediaType,
        };
      })
      .filter(Boolean)
      .slice(0, 12);

    if (!mapped.length) {
      return res.json({
        posts: [],
        source: "fallback",
        reason: "empty_feed",
      });
    }
    return res.json({ posts: mapped, source: "live" });
  } catch {
    return res.json({
      posts: [],
      source: "fallback",
      reason: "fetch_error",
    });
  }
});

export default router;
