import {
  WebDevelopmentDetail,
  ServicesPageHero,
} from "@/components/ServicesPageContent";

export const metadata = {
  title: "Web Development Services | TasmaFive Solutions",
  description:
    "Static websites, landing pages, dynamic websites, and e-commerce solutions — end-to-end web development for every business need.",
};

export default function WebDevelopmentPage() {
  return (
    <section className="relative py-16 pastel-section section-glow pt-24 lg:py-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ServicesPageHero
          title="Web Development"
          subtitle="End-to-end website solutions for every business need — from fast static sites to full e-commerce platforms."
          backHref="/services"
          backLabel="All Services"
        />
        <WebDevelopmentDetail />
      </div>
    </section>
  );
}
