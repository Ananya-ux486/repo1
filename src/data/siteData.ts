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
    objectPosition: "65% center",
    heading: "Engineering Digital Products That Drive Real Growth",
    subheading:
      "We design and develop high-performance websites, mobile apps, and enterprise software — built to scale, stay secure, and deliver measurable business results.",
    ctaPrimary: "Get a Free Quote",
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
    ctaSecondary: "Talk to Experts",
    ctaSecondaryHref: "/contact",
  },
  {
    id: 4,
    image: images.hero.slide4,
    objectPosition: "55% center",
    heading: "Reliable IT Infrastructure You Can Count On",
    subheading:
      "Secure architecture, optimized performance, and dedicated support — we build the digital backbone your business needs to run smoothly around the clock.",
    ctaPrimary: "Contact Us Today",
    ctaSecondary: "Learn More",
    ctaSecondaryHref: "/about",
  },
];

export const webDevelopmentServices = [
  {
    slug: "static-websites",
    title: "Static Websites",
    description:
      "Clean, fast-loading brochure websites perfect for businesses that need a professional online presence.",
    features: ["Fast Performance", "Mobile Responsive", "SEO Ready"],
    details:
      "We build lightweight static websites using modern HTML, CSS, and JavaScript — ideal for portfolios, business profiles, and informational sites. Every page is optimized for speed, mobile devices, and search engines so your brand looks professional and loads instantly.",
    href: "/services/web-development#static-websites",
  },
  {
    slug: "landing-pages",
    title: "Landing Pages",
    description:
      "High-converting single-page designs built to capture leads and drive campaign results.",
    features: ["Conversion Focused", "A/B Test Ready", "Analytics Integrated"],
    details:
      "Purpose-built landing pages designed to turn visitors into leads and customers. We focus on clear messaging, strong CTAs, fast load times, and integration with your analytics and marketing tools for measurable campaign results.",
    href: "/services/web-development#landing-pages",
  },
  {
    slug: "dynamic-websites",
    title: "Dynamic Websites",
    description:
      "Interactive websites with admin panels, databases, and real-time content management.",
    features: ["CMS Integration", "User Authentication", "Custom Backend"],
    details:
      "Full-featured dynamic websites with custom backends, admin dashboards, and database-driven content. Perfect for businesses that need to update content regularly, manage users, or run interactive web applications.",
    href: "/services/web-development#dynamic-websites",
  },
  {
    slug: "e-commerce-solutions",
    title: "E-Commerce Solutions",
    description:
      "Full online stores with payment gateways, inventory management, and order tracking.",
    features: ["Payment Gateway", "Product Catalog", "Order Management"],
    details:
      "Complete e-commerce platforms with secure payment processing, product catalogs, inventory tracking, and order management. We build scalable online stores that grow with your business and deliver a smooth shopping experience.",
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
  { name: "Agraj Mishra", role: "Founder" },
  { name: "Rajat Goswami", role: "Co-Founder" },
];

export const blogPosts = [
  {
    title: "How AI Is Transforming Web Development in 2026",
    category: "Web Development",
    date: "Mar 12, 2026",
    comments: 5,
    image: images.blog.aiWebDev,
  },
  {
    title: "Why Mobile-First Websites Convert More Customers",
    category: "UI/UX Design",
    date: "Mar 08, 2026",
    comments: 3,
    image: images.blog.mobileFirst,
  },
  {
    title: "7 Security Must-Haves for Every Business Website",
    category: "Cyber Security",
    date: "Mar 01, 2026",
    comments: 6,
    image: images.blog.websiteSecurity,
  },
];

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
