import { Suspense } from "react";
import ProjectsPageContent from "@/components/ProjectsPageContent";

export const metadata = {
  title: "Projects | TasmaFive Solutions",
  description:
    "Explore our portfolio of web development, e-commerce, enterprise software, and digital marketing projects.",
};

function ProjectsFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-10 text-sm text-muted">
      Loading projects…
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsFallback />}>
      <ProjectsPageContent />
    </Suspense>
  );
}
