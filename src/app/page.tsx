import HeroCarousel from "@/components/HeroCarousel";
import BrandMarquee from "@/components/BrandMarquee";
import CreativeStrip from "@/components/CreativeStrip";
import ServicesSection from "@/components/ServicesSection";
import ApproachSection from "@/components/ApproachSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TeamBlogSection from "@/components/TeamBlogSection";
import PresenceSection from "@/components/PresenceSection";

export default function HomePage() {
  return (
    <>
      <div className="-mt-[60px]">
        <HeroCarousel />
      </div>
      <BrandMarquee />
      <CreativeStrip />
      <ServicesSection />
      <ApproachSection />
      <ProjectsSection />
      <TestimonialsSection />
      <TeamBlogSection />
      <PresenceSection />
    </>
  );
}
