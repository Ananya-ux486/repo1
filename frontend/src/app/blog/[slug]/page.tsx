import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/siteData";
import { BlogPostContent } from "@/components/BlogPageContent";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog | TasmaFive Solutions" };
  return {
    title: `${post.title} | TasmaFive Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <section className="relative pastel-section section-glow">
      <BlogPostContent post={post} />
    </section>
  );
}
