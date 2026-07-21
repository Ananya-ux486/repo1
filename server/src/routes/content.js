import { Router } from "express";
import { Project, Service } from "../models/index.js";

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
  return res.json({ services, projects });
});

export default router;
