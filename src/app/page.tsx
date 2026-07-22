import dynamic from "next/dynamic";
import HeroCarousel from "@/components/HeroCarousel";
import BrandMarquee from "@/components/BrandMarquee";
import CreativeStrip from "@/components/CreativeStrip";
import ViewportGate from "@/components/ViewportGate";

const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const ApproachSection = dynamic(() => import("@/components/ApproachSection"));
const ExpertiseSection = dynamic(() => import("@/components/ExpertiseSection"));
const Industry360Section = dynamic(() => import("@/components/Industry360Section"));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"));
const InstagramFeedSection = dynamic(() => import("@/components/InstagramFeedSection"));
const TeamBlogSection = dynamic(() => import("@/components/TeamBlogSection"));
const PresenceSection = dynamic(() => import("@/components/PresenceSection"));

/** Prefetch below-fold sections early so float animations start on arrival, not after a mount lag. */
const GATE_MARGIN = "320px 0px";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <BrandMarquee />
      {/* Above-the-fold strip: no ViewportGate / content-visibility delay */}
      <CreativeStrip />
      <div className="perf-section">
        <ViewportGate minHeight="380px" rootMargin={GATE_MARGIN}>
          <ServicesSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="360px" rootMargin={GATE_MARGIN}>
          <ApproachSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="420px" rootMargin={GATE_MARGIN}>
          <ExpertiseSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="420px" rootMargin={GATE_MARGIN}>
          <Industry360Section />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="360px" rootMargin={GATE_MARGIN}>
          <TestimonialsSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="420px" rootMargin={GATE_MARGIN}>
          <InstagramFeedSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="420px" rootMargin={GATE_MARGIN}>
          <TeamBlogSection />
        </ViewportGate>
      </div>
      <div className="perf-section">
        <ViewportGate minHeight="360px" rootMargin={GATE_MARGIN}>
          <PresenceSection />
        </ViewportGate>
      </div>
    </>
  );
}
