import {
  CloudSolutionsDetail,
  ServicesPageHero,
} from "@/components/ServicesPageContent";

export const metadata = {
  title: "Cloud Solutions | TasmaFive Solutions",
  description:
    "AWS and Azure cloud solutions — setup, migration, and ongoing management of your cloud infrastructure for scalable and secure business operations.",
};

export default function CloudSolutionsPage() {
  return (
    <section className="relative pastel-section section-glow pb-8 pt-3 lg:pb-10 lg:pt-4">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ServicesPageHero
          title="Cloud Solutions"
          subtitle="Enterprise-grade AWS and Azure infrastructure — from simple hosting to full cloud migration and management."
          backHref="/services"
          backLabel="All Services"
        />
        <CloudSolutionsDetail />
      </div>
    </section>
  );
}
