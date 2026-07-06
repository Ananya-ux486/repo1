import HeroCarousel from "@/components/HeroCarousel";
import BrandMarquee from "@/components/BrandMarquee";
import CreativeStrip from "@/components/CreativeStrip";
import ServicesSection from "@/components/ServicesSection";
import ApproachSection from "@/components/ApproachSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import Industry360Section from "@/components/Industry360Section";
import TestimonialsSection from "@/components/TestimonialsSection";
import TeamBlogSection from "@/components/TeamBlogSection";
import PresenceSection from "@/components/PresenceSection";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <BrandMarquee />
      <CreativeStrip />
      <ServicesSection />
      <ApproachSection />
      <ExpertiseSection />
      <Industry360Section />
      <TestimonialsSection />
      <TeamBlogSection />
      <PresenceSection />
    </>
  );
}
