import {
  ServicesOverview,
  ServicesPageHero,
} from "@/components/ServicesPageContent";

export const metadata = {
  title: "Services | TasmaFive Solutions",
  description:
    "Web development, cloud solutions, cyber security, and data analytics — comprehensive IT services for your business.",
};

export default function ServicesPage() {
  return (
    <section className="relative py-16 pastel-section section-glow pt-24 lg:py-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ServicesPageHero
          title="Our Services"
          subtitle="We deliver innovative and scalable IT solutions designed to help businesses grow, streamline operations, and achieve digital success."
          backHref="/"
          backLabel="Back to Home"
        />
        <ServicesOverview />
      </div>
    </section>
  );
}
