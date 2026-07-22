import { Router } from "express";
import { ContactMessage } from "../models/index.js";
import { randomId, normalizeEmail } from "../utils/auth.js";
import { safeLogError } from "../utils/security.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim();
    const reason = String(req.body?.reason || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || !email || !reason || !message) {
      return res.status(400).json({
        error: "Name, email, reason, and message are required.",
      });
    }

    await ContactMessage.create({
      name,
      email,
      phone,
      reason,
      message,
      createdAt: new Date().toISOString(),
    });

    // Keep collection lean
    const count = await ContactMessage.countDocuments();
    if (count > 500) {
      const old = await ContactMessage.find()
        .sort({ createdAt: 1 })
        .limit(count - 500)
        .select("_id");
      await ContactMessage.deleteMany({ _id: { $in: old.map((d) => d._id) } });
    }

    return res.json({ ok: true, id: randomId(8) });
  } catch (err) {
    safeLogError("contact", err);
    return res.status(500).json({ error: "Could not save message." });
  }
});

export default router;
