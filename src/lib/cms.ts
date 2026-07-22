"use client";

import { useEffect, useState } from "react";
import type { LiveProject } from "@/data/liveProjects";

export type CmsService = {
  _id: string;
  section:
    | "web-development"
    | "digital-marketing"
    | "crm"
    | "cloud-solutions"
    | "other";
  slug: string;
  title: string;
  tagline: string;
  description: string;
  details: string;
  features: string[];
  subServices: { name: string; description: string }[];
  pricingType: "" | "fixed" | "custom";
  indiaPrice: string;
  foreignPrice: string;
  indiaNote: string;
  foreignNote: string;
  accent: "" | "amber" | "coral" | "sky" | "mint";
  image: string;
  order: number;
  published: boolean;
};

export type CmsProject = {
  _id: string;
  slug: string;
  title: string;
  url: string;
  category: string;
  description: string;
  tags: string[];
  preview: string;
  order: number;
  published: boolean;
};

type CmsPayload = {
  services: CmsService[];
  projects: CmsProject[];
};

let cached: CmsPayload | null = null;
let request: Promise<CmsPayload> | null = null;

async function loadContent() {
  if (cached) return cached;
  if (!request) {
    request = fetch("/api/content", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("CMS content unavailable");
        return (await response.json()) as CmsPayload;
      })
      .then((payload) => {
        cached = payload;
        return payload;
      })
      .finally(() => {
        request = null;
      });
  }
  return request;
}

export function useCmsContent() {
  const [content, setContent] = useState<CmsPayload>(
    cached ?? { services: [], projects: [] },
  );

  useEffect(() => {
    let active = true;
    void loadContent()
      .then((payload) => {
        if (active) setContent(payload);
      })
      .catch(() => {
        // Static content remains the resilient fallback.
      });
    return () => {
      active = false;
    };
  }, []);

  return content;
}

export function mergeProjects(
  defaults: LiveProject[],
  cmsProjects: CmsProject[],
): LiveProject[] {
  const overrides = new Map(cmsProjects.map((item) => [item.slug, item]));
  const merged = defaults.map((item) => {
    const override = overrides.get(item.id);
    if (!override) return item;
    overrides.delete(item.id);
    return {
      id: override.slug,
      title: override.title || item.title,
      url: override.url || item.url,
      category: override.category || item.category,
      description: override.description || item.description,
      tags: override.tags.length ? override.tags : item.tags,
      preview: override.preview || item.preview,
    };
  });
  for (const item of overrides.values()) {
    merged.push({
      id: item.slug,
      title: item.title,
      url: item.url,
      category: item.category,
      description: item.description,
      tags: item.tags,
      preview: item.preview || "/images/projects/live/dr-tour.jpg",
    });
  }
  return merged;
}
