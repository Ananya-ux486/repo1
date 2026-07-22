"use client";

import { usePathname } from "next/navigation";

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBrochure = pathname === "/catalogue/brochure";

  return (
    <>
      {isBrochure && (
        <style>{`
          /* Hide global footer and floating widgets on brochure page */
          footer,
          [data-floating-widgets],
          .floating-widgets-root {
            display: none !important;
          }
        `}</style>
      )}
      {children}
    </>
  );
}
