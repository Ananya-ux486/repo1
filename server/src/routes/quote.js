import { Router } from "express";
import { QuoteRequest } from "../models/index.js";
import { randomId, normalizeEmail } from "../utils/auth.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim();
    const projectType = String(req.body?.projectType || "").trim();
    const budget = String(req.body?.budget || "").trim();
    const details = String(req.body?.details || "").trim();

    if (!name || !email || !phone || !projectType || !budget || !details) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    await QuoteRequest.create({
      name,
      email,
      phone,
      projectType,
      budget,
      details,
      createdAt: new Date().toISOString(),
    });

    return res.json({ ok: true, id: randomId(8) });
  } catch (err) {
    console.error("[quote]", err);
    return res.status(500).json({ error: "Could not save quote request." });
  }
});

export default router;
