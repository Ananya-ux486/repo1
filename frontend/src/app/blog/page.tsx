import { BlogIndexContent } from "@/components/BlogPageContent";

export const metadata = {
  title: "Blog | TasmaFive Solutions",
  description:
    "Latest blogs from TasmaFive Solutions on web development, custom software, and cybersecurity.",
};

export default function BlogPage() {
  return (
    <section className="relative pastel-section section-glow">
      <BlogIndexContent />
    </section>
  );
}
