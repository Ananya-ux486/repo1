import dynamic from "next/dynamic";
import HeroCarousel from "@/components/HeroCarousel";
import ViewportGate from "@/components/ViewportGate";

const BrandMarquee = dynamic(() => import("@/components/BrandMarquee"));
const CreativeStrip = dynamic(() => import("@/components/CreativeStrip"));
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const ApproachSection = dynamic(() => import("@/components/ApproachSection"));
const ExpertiseSection = dynamic(() => import("@/components/ExpertiseSection"));
const Industry360Section = dynamic(() => import("@/components/Industry360Section"));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"));
const InstagramFeedSection = dynamic(() => import("@/components/InstagramFeedSection"));
const TeamBlogSection = dynamic(() => import("@/components/TeamBlogSection"));
const PresenceSection = dynamic(() => import("@/components/PresenceSection"));

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <BrandMarquee />
      <CreativeStrip />
      <ServicesSection />
      <ApproachSection />
      <div className="perf-section">
        <ViewportGate minHeight="420px">
          <ExpertiseSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="420px">
          <Industry360Section />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="360px">
          <TestimonialsSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="420px">
          <InstagramFeedSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="420px">
          <TeamBlogSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="360px">
          <PresenceSection />
        </ViewportGate>
      </div>
    </>
  );
}
