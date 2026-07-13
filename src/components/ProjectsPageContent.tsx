"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Lock,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { liveProjects } from "@/data/liveProjects";
import ProjectsAuthModal from "@/components/ProjectsAuthModal";
import AdminActivityPanel from "@/components/AdminActivityPanel";
import { floatEase, floatStagger } from "@/lib/floatMotion";
import { IMAGE_BLUR } from "@/lib/motion";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export default function ProjectsPageContent() {
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await res.json()) as {
          projectsAccess?: boolean;
          user?: AuthUser;
        };
        if (cancelled) return;

        if (data.projectsAccess && data.user) {
          setHasAccess(true);
          setUser(data.user);
          setIsAdmin(data.user.id === "team-admin");
          setShowModal(false);
        } else {
          setHasAccess(false);
          setShowModal(true);
        }
      } catch {
        if (!cancelled) {
          setHasAccess(false);
          setShowModal(true);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUnlocked = (nextUser: AuthUser) => {
    setUser(nextUser);
    setHasAccess(true);
    setIsAdmin(nextUser.id === "team-admin");
    setShowModal(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setHasAccess(false);
    setUser(null);
    setIsAdmin(false);
    setShowModal(true);
  };

  return (
    <div className="relative overflow-hidden pb-12 pt-4 pastel-section section-glow lg:pb-16 lg:pt-5">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Projects
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
              Live client work
            </h1>
          </div>
          {hasAccess && user && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                {isAdmin
                  ? "Admin access"
                  : `Verified · ${user.name.split(" ")[0]}`}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-brand/30 hover:text-brand"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          )}
        </div>

        {checking ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
            <Loader2 className="h-7 w-7 animate-spin text-brand" />
            <p className="text-sm font-medium">Loading projects…</p>
          </div>
        ) : hasAccess ? (
          <>
            {isAdmin && <AdminActivityPanel />}
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
            {liveProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.6,
                  delay: floatStagger(i, 0.1),
                  ease: floatEase,
                }}
                className="group overflow-hidden rounded-3xl border border-border bg-white shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={project.preview}
                    alt={`${project.title} homepage`}
                    fill
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                    className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800 backdrop-blur-sm">
                    {project.category}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark"
                  >
                    View Project
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
          </>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-border bg-white/70 shadow-sm">
            <div className="pointer-events-none select-none blur-[6px] opacity-60">
              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
                {liveProjects.map((project) => (
                  <div
                    key={project.id}
                    className="h-48 rounded-2xl bg-gradient-to-br from-slate-100 via-orange-50 to-sky-50"
                  />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/40 px-6 text-center backdrop-blur-[2px]">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg">
                <Lock className="h-6 w-6" />
              </span>
              <h2 className="text-xl font-bold text-foreground">
                Projects are locked
              </h2>
              <p className="max-w-md text-sm text-muted">
                Sign up or log in to unlock this private portfolio.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-1 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark"
              >
                Unlock Projects
              </button>
            </div>
          </div>
        )}
      </div>

      <ProjectsAuthModal
        open={showModal && !hasAccess}
        onUnlocked={handleUnlocked}
      />
    </div>
  );
}
