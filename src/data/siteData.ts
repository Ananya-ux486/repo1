import { images } from "./images";

export const siteConfig = {
  name: "TasmaFive Solutions",
  tagline: "Smart IT Solutions. Full Control. Real Results.",
  email: "info@tasmafivesolutions.com",
  phones: ["+91-6307558730", "+91-9818272320"],
  whatsapp: "916307558730",
  payNowUrl: "/contact",
  address: "60/43 Nayaganj Kanpur Nagar (UP) 208001",
  googleBusiness: {
    rating: 5.0,
    reviewCount: 3,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=TasmaFive+Solutions+Nayaganj+Kanpur+208001",
    writeReviewUrl:
      "https://www.google.com/maps/search/?api=1&query=TasmaFive+Solutions+Nayaganj+Kanpur+208001",
  },
  social: {
    instagram: "https://www.instagram.com/tasmafivesolutions?utm_source=qr&igsh=MWtocGlhdjI3OXp6YQ==",
    linkedin: "https://www.linkedin.com/company/tasmafive-solution-llp/",
    facebook: "https://www.facebook.com/share/1cVgJ6m1DL/",
    twitter: "",
    youtube: "",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Certificates", href: "/certificates" },
  { label: "Contact", href: "/contact" },
];

export const heroSlides = [
  {
    id: 1,
    image: images.hero.slide1,
    objectPosition: "center 28%",
    heading: "Engineering Digital Products That Drive Real Growth",
    subheading:
      "We design and develop high-performance websites, mobile apps, and enterprise software — built to scale, stay secure, and deliver measurable business results.",
    ctaPrimary: "Get a Free Audit Report",
    ctaPrimaryHref: "/contact?audit=1",
    openAudit: true,
    ctaSecondary: "Explore Services",
    ctaSecondaryHref: "/services",
  },
  {
    id: 2,
    image: images.hero.slide2,
    objectPosition: "center center",
    heading: "Technology That Connects Your Business to the World",
    subheading:
      "From startups to established brands, we craft cloud-ready digital platforms that expand your reach, strengthen credibility, and accelerate online growth.",
    ctaPrimary: "Start Your Project",
    ctaPrimaryHref: "/quote",
    openAudit: false,
    ctaSecondary: "View Our Work",
    ctaSecondaryHref: "/projects",
  },
  {
    id: 3,
    image: images.hero.slide3,
    objectPosition: "center 40%",
    heading: "Intelligent Software for a Smarter Tomorrow",
    subheading:
      "Harness AI, automation, and cutting-edge frameworks to streamline workflows, unlock data-driven insights, and stay ahead in a fast-moving digital landscape.",
    ctaPrimary: "Discover AI Solutions",
    ctaPrimaryHref: "/services",
    openAudit: false,
    ctaSecondary: "Talk to Experts",
    ctaSecondaryHref: "/contact",
  },
  {
    id: 4,
    image: images.hero.slide4,
    objectPosition: "center 32%",
    heading: "Reliable IT Infrastructure You Can Count On",
    subheading:
      "Secure architecture, optimized performance, and dedicated support — we build the digital backbone your business needs to run smoothly around the clock.",
    ctaPrimary: "Contact Us Today",
    ctaPrimaryHref: "/contact",
    openAudit: false,
    ctaSecondary: "Learn More",
    ctaSecondaryHref: "/about",
  },
];

export const webDevelopmentServices = [
  {
    slug: "static-websites",
    title: "Static Websites",
    tagline: "Fast brochure sites that make your brand look established online.",
    description:
      "Clean, fast-loading brochure websites perfect for businesses that need a professional online presence.",
    features: [
      "Domain & hosting included",
      "SEO optimised for search visibility",
      "Mobile-responsive design",
      "Fast performance & Core Web Vitals focus",
      "Contact form & Google Maps ready",
      "Basic on-page SEO setup",
    ],
    details:
      "Ideal for business profiles, portfolios, clinics, consultants, and informational sites. We design a lightweight, SEO-ready website that loads fast, looks sharp on every device, and gives your brand a credible first impression — complete with clear messaging, service highlights, and easy ways for customers to reach you.",
    indiaPrice: "₹15k",
    foreignPrice: "$249",
    indiaNote: "With domain, hosting & SEO optimised",
    foreignNote: "With domain, hosting & SEO optimised",
    accent: "amber",
    href: "/services/web-development#static-websites",
  },
  {
    slug: "landing-pages",
    title: "Landing Pages",
    tagline: "Single-page designs built to capture leads and convert campaigns.",
    description:
      "High-converting single-page designs built to capture leads and drive campaign results.",
    features: [
      "Domain & hosting included",
      "SEO optimised structure",
      "Conversion-focused layout & CTAs",
      "Analytics-ready tracking setup",
      "Lead form / WhatsApp enquiry",
      "Campaign-ready messaging blocks",
    ],
    details:
      "Purpose-built for ads, launches, and promotions. Clear messaging, strong calls to action, and fast load times help turn visitors into enquiries — whether you sell a service, product, or limited-time offer. Perfect for Google / Meta campaigns where every click counts.",
    indiaPrice: "₹10k",
    foreignPrice: "$199",
    indiaNote: "With domain, hosting & SEO optimised",
    foreignNote: "With domain, hosting & SEO optimised",
    accent: "coral",
    href: "/services/web-development#landing-pages",
  },
  {
    slug: "dynamic-websites",
    title: "Dynamic Websites",
    tagline: "Update content anytime with a secure admin panel and database.",
    description:
      "Interactive websites with admin panels, databases, and real-time content management.",
    features: [
      "Domain & hosting included",
      "SEO optimised pages",
      "Admin panel for easy content updates",
      "Secure login & scalable structure",
      "Blog / news / services modules",
      "Role-based access for your team",
    ],
    details:
      "Built for businesses that need to publish news, blogs, services, or client portals without calling a developer every time. Includes a secure admin panel, structured content modules, and room to grow — so your team stays in control while the site stays fast, searchable, and professional.",
    indiaPrice: "₹30k",
    foreignPrice: "$349",
    indiaNote: "With domain, hosting, SEO & admin panel",
    foreignNote: "With domain, hosting, SEO & admin panel",
    accent: "sky",
    href: "/services/web-development#dynamic-websites",
  },
  {
    slug: "e-commerce-solutions",
    title: "E-Commerce Solutions",
    tagline: "Sell online with a storefront built for products, carts, and orders.",
    description:
      "Full online stores with payment gateways, inventory management, and order tracking.",
    features: [
      "Product catalog & cart checkout",
      "Payment-ready storefront setup",
      "Order management basics",
      "Mobile-first shopping experience",
      "Product filters & search",
      "Order notifications for your team",
    ],
    details:
      "Launch a professional online store to sell across India or internationally. Browse products, add to cart, and checkout on a clean, conversion-focused storefront. India package is priced without third-party API integrations — a solid commerce foundation you can grow from day one with catalogues, orders, and a mobile-first shopping flow.",
    indiaPrice: "₹40k",
    foreignPrice: "$449",
    indiaNote: "Without third-party APIs",
    foreignNote: "International package pricing",
    accent: "mint",
    href: "/services/web-development#e-commerce-solutions",
  },
];

export const services = [
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "We create fast, responsive, and scalable websites that enhance your online presence and drive business growth.",
    features: ["Frontend & Backend Development", "Mobile-Friendly & Responsive Design"],
    href: "/services/web-development",
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    description:
      "Secure, scalable, and cost-effective cloud solutions to store, manage, and access data seamlessly from anywhere.",
    features: ["Cloud Migration & Deployment", "Cloud Infrastructure Management"],
    href: "/services#cloud-solutions",
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    description:
      "Advanced cybersecurity solutions to protect your business from threats, ensuring complete data security.",
    features: ["Website Security & Protection", "Data Encryption & Privacy"],
    href: "/services#cyber-security",
  },
  {
    slug: "data-analytics",
    title: "Data Analytics",
    description:
      "Turn your data into valuable insights that help you make smarter decisions and grow your business.",
    features: ["Data Analysis & Reporting", "Data Visualization & Insights"],
    href: "/services#data-analytics",
  },
];

