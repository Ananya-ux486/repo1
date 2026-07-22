"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useCmsContent, type CmsService } from "@/lib/cms";

const SERVICE_MENU = [
  {
    label: "Web Development",
    href: "/services/web-development",
    color: "from-orange-400 to-amber-500",
    sub: [
      { label: "Static Websites", href: "/services/web-development#static-websites" },
      { label: "Landing Pages", href: "/services/web-development#landing-pages" },
      { label: "Dynamic Websites", href: "/services/web-development#dynamic-websites" },
      { label: "E-Commerce Solutions", href: "/services/web-development#e-commerce-solutions" },
    ],
  },
  {
    label: "Digital Marketing",
    href: "/services/digital-marketing",
    color: "from-pink-500 to-rose-500",
    sub: [
      { label: "SEO Services", href: "/services/digital-marketing#seo-services" },
      { label: "Graphic Designing", href: "/services/digital-marketing#graphic-designing" },
      { label: "Social Media Promotion", href: "/services/digital-marketing#social-media-promotion" },
      { label: "Verified GNB Creation", href: "/services/digital-marketing#verified-gnd-creation" },
      { label: "GMB Profile Ranking (Top 5)", href: "/services/digital-marketing#google-my-business-ranking" },
    ],
  },
  {
    label: "CRM Solutions",
    href: "/services/crm",
    color: "from-violet-500 to-purple-600",
    sub: [
      { label: "Lead Management", href: "/services/crm#lead-management" },
      { label: "Service Desk", href: "/services/crm#service-desk" },
      { label: "Client Management", href: "/services/crm#client-management" },
      { label: "HR Management", href: "/services/crm#hr-management" },
      { label: "Email Management", href: "/services/crm#email-management" },
      { label: "Finance & Advanced Dashboard", href: "/services/crm#finance-dashboard" },
    ],
  },
  {
    label: "Cloud Solutions",
    href: "/services/cloud-solutions",
    color: "from-sky-400 to-blue-500",
    sub: [
      { label: "AWS Solutions", href: "/services/cloud-solutions#aws-solutions" },
      { label: "Azure Solutions", href: "/services/cloud-solutions#azure-solutions" },
    ],
  },
] as const;

type MenuItem = {
  label: string;
  href: string;
  color: string;
  sub: { label: string; href: string }[];
};

const SECTION_ROUTES: Record<CmsService["section"], string> = {
  "web-development": "/services/web-development",
  "digital-marketing": "/services/digital-marketing",
  crm: "/services/crm",
  "cloud-solutions": "/services/cloud-solutions",
  other: "/services",
};

function buildMenu(cmsServices: CmsService[]): MenuItem[] {
  const menu: MenuItem[] = SERVICE_MENU.map((item) => ({
    ...item,
    sub: item.sub.map((sub) => ({ ...sub })),
  }));
  for (const service of cmsServices) {
    const href = `${SECTION_ROUTES[service.section]}#${service.slug}`;
    const target = menu.find((item) => item.href === SECTION_ROUTES[service.section]);
    if (!target) continue;
    const existing = target.sub.findIndex((item) => item.href.endsWith(`#${service.slug}`));
    const next = { label: service.title, href };
    if (existing >= 0) target.sub[existing] = next;
    else target.sub.push(next);
  }
  return menu;
}

// ── Desktop flyout (two-column) ───────────────────────────────────────────────
function DesktopDropdown({
  onNavigate,
  menu,
}: {
  onNavigate?: () => void;
  menu: MenuItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const active = menu[activeIndex] ?? menu[0];

  return (
    <div className="flex overflow-hidden rounded-2xl border border-border/60 bg-white shadow-2xl shadow-black/10" style={{ minWidth: 480 }}>
      {/* Left — main headings */}
      <div className="w-52 shrink-0 border-r border-border/40 bg-gradient-to-b from-orange-50/60 to-white py-2">
        {menu.map((item, i) => (
          <div
            key={item.label}
            className={`group flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-semibold transition-all cursor-pointer ${
              activeIndex === i
                ? "bg-brand/10 text-brand"
                : "text-foreground/80 hover:bg-brand/[0.06] hover:text-brand"
            }`}
            onClick={() => setActiveIndex(i)}
          >
            <Link
              href={item.href}
              onClick={(e) => {
                if (item.sub.length > 0) {
                  e.preventDefault();
                  setActiveIndex(i);
                } else {
                  onNavigate?.();
                }
              }}
              className="flex-1 py-0.5"
            >
              {item.label}
            </Link>
            {item.sub.length > 0 && (
              <ChevronRight
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  activeIndex === i ? "rotate-90 text-brand" : "text-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Right — sub-items */}
      <div className="flex flex-1 flex-col min-w-[220px]">
        <div className={`bg-gradient-to-r ${active.color} px-5 py-3.5`}>
          <Link
            href={active.href}
            onClick={onNavigate}
            className="text-sm font-bold text-white transition hover:opacity-80"
          >
            {active.label}
          </Link>
        </div>

        {active.sub.length > 0 ? (
          <ul className="flex-1 py-2">
            {active.sub.map((sub) => (
              <li key={sub.href}>
                <Link
                  href={sub.href}
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 px-5 py-2 text-sm text-muted transition hover:bg-brand/[0.06] hover:text-brand"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand/50" />
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 items-center justify-center px-5 py-6 text-center">
            <Link
              href={active.href}
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20"
            >
              View {active.label}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mobile accordion ──────────────────────────────────────────────────────────
function MobileDropdown({
  onNavigate,
  menu,
}: {
  onNavigate?: () => void;
  menu: MenuItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-1">
      {menu.map((item, i) => (
        <div key={item.label}>
          <div className="flex items-center">
            <Link
              href={item.href}
              onClick={onNavigate}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-brand"
            >
              {item.label}
            </Link>
            {item.sub.length > 0 && (
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="px-3 py-2.5 text-muted"
                aria-label={`Toggle ${item.label} sub-menu`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openIndex === i ? "rotate-180 text-brand" : ""}`}
                />
              </button>
            )}
          </div>
          {openIndex === i && item.sub.length > 0 && (
            <ul className="pb-1 pl-4">
              {item.sub.map((sub) => (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    onClick={onNavigate}
                    className="flex items-center gap-2 py-2 pl-3 pr-4 text-xs text-muted hover:text-brand"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Export — renders correct variant based on prop ────────────────────────────
export default function ServicesNavDropdown({
  onNavigate,
  mobile = false,
}: {
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const { services } = useCmsContent();
  const menu = useMemo(() => buildMenu(services), [services]);
  if (mobile) return <MobileDropdown onNavigate={onNavigate} menu={menu} />;
  return <DesktopDropdown onNavigate={onNavigate} menu={menu} />;
}
