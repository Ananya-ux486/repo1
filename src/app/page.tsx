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
      <ViewportGate minHeight="520px">
        <ServicesSection />
      </ViewportGate>
      <ViewportGate minHeight="480px">
        <ApproachSection />
      </ViewportGate>
      <div className="perf-section">
        <ViewportGate minHeight="560px">
          <ExpertiseSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="520px">
          <Industry360Section />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="480px">
          <TestimonialsSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="520px">
          <InstagramFeedSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="480px">
          <TeamBlogSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="520px">
          <PresenceSection />
        </ViewportGate>
      </div>
    </>
  );
}
