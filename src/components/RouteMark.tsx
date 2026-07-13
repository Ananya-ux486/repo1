"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Marks home route for Safari-safe header offset (avoids relying only on :has()). */
export default function RouteMark() {
  const pathname = usePathname();

  useEffect(() => {
    const isHome = pathname === "/";
    document.body.dataset.tfRoute = isHome ? "home" : "page";
    document.documentElement.dataset.tfRoute = isHome ? "home" : "page";
  }, [pathname]);

  return null;
}
