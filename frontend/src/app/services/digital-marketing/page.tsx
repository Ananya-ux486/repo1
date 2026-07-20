import {
  DigitalMarketingDetail,
  ServicesPageHero,
} from "@/components/ServicesPageContent";

export const metadata = {
  title: "Digital Marketing Services | TasmaFive Solutions",
  description:
    "SEO, graphic design, social media campaigns (Meta & Google Ads), GMB ranking, and verified business listings — full digital marketing services with flexible pricing.",
};

export default function DigitalMarketingPage() {
  return (
    <section className="relative pastel-section section-glow pb-8 pt-3 lg:pb-10 lg:pt-4">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ServicesPageHero
          title="Digital Marketing"
          subtitle="SEO, paid campaigns, graphic design, and local ranking — complete digital marketing solutions tailored to your goals and budget."
          backHref="/services"
          backLabel="All Services"
        />
        <DigitalMarketingDetail />
      </div>
    </section>
  );
}
