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
    <section className="relative pastel-section section-glow pb-8 pt-3 lg:pb-10 lg:pt-4">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ServicesPageHero
          title="Web Development"
          subtitle="End-to-end website packages with transparent India & international pricing — from static sites to full e-commerce."
          backHref="/services"
          backLabel="All Services"
        />
        <WebDevelopmentDetail />
      </div>
    </section>
  );
}
