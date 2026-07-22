import { Router } from "express";
import { AuditRequest } from "../models/index.js";
import { randomId, normalizeEmail } from "../utils/auth.js";
import { safeLogError } from "../utils/security.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const countryCode = String(req.body?.countryCode || "").trim();
    const phone = String(req.body?.phone || "").trim();
    const company = String(req.body?.company || "").trim();
    const website = String(req.body?.website || "").trim();
    const focus = String(req.body?.focus || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || !email || !phone || !countryCode || !focus) {
      return res.status(400).json({
        error:
          "Name, email, phone with country code, and audit focus are required.",
      });
    }

    await AuditRequest.create({
      name,
      email,
      countryCode,
      phone,
      fullPhone: `${countryCode} ${phone}`,
      company,
      website,
      focus,
      message,
      createdAt: new Date().toISOString(),
    });

    return res.json({ ok: true, id: randomId(8) });
  } catch (err) {
    safeLogError("audit", err);
    return res.status(500).json({ error: "Could not save audit request." });
  }
});

export default router;
