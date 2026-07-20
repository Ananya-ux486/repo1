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
    <section className="relative pastel-section section-glow pb-8 pt-3 lg:pb-10 lg:pt-4">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ServicesPageHero
          title="Our Services"
          subtitle="We deliver innovative and scalable IT solutions designed to help businesses grow, streamline operations, and achieve digital success."
        />
        <ServicesOverview />
      </div>
    </section>
  );
}
