import { images } from "./images";
import type { InstagramPost } from "@/types/instagram";

export const INSTAGRAM_USERNAME = "tasmafivesolutions";
export const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/tasmafivesolutions/";

/**
 * Fallback grid shown when INSTAGRAM_ACCESS_TOKEN is not set.
 * Styled to match @tasmafivesolutions feed themes (hiring, marketing, IT).
 * With a Meta Instagram token, /api/instagram returns live posts + real permalinks.
 */
export const fallbackInstagramPosts: InstagramPost[] = [
  {
    id: "tf-hiring",
    image: images.instagram.hiring,
    permalink: INSTAGRAM_PROFILE_URL,
    caption:
      "WE ARE HIRING! 🚀 INTERN · Web Developer — Join TasmaFive Solutions and build real client projects. DM us or email info@tasmafivesolutions.com\n\n#WeAreHiring #WebDeveloper #Internship #TasmaFive #KanpurJobs",
    likes: 64,
    comments: 12,
    mediaType: "IMAGE",
    timestamp: "2026-06-20T10:00:00.000Z",
  },
  {
    id: "tf-marketer",
    image: images.instagram.marketer,
    permalink: INSTAGRAM_PROFILE_URL,
    caption:
      "DIGITAL MARKETER energy 🎯 Grow your brand with smart IT + result-driven marketing. Your vision + Our technology = Digital transformation. ✨\n\n#DigitalMarketing #TasmaFiveSolutions #BrandGrowth",
    likes: 58,
    comments: 9,
    mediaType: "IMAGE",
    timestamp: "2026-06-12T14:30:00.000Z",
  },
  {
    id: "tf-1",
    image: images.instagram.digitalTransform,
    permalink: INSTAGRAM_PROFILE_URL,
    caption:
      "Your vision + Our technology = Digital transformation. ✨ We craft websites, apps & cloud solutions that help businesses scale faster. DM us to start your project! 🚀\n\n📩 info@tasmafivesolutions.com\n📍 Kanpur, India\n\n#TasmaFive #WebDevelopment #DigitalTransformation",
    likes: 48,
    comments: 7,
    mediaType: "IMAGE",
    timestamp: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "tf-2",
    image: images.instagram.ecommerce,
    permalink: INSTAGRAM_PROFILE_URL,
    caption:
      "E-Commerce that converts! 🛒 From product catalog to secure checkout — we build online stores that look premium and perform on every device.\n\n#Ecommerce #OnlineStore #WebDesign #TasmaFiveSolutions",
    likes: 36,
    comments: 5,
    mediaType: "IMAGE",
    timestamp: "2026-02-22T14:30:00.000Z",
  },
  {
    id: "tf-3",
    image: images.instagram.aiTrends,
    permalink: INSTAGRAM_PROFILE_URL,
    caption:
      "AI is reshaping how we build the web 🤖⚡ Smarter UX, faster delivery, better results — that's how we approach every project at Tasma Five.\n\n#AI #WebDevelopment #TechTrends #Innovation",
    likes: 52,
    comments: 9,
    mediaType: "VIDEO",
    timestamp: "2026-02-15T09:15:00.000Z",
  },
  {
    id: "tf-4",
    image: images.instagram.security,
    permalink: INSTAGRAM_PROFILE_URL,
    caption:
      "Security isn't optional — it's foundation. 🔐 SSL, firewalls, secure auth & regular audits keep your business and customers safe online.\n\n#CyberSecurity #SecureWeb #TasmaFive",
    likes: 29,
    comments: 4,
    mediaType: "IMAGE",
    timestamp: "2026-02-08T16:45:00.000Z",
  },
];