export const approachItems = [
  {
    title: "Customized Solutions",
    description:
      "We design tailored IT solutions that align perfectly with your business goals and requirements.",
  },
  {
    title: "Quality & Reliability",
    description:
      "We ensure high-quality services with reliable performance, security, and long-term support.",
  },
  {
    title: "Client-Centric Approach",
    description:
      "Your success is our priority, and we work closely with you at every step of the journey.",
  },
];

export const projects = [
  {
    title: "Business Website Development",
    category: "Web Development",
    description:
      "Custom business website with admin panel, lead capture forms, and Google Analytics integration for a Kanpur-based manufacturing firm.",
    details:
      "We built a complete digital presence for a Kanpur manufacturing firm that needed more than a brochure website. The platform includes a secure admin panel, dynamic service pages, and integrated lead capture forms connected to their sales workflow. Google Analytics and Search Console were configured from day one so the client could track traffic, conversions, and campaign performance. The site was optimized for mobile users across Uttar Pradesh and loads in under two seconds on average connections. Today it acts as their primary customer acquisition channel and has significantly reduced dependency on manual inquiries.",
    image: images.projects.businessWebsite,
    tags: ["React", "Node.js", "SEO"],
  },
  {
    title: "Corporate Website Solution",
    category: "Web Development",
    description:
      "Enterprise-grade corporate portal with multi-language support, investor relations section, and secure client login area.",
    details:
      "This corporate portal was designed for a growing company that wanted a professional brand image and a secure area for clients and partners. We delivered multi-language support, a dedicated investor relations section, and role-based login for authorized users. Content editors can update news, reports, and team profiles without touching code. Security headers, SSL, and session management were implemented to enterprise standards. The result is a polished, trustworthy website that supports both public marketing and private stakeholder communication from a single platform.",
    image: images.projects.corporateWebsite,
    tags: ["Next.js", "Laravel", "CMS"],
  },
  {
    title: "E-commerce Website Development",
    category: "E-Commerce",
    description:
      "Full online store with payment gateway, inventory management, order tracking, and mobile-responsive product catalog.",
    details:
      "We developed a full-featured online store for a retail brand ready to sell beyond their physical locations. Razorpay payment integration, inventory sync, order tracking, and automated email notifications were built into the checkout flow. Product pages are mobile-first with fast image loading and clear calls to action. The admin dashboard lets the client manage stock, discounts, and shipping rules in real time. Within weeks of launch, the store was processing orders nationwide with a smooth, reliable shopping experience.",
    image: images.projects.ecommerce,
    tags: ["MERN", "Razorpay", "AWS"],
  },
  {
    title: "Portfolio Website Design",
    category: "UI/UX Design",
    description:
      "Creative portfolio platform for a design agency with smooth animations, case study pages, and contact integration.",
    details:
      "A creative agency approached us for a portfolio that would reflect their design quality before a visitor read a single word. We crafted a visually rich experience with smooth scroll animations, case study templates, and a streamlined contact funnel. Each project page highlights process, outcomes, and visuals in a layout that works on phones and large displays alike. Performance was tuned so animations stay fluid without hurting load times. The site has become their strongest sales tool — prospects often mention the portfolio itself when signing on.",
    image: images.projects.portfolio,
    tags: ["Framer Motion", "Tailwind", "Figma"],
  },
  {
    title: "High-Converting Landing Page",
    category: "Digital Marketing",
    description:
      "Performance-optimized landing page with A/B testing, conversion tracking, and integrated CRM for lead generation.",
    details:
      "This campaign landing page was built for a service business running paid ads across Google and Meta. We focused on clarity, trust signals, and a single strong conversion goal above the fold. A/B-ready sections, heatmap-friendly layout, and CRM integration mean every lead flows directly to the sales team. Page speed and Core Web Vitals were prioritized to improve ad quality scores and reduce bounce rates. The client saw measurable improvement in cost per lead within the first month of deployment.",
    image: images.projects.landingPage,
    tags: ["Landing Page", "CRO", "Analytics"],
  },
  {
    title: "Government Portal System",
    category: "Enterprise Software",
    description:
      "Secure government project portal with document management, role-based access, and real-time reporting dashboard.",
    details:
      "We delivered a secure portal for a government-linked project requiring strict access control and audit trails. The system includes document upload and versioning, role-based permissions, and real-time dashboards for supervisors. Data is stored with encryption at rest and in transit, with backup and recovery procedures documented for compliance. Staff training and handover documentation were provided so the department could operate independently. The platform reduced manual paperwork and improved transparency across departments.",
    image: images.projects.government,
    tags: ["Java", "PostgreSQL", "Security"],
  },
];

