export type LiveProject = {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  tags: string[];
  /** Local homepage screenshot under /public/images/projects/live/ */
  preview: string;
};

export const liveProjects: LiveProject[] = [
  {
    id: "dr-tour",
    title: "DR Tour",
    url: "https://drtour.co/",
    category: "Tours & Transport",
    description:
      "Dominican Republic taxi and island tour platform — airport transfers, private tours, and local travel experiences with clear booking and trust-focused design.",
    tags: ["Tours", "Taxi", "Booking"],
    preview: "/images/projects/live/dr-tour.jpg",
  },
  {
    id: "atelier-ninetyfive",
    title: "Atelier Ninetyfive Design",
    url: "https://atelierninetyfivedesign.in/",
    category: "Design Studio",
    description:
      "An elegant studio website that highlights creative work, brand identity, and design craft — with polished visuals and a premium browsing experience.",
    tags: ["Design", "Portfolio", "Brand"],
    preview: "/images/projects/live/atelier-ninetyfive.jpg",
  },
  {
    id: "please-gofundme",
    title: "Please GoFundMe",
    url: "https://pleasegofundme.com/",
    category: "Crowdfunding",
    description:
      "A conversion-oriented crowdfunding experience focused on campaign storytelling, trust signals, and smooth donation journeys for supporters worldwide.",
    tags: ["Crowdfunding", "Campaigns", "Conversion"],
    preview: "/images/projects/live/please-gofundme.jpg",
  },
  {
    id: "shreeram-ayurvedic",
    title: "Shreeram Ayurvedic Pharmacy",
    url: "https://shreeramaayurvedicpharmacy.com/",
    category: "E-Commerce / Wellness",
    description:
      "An Ayurvedic pharmacy website built to present products and heritage with credibility — optimized for product discovery and customer confidence.",
    tags: ["Ayurveda", "E-Commerce", "Brand"],
    preview: "/images/projects/live/shreeram-ayurvedic.jpg",
  },
];
