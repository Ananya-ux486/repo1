import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Catalogue | TasmaFive Solutions",
  description:
    "TasmaFive Solutions LLP — full technology brochure with solution categories, tech stack, delivery process, and why partner with us.",
};

/**
 * Standalone layout — NO header, NO footer, NO floating widgets.
 * Just passes children through — the root layout provides <html> and <body>.
 */
export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