export const industries = [
  { name: "Real Estate", image: images.industries.realEstate },
  { name: "Education", image: images.industries.education },
  { name: "Doctor/Hospital", image: images.industries.healthcare },
  { name: "Travel", image: images.industries.travel },
  { name: "E-commerce", image: images.industries.ecommerce },
  { name: "Manufacturing", image: images.industries.manufacturing },
  { name: "Gym & Fitness", image: images.industries.gymFitness },
  { name: "Logistics", image: images.industries.logistics },
  { name: "Automobile", image: images.industries.automobile },
  { name: "IT & Software", image: images.industries.itSoftware },
  { name: "Hotel & Restaurants", image: images.industries.hotelRestaurants },
  { name: "Fashion", image: images.industries.fashion },
];

export const testimonials = [
  {
    name: "Ankit",
    role: "CEO",
    date: "Jan 12, 2026  4:20 PM",
    timeAgo: "2 months ago",
    quote:
      "Tasmafive Solutions delivered exactly what we needed — a fast, professional website that helped us grow our online presence significantly.",
    avatarColor: "#4285F4",
    reviewUrl:
      "https://www.google.com/maps/search/TasmaFive+Solutions+Kanpur+review+Ankit+CEO",
  },
  {
    name: "Sakshi",
    role: "Pan India Sales Head",
    date: "Dec 28, 2025  2:15 PM",
    timeAgo: "3 months ago",
    quote:
      "Their team understood our requirements perfectly and delivered a scalable software solution on time. Highly recommended!",
    avatarColor: "#EA4335",
    reviewUrl:
      "https://www.google.com/maps/search/TasmaFive+Solutions+Kanpur+review+Sakshi",
  },
  {
    name: "Mohit",
    role: "Salon Owner",
    date: "May 9, 2023  10:30 PM",
    timeAgo: "2 years ago",
    quote:
      "From web development to digital marketing, Tasmafive has been our go-to partner. Professional, reliable, and results-driven.",
    avatarColor: "#34A853",
    reviewUrl:
      "https://www.google.com/maps/search/TasmaFive+Solutions+Kanpur+review+Mohit+salon",
  },
];

