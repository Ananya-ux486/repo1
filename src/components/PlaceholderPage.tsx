"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center section-glow pt-20 lg:pt-24">
      <div className="mx-auto max-w-lg px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Construction className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
          <p className="mt-4 text-muted">{description}</p>
          <p className="mt-2 text-sm text-muted/70">
            This page is under development. Coming soon!
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand/30 px-6 py-3 text-sm font-medium text-brand transition hover:bg-brand/10"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
