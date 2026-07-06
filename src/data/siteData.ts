import { images } from "./images";

export const siteConfig = {
  name: "TasmaFive Solutions",
  tagline: "Smart IT Solutions. Full Control. Real Results.",
  email: "info@tasmafivesolutions.com",
  phones: ["+91-6307558730", "+91-9818272320"],
  whatsapp: "916307558730",
  payNowUrl: "/contact",
  address: "60/43 Nayaganj Kanpur Nagar (UP) 208001",
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
    heading: "Transforming Ideas Into Powerful Digital Solutions",
    subheading:
      "We build scalable websites, mobile applications, enterprise software, cloud solutions, and AI-powered digital experiences that help businesses grow faster.",
    ctaPrimary: "",
    ctaSecondary: "Learn More",
  },
  {
    id: 2,
    image: images.hero.slide2,
    heading: "Your Trusted Partner for Digital Growth",
    subheading:
      "We help startups, businesses, and organizations achieve success through innovative technology and result-driven strategies.",
    ctaPrimary: "Get Started Today",
    ctaSecondary: "View Projects",
  },
  {
    id: 3,
    image: images.hero.slide3,
    heading: "AI-Powered Solutions for Tomorrow's Business",
    subheading:
      "Harness artificial intelligence and cutting-edge technology to automate processes, innovate faster, and stay ahead of the competition.",
    ctaPrimary: "Explore AI Services",
    ctaSecondary: "Our Services",
  },
  {
    id: 4,
    image: images.hero.slide4,
    heading: "Smart IT Solutions. Full Control. Real Results.",
    subheading:
      "At Tasmafive Solutions, we bring the latest tech stacks (MERN, Laravel) and dedicated focus to every partner we work with.",
    ctaPrimary: "Start Your Journey",
    ctaSecondary: "Contact Us",
  },
];

export const services = [
  {
    title: "Web Development",
    description:
      "We create fast, responsive, and scalable websites that enhance your online presence and drive business growth.",
    features: ["Frontend & Backend Development", "Mobile-Friendly & Responsive Design"],
    href: "/services",
  },
  {
    title: "Cloud Solutions",
    description:
      "Secure, scalable, and cost-effective cloud solutions to store, manage, and access data seamlessly from anywhere.",
    features: ["Cloud Migration & Deployment", "Cloud Infrastructure Management"],
    href: "/services",
  },
  {
    title: "Cyber Security",
    description:
      "Advanced cybersecurity solutions to protect your business from threats, ensuring complete data security.",
    features: ["Website Security & Protection", "Data Encryption & Privacy"],
    href: "/services",
  },
  {
    title: "Data Analytics",
    description:
      "Turn your data into valuable insights that help you make smarter decisions and grow your business.",
    features: ["Data Analysis & Reporting", "Data Visualization & Insights"],
    href: "/services",
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
    quote:
      "Tasmafive Solutions delivered exactly what we needed — a fast, professional website that helped us grow our online presence significantly.",
  },
  {
    name: "Sakshi",
    role: "Pan India Sales Head",
    date: "Dec 28, 2025  2:15 PM",
    quote:
      "Their team understood our requirements perfectly and delivered a scalable software solution on time. Highly recommended!",
  },
  {
    name: "Mohit",
    role: "Salon Owner",
    date: "May 9, 2023  10:30 PM",
    quote:
      "From web development to digital marketing, Tasmafive has been our go-to partner. Professional, reliable, and results-driven.",
  },
];

export const team = [
  { name: "Agraj Mishra", role: "Founder" },
  { name: "Rajat Goswami", role: "Co-Founder" },
];

export const blogPosts = [
  {
    title: "Top 5 Web Development Trends You Should Know in 2026",
    category: "Web Development",
    date: "Jan 10, 2026",
    comments: 3,
    image: images.blog.webDevTrends,
  },
  {
    title: "Why Cloud Solutions Are Essential for Modern Businesses",
    category: "Cloud Solutions",
    date: "Jan 08, 2026",
    comments: 2,
    image: images.blog.cloudSolutions,
  },
  {
    title: "How to Protect Your Business from Cyber Threats in 2026",
    category: "Cyber Security",
    date: "Feb 05, 2026",
    comments: 4,
    image: images.blog.cyberSecurity,
  },
];

export const indiaPresence = [
  {
    city: "Bangalore",
    landmark: "Vidhana Soudha",
    image: images.presence.india.bangalore,
  },
  {
    city: "Delhi",
    landmark: "Red Fort",
    image: images.presence.india.delhi,
  },
  {
    city: "Pune",
    landmark: "Shaniwar Wada",
    image: images.presence.india.pune,
  },
  {
    city: "Chandigarh",
    landmark: "Rock Garden",
    image: images.presence.india.chandigarh,
  },
  {
    city: "Hyderabad",
    landmark: "Charminar",
    image: images.presence.india.hyderabad,
  },
  {
    city: "Jaipur",
    landmark: "Hawa Mahal",
    image: images.presence.india.jaipur,
  },
];

export const internationalPresence = [
  { country: "Dubai", flag: "🇦🇪", code: "ae", image: images.presence.international.dubai },
  { country: "Bangladesh", flag: "🇧🇩", code: "bd", image: images.presence.international.bangladesh },
  { country: "Malaysia", flag: "🇲🇾", code: "my", image: images.presence.international.malaysia },
  { country: "Australia", flag: "🇦🇺", code: "au", image: images.presence.international.australia },
  { country: "USA", flag: "🇺🇸", code: "us", image: images.presence.international.usa },
  { country: "Nepal", flag: "🇳🇵", code: "np", image: images.presence.international.nepal },
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
