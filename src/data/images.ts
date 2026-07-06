/**
 * Central image registry — all static assets live under /public/images/
 * Import paths from here so GitHub deploy never depends on external image URLs.
 */
const IMG = "/images";

export const images = {
  logo: `${IMG}/tasmafive-logo.svg`,

  hero: {
    slide1: `${IMG}/hero/slide-1.png`,
    slide2: `${IMG}/hero/slide-2.png`,
    slide3: `${IMG}/hero/slide-3.png`,
    slide4: `${IMG}/hero/slide-4.png`,
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
    webDevTrends: `${IMG}/blog/web-dev-trends.png`,
    cloudSolutions: `${IMG}/blog/cloud-solutions.png`,
    cyberSecurity: `${IMG}/blog/cyber-security.png`,
  },

  presence: {
    india: {
      bangalore: `${IMG}/presence/india/bangalore.webp`,
      delhi: `${IMG}/presence/india/delhi.webp`,
      pune: `${IMG}/presence/india/pune.webp`,
      chandigarh: `${IMG}/presence/india/chandigarh.png`,
      hyderabad: `${IMG}/presence/india/hyderabad.png`,
      jaipur: `${IMG}/presence/india/jaipur.webp`,
    },
    international: {
      dubai: `${IMG}/presence/international/dubai.png`,
      bangladesh: `${IMG}/presence/international/bangladesh.png`,
      malaysia: `${IMG}/presence/international/malaysia.png`,
      australia: `${IMG}/presence/international/australia.png`,
      usa: `${IMG}/presence/international/usa.png`,
      nepal: `${IMG}/presence/international/nepal.png`,
    },
  },
} as const;