export const team = [
  {
    name: "Agraj Mishra",
    role: "Founder",
    bio: "Leads product vision, client strategy, and long-term growth for TasmaFive Solutions.",
  },
  {
    name: "Rajat Goswami",
    role: "Co-Founder",
    bio: "Drives delivery excellence, engineering standards, and scalable technology execution.",
  },
];

export const aboutMission =
  "To deliver smart, secure, and scalable IT solutions that help businesses grow faster with full control and real results.";

export const aboutVision =
  "To become a trusted digital partner for startups, enterprises, and government projects across India and global markets.";

export const aboutStory = {
  eyebrow: "Who We Are",
  title: "Smart IT Solutions. Full Control. Real Results.",
  paragraphs: [
    "TasmaFive Solutions is a professional IT company based in Kanpur, delivering website development, custom software, digital marketing, cloud solutions, and government project services.",
    "We combine modern tech stacks — including MERN, Laravel, and Next.js — with transparent communication so every client, from local businesses to international partners, gets solutions built for performance, security, and long-term growth.",
    "Whether you need a high-converting website, a secure enterprise portal, or cloud infrastructure that scales with demand, our team plans, builds, and supports digital products that drive measurable business outcomes.",
  ],
};

/** How we work — process steps for About page */
export const aboutProcess = [
  {
    step: "01",
    title: "Discover & Audit",
    description:
      "We understand your goals, review your current setup, and identify gaps in performance, security, and conversion.",
  },
  {
    step: "02",
    title: "Plan & Design",
    description:
      "Clear scope, timelines, and UX/UI aligned to your brand — so you know exactly what will be delivered and when.",
  },
  {
    step: "03",
    title: "Build & Secure",
    description:
      "Clean code, responsive design, SSL, and best practices baked in — websites and software ready for real users.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description:
      "Smooth go-live, training if needed, and ongoing maintenance so your digital products stay fast and reliable.",
  },
];

