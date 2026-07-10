import { images } from "./images";
import type { InstagramPost } from "@/types/instagram";

export const INSTAGRAM_USERNAME = "tasmafivesolutions";
export const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/tasmafivesolutions/";

/** Curated fallback — replaced automatically when INSTAGRAM_ACCESS_TOKEN is configured */
export const fallbackInstagramPosts: InstagramPost[] = [
  {
    id: "tf-1",
    image: images.instagram.digitalTransform,
    permalink: `${INSTAGRAM_PROFILE_URL}`,
    caption:
      "Your vision + Our technology = Digital transformation. ✨ We craft websites, apps & cloud solutions that help businesses scale faster. DM us to start your project! 🚀\n\n📩 info@tasmafivesolutions.com\n📍 Kanpur, India\n\n#TasmaFive #WebDevelopment #DigitalTransformation #ITSolutions #Kanpur #StartupIndia",
    likes: 48,
    comments: 7,
    mediaType: "IMAGE",
    timestamp: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "tf-2",
    image: images.instagram.ecommerce,
    permalink: `${INSTAGRAM_PROFILE_URL}`,
    caption:
      "E-Commerce that converts! 🛒 From product catalog to secure checkout — we build online stores that look premium and perform flawlessly on every device.\n\nNeed an online shop? Let's talk. 💬\n\n#Ecommerce #OnlineStore #WebDesign #TasmaFiveSolutions",
    likes: 36,
    comments: 5,
    mediaType: "IMAGE",
    timestamp: "2026-02-22T14:30:00.000Z",
  },
  {
    id: "tf-3",
    image: images.instagram.aiTrends,
    permalink: `${INSTAGRAM_PROFILE_URL}`,
    caption:
      "AI is reshaping how we build the web in 2026 🤖⚡ Smarter UX, faster delivery, better results — that's how we approach every project at Tasma Five.\n\n#AI #WebDevelopment #TechTrends #Innovation",
    likes: 52,
    comments: 9,
    mediaType: "VIDEO",
    timestamp: "2026-02-15T09:15:00.000Z",
  },
  {
    id: "tf-4",
    image: images.instagram.security,
    permalink: `${INSTAGRAM_PROFILE_URL}`,
    caption:
      "Security isn't optional — it's foundation. 🔐 SSL, firewalls, secure auth & regular audits keep your business and customers safe online.\n\n#CyberSecurity #SecureWeb #BusinessSafety #TasmaFive",
    likes: 29,
    comments: 4,
    mediaType: "IMAGE",
    timestamp: "2026-02-08T16:45:00.000Z",
  },
  {
    id: "tf-5",
    image: images.instagram.corporate,
    permalink: `${INSTAGRAM_PROFILE_URL}`,
    caption:
      "Corporate websites that build trust at first glance 💼 Professional design, multi-language support & investor-ready sections — delivered on time, every time.\n\n#CorporateWebsite #Branding #B2B #DigitalPresence",
    likes: 41,
    comments: 6,
    mediaType: "IMAGE",
    timestamp: "2026-01-28T11:20:00.000Z",
  },
  {
    id: "tf-6",
    image: images.instagram.mobileFirst,
    permalink: `${INSTAGRAM_PROFILE_URL}`,
    caption:
      "Mobile-first = More customers 📱 Over 70% users browse on phone — if your site isn't mobile-ready, you're losing business every single day.\n\nWe fix that. ✨\n\n#MobileFirst #UIUX #ResponsiveDesign #WebDesign",
    likes: 44,
    comments: 8,
    mediaType: "IMAGE",
    timestamp: "2026-01-18T08:00:00.000Z",
  },
];
