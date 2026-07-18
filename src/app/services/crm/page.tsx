import {
  CrmDetail,
  ServicesPageHero,
} from "@/components/ServicesPageContent";

export const metadata = {
  title: "CRM Solutions | TasmaFive Solutions",
  description:
    "Lead management, service desk, client management, HR, email management and finance dashboards — a complete CRM tailored to your business.",
};

export default function CrmPage() {
  return (
    <section className="relative pastel-section section-glow pb-8 pt-3 lg:pb-10 lg:pt-4">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ServicesPageHero
          title="CRM Solutions"
          subtitle="Lead management, service desk, client profiles, HR, email handling and finance dashboards — one platform for your entire business."
          backHref="/services"
          backLabel="All Services"
        />
        <CrmDetail />
      </div>
    </section>
  );
}
