/**
 * Central image registry — all static assets live under /public/images/
 * Import paths from here so GitHub deploy never depends on external image URLs.
 */
const IMG = "/images";

/** Local language-switcher flag (bundled under public/images/flags/lang/) */
export function languageFlag(code: string): string {
  const normalized = code
    .replace(/^gb-(sct|wls)$/i, "gb")
    .replace(/^eu$/i, "eu");
  return `${IMG}/flags/lang/${normalized}.png`;
}

/** Phone dial-code flags (bundled under public/images/flags/dial/) */
export function dialFlag(code: string): string {
  return `${IMG}/flags/dial/${code.toLowerCase()}.png`;
}

export const DEFAULT_LANGUAGE_FLAG = `${IMG}/flags/lang/us.png`;

export const images = {
  logo: `${IMG}/brand/tasmafive-logo.svg`,

  hero: {
    slide1: `${IMG}/hero/slide-1.jpg`,
    slide2: `${IMG}/hero/slide-2.jpg`,
    slide3: `${IMG}/hero/slide-3.jpg`,
    slide4: `${IMG}/hero/slide-4.jpg`,
  },

  projects: {
    businessWebsite: `${IMG}/projects/business-website.png`,
    corporateWebsite: `${IMG}/projects/corporate-website.png`,
    ecommerce: `${IMG}/projects/ecommerce.png`,
    portfolio: `${IMG}/projects/portfolio.png`,
    landingPage: `${IMG}/projects/landing-page.png`,
    government: `${IMG}/projects/government.png`,
  },

  industries: {
    seo360: `${IMG}/industries/seo-360.webp`,
    realEstate: `${IMG}/industries/real-estate.webp`,
    education: `${IMG}/industries/education.webp`,
    healthcare: `${IMG}/industries/healthcare.webp`,
    travel: `${IMG}/industries/travel.webp`,
    ecommerce: `${IMG}/industries/ecommerce.webp`,
    manufacturing: `${IMG}/industries/manufacturing.webp`,
    gymFitness: `${IMG}/industries/gym-fitness.webp`,
    logistics: `${IMG}/industries/logistics.webp`,
    automobile: `${IMG}/industries/automobile.webp`,
    itSoftware: `${IMG}/industries/it-software.webp`,
    hotelRestaurants: `${IMG}/industries/hotel-restaurants.webp`,
    fashion: `${IMG}/industries/fashion.webp`,
  },

  expertise: {
    customDevelopment: `${IMG}/expertise/custom-development.jpg`,
    secureInfrastructure: `${IMG}/expertise/secure-infrastructure.jpg`,
    agileExecution: `${IMG}/expertise/agile-execution.jpg`,
    techSupport: `${IMG}/expertise/tech-support.jpg`,
    scalableSolutions: `${IMG}/expertise/scalable-solutions.jpg`,
    performanceDriven: `${IMG}/expertise/performance-driven.jpg`,
  },

  blog: {
    aiWebDev: `${IMG}/blog/ai-web-development.jpg`,
    mobileFirst: `${IMG}/blog/mobile-first-design.jpg`,
    websiteSecurity: `${IMG}/blog/website-security-2026.jpg`,
  },

  about: {
    teamCollab: `${IMG}/about/team-collab.jpg`,
    mission: `${IMG}/about/mission.jpg`,
    vision: `${IMG}/about/vision.jpg`,
    office: `${IMG}/about/office.jpg`,
    trust: `${IMG}/about/trust.jpg`,
  },

  /** Dedicated Instagram feed images — never shared with expertise or blog */
  instagram: {
    hiring: `${IMG}/instagram/post-hiring.jpg`,
    marketer: `${IMG}/instagram/post-marketer.jpg`,
    digitalTransform: `${IMG}/instagram/post-1-digital-transform.jpg`,
    ecommerce: `${IMG}/instagram/post-2-ecommerce.jpg`,
    aiTrends: `${IMG}/instagram/post-3-ai-trends.jpg`,
    security: `${IMG}/instagram/post-4-security.jpg`,
    corporate: `${IMG}/instagram/post-5-corporate.jpg`,
    mobileFirst: `${IMG}/instagram/post-6-mobile-first.jpg`,
  },

  presence: {
    india: {
      kanpur: `${IMG}/presence/india/kanpur.jpg`,
      noida: `${IMG}/presence/india/noida-dlf-mall.jpg`,
      gurgaon: `${IMG}/presence/india/gurgaon.jpg`,
      delhiNcr: `${IMG}/presence/india/delhi-ncr.jpg`,
      haryana: `${IMG}/presence/india/haryana.jpg`,
    },
    international: {
      belgium: `${IMG}/flags/lang/be.png`,
      uk: `${IMG}/flags/lang/gb.png`,
      germany: `${IMG}/flags/lang/de.png`,
      dubai: `${IMG}/flags/lang/ae.png`,
      australia: `${IMG}/flags/lang/au.png`,
      lebanon: `${IMG}/flags/lang/lb.png`,
      egypt: `${IMG}/flags/lang/eg.png`,
      dominicanRepublic: `${IMG}/flags/lang/do.png`,
      pakistan: `${IMG}/flags/lang/pk.png`,
      ghana: `${IMG}/flags/lang/gh.png`,
    },
  },
} as const;
