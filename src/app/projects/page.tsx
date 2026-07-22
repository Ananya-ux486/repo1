import dynamic from "next/dynamic";
import { getSession } from "@/lib/auth/session";
import type { ProjectsInitialSession } from "@/components/ProjectsPageContent";

const ProjectsPageContent = dynamic(
  () => import("@/components/ProjectsPageContent"),
  {
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center py-10 text-sm text-muted">
        Loading projects…
      </div>
    ),
  },
);

export const metadata = {
  title: "Projects | TasmaFive Solutions",
  description:
    "Explore our portfolio of web development, e-commerce, enterprise software, and digital marketing projects.",
};

export default async function ProjectsPage() {
  const session = await getSession();

  let initialSession: ProjectsInitialSession;
  if (session?.projectsAccess) {
    initialSession = {
      hasAccess: true,
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
      },
      isAdmin: session.userId === "team-admin",
    };
  } else {
    initialSession = {
      hasAccess: false,
      user: null,
      isAdmin: false,
    };
  }

  return <ProjectsPageContent initialSession={initialSession} />;
}
