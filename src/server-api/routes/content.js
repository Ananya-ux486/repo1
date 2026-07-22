import { Router } from "express";
import { Project, Service } from "../models/index.js";
import { isSafePublicUrl } from "../utils/security.js";

const router = Router();

router.get("/", async (_req, res) => {
  const [services, projects] = await Promise.all([
    Service.find({ published: true })
      .sort({ section: 1, order: 1, createdAt: 1 })
      .select("-__v")
      .lean(),
    Project.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .select("-__v")
      .lean(),
  ]);

  res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  const safeServices = services.map((service) => ({
    ...service,
    image: isSafePublicUrl(service.image, { allowRelative: true })
      ? service.image
      : "",
  }));
  const safeProjects = projects
    .filter((project) => isSafePublicUrl(project.url))
    .map((project) => ({
      ...project,
      preview: isSafePublicUrl(project.preview, { allowRelative: true })
        ? project.preview
        : "",
    }));
  return res.json({ services: safeServices, projects: safeProjects });
});

export default router;
