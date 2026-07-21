import { Project, Service } from "./models/index.js";

const serviceSeeds = [
  ["web-development", "static-websites", "Static Websites"],
  ["web-development", "landing-pages", "Landing Pages"],
  ["web-development", "dynamic-websites", "Dynamic Websites"],
  ["web-development", "e-commerce-solutions", "E-Commerce Solutions"],
  ["digital-marketing", "seo-services", "SEO Services"],
  ["digital-marketing", "graphic-designing", "Graphic Designing"],
  ["digital-marketing", "social-media-promotion", "Social Media Promotion"],
  ["digital-marketing", "verified-gnd-creation", "Verified GNB Creation"],
  ["digital-marketing", "google-my-business-ranking", "GMB Profile Ranking (Top 5)"],
  ["crm", "lead-management", "Lead Management"],
  ["crm", "service-desk", "Service Desk"],
  ["crm", "client-management", "Client Management"],
  ["crm", "hr-management", "HR Management"],
  ["crm", "email-management", "Email Management"],
  ["crm", "finance-dashboard", "Finance & Advanced Dashboard"],
  ["cloud-solutions", "aws-solutions", "AWS Solutions"],
  ["cloud-solutions", "azure-solutions", "Azure Solutions"],
];

const projectSeeds = [
  {
    slug: "dr-tour",
    title: "DR Tour",
    url: "https://drtour.co/",
    category: "Tours & Transport",
    description:
      "Dominican Republic taxi and island tour platform — airport transfers, private tours, and local travel experiences with clear booking and trust-focused design.",
    tags: ["Tours", "Taxi", "Booking"],
    preview: "/images/projects/live/dr-tour.jpg",
  },
  {
    slug: "atelier-ninetyfive",
    title: "Atelier Ninetyfive Design",
    url: "https://atelierninetyfivedesign.in/",
    category: "Design Studio",
    description:
      "An elegant studio website that highlights creative work, brand identity, and design craft — with polished visuals and a premium browsing experience.",
    tags: ["Design", "Portfolio", "Brand"],
    preview: "/images/projects/live/atelier-ninetyfive.jpg",
  },
  {
    slug: "please-gofundme",
    title: "Please GoFundMe",
    url: "https://pleasegofundme.com/",
    category: "Crowdfunding",
    description:
      "A conversion-oriented crowdfunding experience focused on campaign storytelling, trust signals, and smooth donation journeys for supporters worldwide.",
    tags: ["Crowdfunding", "Campaigns", "Conversion"],
    preview: "/images/projects/live/please-gofundme.jpg",
  },
  {
    slug: "shreeram-ayurvedic",
    title: "Shreeram Ayurvedic Pharmacy",
    url: "https://shreeramaayurvedicpharmacy.com/",
    category: "E-Commerce / Wellness",
    description:
      "An Ayurvedic pharmacy website built to present products and heritage with credibility — optimized for product discovery and customer confidence.",
    tags: ["Ayurveda", "E-Commerce", "Brand"],
    preview: "/images/projects/live/shreeram-ayurvedic.jpg",
  },
];

export async function seedCmsContent() {
  await Promise.all(
    serviceSeeds.map(([section, slug, title], index) =>
      Service.updateOne(
        { slug },
        {
          $setOnInsert: {
            section,
            slug,
            title,
            order: index,
            published: true,
          },
        },
        { upsert: true },
      ),
    ),
  );
  await Promise.all(
    projectSeeds.map((project, index) =>
      Project.updateOne(
        { slug: project.slug },
        { $setOnInsert: { ...project, order: index, published: true } },
        { upsert: true },
      ),
    ),
  );
}
