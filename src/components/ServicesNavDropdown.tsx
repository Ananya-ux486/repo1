"use client";

import Link from "next/link";

/** Header Services menu — Web Development only + 4 sub-items */
const WEB_DEV_SUB_ITEMS = [
  { label: "Static Websites", href: "/services/web-development#static-websites" },
  { label: "Landing Pages", href: "/services/web-development#landing-pages" },
  { label: "Dynamic Websites", href: "/services/web-development#dynamic-websites" },
  { label: "E-Commerce Solutions", href: "/services/web-development#e-commerce-solutions" },
] as const;

export default function ServicesNavDropdown({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Web development services">
      <Link
        href="/services/web-development"
        onClick={onNavigate}
        className="block border-b border-border/50 bg-brand/[0.04] px-4 py-3 text-sm font-bold text-brand transition hover:bg-brand/10"
      >
        Web Development
      </Link>
      <ul className="py-2">
        {WEB_DEV_SUB_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-2 py-2 pl-6 pr-4 text-xs font-medium text-muted transition hover:bg-surface hover:text-brand"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-brand/60" aria-hidden />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