/** Capability highlights tied to core services */
export const aboutCapabilities = [
  {
    title: "Web Development",
    description:
      "Static sites, dynamic platforms, landing pages, and e-commerce stores built for speed, SEO, and conversions.",
  },
  {
    title: "Cloud Solutions",
    description:
      "Migration, hosting, and infrastructure management so your data and apps stay available from anywhere.",
  },
  {
    title: "Cyber Security",
    description:
      "Website protection, encryption, and secure architecture to keep customer data and business systems safe.",
  },
  {
    title: "Data & Growth",
    description:
      "Analytics, reporting, and digital marketing support so decisions are driven by real performance insights.",
  },
];

export const aboutTrustReasons = [
  {
    number: "01",
    title: "Transparent Delivery",
    description:
      "Clear milestones, regular updates, and no hidden costs — you always know where your project stands.",
  },
  {
    number: "02",
    title: "Security First",
    description:
      "SSL, secure auth, firewalls, and best practices baked into every website and software we ship.",
  },
  {
    number: "03",
    title: "Business-Focused Design",
    description:
      "We don’t just build pages — we design for leads, trust, and conversions that support your goals.",
  },
  {
    number: "04",
    title: "Post-Launch Support",
    description:
      "Direct consultation and maintenance so your digital products stay fast, safe, and up to date.",
  },
];

export const aboutValues = [
  {
    title: "Integrity",
    description: "Honest timelines, honest scope, and honest communication with every client.",
  },
  {
    title: "Innovation",
    description: "Modern stacks like MERN, Laravel, and Next.js to keep your product future-ready.",
  },
  {
    title: "Ownership",
    description: "We treat every project like our own — quality, speed, and accountability included.",
  },
  {
    title: "Partnership",
    description: "Long-term relationships over one-time deliveries. Your growth is our success metric.",
  },
];

/** Numbered trust metrics for About page */
export const aboutStats = [
  { value: "98%", label: "Client Satisfaction", suffix: "" },
  { value: "50+", label: "Projects Delivered", suffix: "" },
  { value: "12+", label: "Industries Served", suffix: "" },
  { value: "24/7", label: "Support Availability", suffix: "" },
  { value: "5.0", label: "Google Rating", suffix: "" },
  { value: "10+", label: "Countries Presence", suffix: "" },
];

export const blogPosts = [
  {
    slug: "conversion-focused-business-websites",
    title: "How TasmaFive Builds Conversion-Focused Business Websites",
    excerpt:
      "From discovery to launch — how we design fast, SEO-ready sites that turn visitors into leads for growing brands.",
    category: "Web Development",
    date: "Mar 12, 2026",
    comments: 5,
    image: images.blog.aiWebDev,
    content: [
      "A business website should do more than look good — it should guide visitors toward a clear next step: call, enquire, book, or buy. At TasmaFive, every project starts with understanding your audience, offers, and conversion goals.",
      "We map a simple information structure: hero message, trust signals, services, proof, and a strong call to action. Design stays clean and mobile-first so pages load fast and read clearly on every device.",
      "Technical delivery includes SEO-ready structure, Core Web Vitals focus, contact/WhatsApp paths, and hosting that stays stable as traffic grows. After launch, we help you refine copy and CTAs based on real enquiries — not guesswork.",
    ],
  },
  {
    slug: "custom-software-that-scales",
    title: "Custom Software That Scales With Your Operations",
    excerpt:
      "Why enterprises choose tailor-made dashboards and workflows over one-size-fits-all tools — and how we deliver them.",
    category: "Enterprise Software",
    date: "Mar 08, 2026",
    comments: 3,
    image: images.blog.mobileFirst,
    content: [
      "Off-the-shelf tools often force your team to change how they work. Custom software flips that: we build around your processes — inventory, bookings, approvals, CRM, or internal dashboards — so operations stay fast and consistent.",
      "Our approach starts with workflow mapping, role-based access, and a clear MVP. Then we ship in phases so you get usable modules early, with room to add reports, automations, and integrations as the business grows.",
      "Secure logins, clean admin panels, and scalable architecture mean your software can start lean and expand without a full rebuild when new branches, products, or teams come online.",
    ],
  },
  {
    slug: "practical-cybersecurity-for-brands",
    title: "Practical Cybersecurity for Growing Digital Brands",
    excerpt:
      "SSL, access control, backups, and monitoring — the security baseline every business site needs before going live.",
    category: "Cyber Security",
    date: "Mar 01, 2026",
    comments: 6,
    image: images.blog.websiteSecurity,
    content: [
      "Security does not have to be complicated to be effective. For most growing brands, the highest-impact basics are HTTPS/SSL, strong admin access controls, regular backups, and keeping plugins/frameworks updated.",
      "We harden websites and apps with practical controls: least-privilege logins, secure forms, server hygiene, and monitoring that flags unusual activity early — before small issues become downtime or data risk.",
      "Whether you run a brochure site, dynamic portal, or e-commerce store, a clear security baseline protects customer trust and keeps your digital presence reliable as you scale across India and international markets.",
    ],
  },
] as const;

