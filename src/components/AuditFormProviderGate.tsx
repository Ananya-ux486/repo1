"use client";

import { Suspense, type ReactNode } from "react";
import AuditFormProvider from "@/components/AuditFormProvider";

export default function AuditFormProviderGate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={children}>
      <AuditFormProvider>{children}</AuditFormProvider>
    </Suspense>
  );
}
