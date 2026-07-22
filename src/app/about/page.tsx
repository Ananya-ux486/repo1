import type { Metadata } from "next";
import AboutPageContent from "@/components/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | TasmaFive Solutions",
  description:
    "Learn about TasmaFive Solutions — our mission, vision, values, leadership team, and why businesses trust us for websites, software, and digital growth.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