export type BlogPost = (typeof blogPosts)[number];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export const indiaPresence = [
  {
    city: "Kanpur",
    landmark: "JK Temple (Radhakrishna Mandir)",
    image: images.presence.india.kanpur,
  },
  {
    city: "Noida",
    landmark: "DLF Mall of India",
    image: images.presence.india.noida,
  },
  {
    city: "Gurgaon",
    landmark: "Gurugram Skyline & Cyber City",
    image: images.presence.india.gurgaon,
  },
  {
    city: "Delhi NCR",
    landmark: "India Gate & Kartavya Path",
    image: images.presence.india.delhiNcr,
  },
  {
    city: "Haryana",
    landmark: "Pinjore Gardens (Yadavindra Gardens)",
    image: images.presence.india.haryana,
  },
];

export const internationalPresence = [
  { country: "Belgium", code: "be", image: images.presence.international.belgium },
  { country: "UK", code: "gb", image: images.presence.international.uk },
  { country: "Germany", code: "de", image: images.presence.international.germany },
  { country: "Dubai", code: "ae", image: images.presence.international.dubai },
  { country: "Australia", code: "au", image: images.presence.international.australia },
  { country: "Lebanon", code: "lb", image: images.presence.international.lebanon },
  { country: "Egypt", code: "eg", image: images.presence.international.egypt },
  {
    country: "Dominican Republic",
    code: "do",
    image: images.presence.international.dominicanRepublic,
  },
  { country: "Pakistan", code: "pk", image: images.presence.international.pakistan },
  { country: "Ghana", code: "gh", image: images.presence.international.ghana },
];

export const expertise = [
  {
    title: "Custom Development",
    category: "Development",
    description:
      "Tailor-made software and web applications using modern tech stacks like MERN, Laravel, and Next.js.",
    image: images.expertise.customDevelopment,
    tags: ["MERN", "Laravel", "Next.js"],
  },
  {
    title: "Secure Infrastructure",
    category: "Security",
    description:
      "High-level security protocols, SSL, firewalls, and monitoring to protect sensitive business data.",
    image: images.expertise.secureInfrastructure,
    tags: ["SSL", "Firewall", "Compliance"],
  },
  {
    title: "Agile Execution",
    category: "Delivery",
    description:
      "Timely delivery through structured planning, sprint cycles, and transparent milestone tracking.",
    image: images.expertise.agileExecution,
    tags: ["Agile", "Sprints", "Milestones"],
  },
  {
    title: "Direct Tech Support",
    category: "Support",
    description:
      "Continuous technical assistance, maintenance, and troubleshooting services available 24/7.",
    image: images.expertise.techSupport,
    tags: ["24/7", "Maintenance", "SLA"],
  },
  {
    title: "Scalable Solutions",
    category: "Architecture",
    description:
      "Systems designed to grow with your business — from startup traffic to enterprise-level demand.",
    image: images.expertise.scalableSolutions,
    tags: ["Cloud", "Microservices", "Growth"],
  },
  {
    title: "Performance Driven",
    category: "Optimization",
    description:
      "Optimized code and lightweight architecture for fast, responsive platforms on every device.",
    image: images.expertise.performanceDriven,
    tags: ["Core Web Vitals", "CDN", "Caching"],
  },
];

export const stats = [
  { value: "Expert", label: "Full-Stack Developers" },
  { value: "24/7", label: "Direct Consultation" },
  { value: "Fast", label: "Market Delivery" },
  { value: "99.9%", label: "Commitment Rate" },
];
