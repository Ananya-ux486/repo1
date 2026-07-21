import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import {
  User,
  Activity,
  ContactMessage,
  QuoteRequest,
  AuditRequest,
  Service,
  Project,
} from "../models/index.js";
import { getAdminModels } from "../models/admin.js";
import {
  clearAdminCookie,
  createAdminSession,
  requireAdmin,
  requireTrustedOrigin,
  revokeAdminSession,
  setAdminCookie,
} from "../middleware/adminAuth.js";
import { clientMeta, normalizeEmail } from "../utils/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function strings(value, max = 30) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim().slice(0, 250))
    .filter(Boolean)
    .slice(0, max);
}

function serviceInput(body) {
  const sections = new Set([
    "web-development",
    "digital-marketing",
    "crm",
    "cloud-solutions",
    "other",
  ]);
  const accents = new Set(["", "amber", "coral", "sky", "mint"]);
  const pricingTypes = new Set(["", "fixed", "custom"]);
  const section = sections.has(body?.section) ? body.section : "other";
  const slug = normalizeSlug(body?.slug || body?.title);
  return {
    section,
    slug,
    title: String(body?.title || "").trim().slice(0, 120),
    tagline: String(body?.tagline || "").trim().slice(0, 240),
    description: String(body?.description || "").trim().slice(0, 1200),
    details: String(body?.details || "").trim().slice(0, 4000),
    features: strings(body?.features),
    subServices: Array.isArray(body?.subServices)
      ? body.subServices
          .map((item) => ({
            name: String(item?.name || "").trim().slice(0, 100),
            description: String(item?.description || "").trim().slice(0, 500),
          }))
          .filter((item) => item.name)
          .slice(0, 20)
      : [],
    pricingType: pricingTypes.has(body?.pricingType) ? body.pricingType : "custom",
    indiaPrice: String(body?.indiaPrice || "").trim().slice(0, 50),
    foreignPrice: String(body?.foreignPrice || "").trim().slice(0, 50),
    indiaNote: String(body?.indiaNote || "").trim().slice(0, 250),
    foreignNote: String(body?.foreignNote || "").trim().slice(0, 250),
    accent: accents.has(body?.accent) ? body.accent : "amber",
    image: String(body?.image || "").trim().slice(0, 1000),
    order: Number.isFinite(Number(body?.order)) ? Number(body.order) : 0,
    published: body?.published !== false,
  };
}

function projectInput(body) {
  return {
    slug: normalizeSlug(body?.slug || body?.title),
    title: String(body?.title || "").trim().slice(0, 120),
    url: String(body?.url || "").trim().slice(0, 1000),
    category: String(body?.category || "").trim().slice(0, 100),
    description: String(body?.description || "").trim().slice(0, 2000),
    tags: strings(body?.tags, 20),
    preview: String(body?.preview || "").trim().slice(0, 1000),
    order: Number.isFinite(Number(body?.order)) ? Number(body.order) : 0,
    published: body?.published !== false,
  };
}

async function audit(req, action, resource, resourceId, metadata = {}) {
  const { AdminAudit } = getAdminModels();
  const meta = clientMeta(req);
  await AdminAudit.create({
    adminId: req.admin.adminId,
    action,
    resource,
    resourceId: resourceId ? String(resourceId) : undefined,
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata,
  });
}

export async function ensureInitialAdmin() {
  const { Admin } = getAdminModels();
  const email = normalizeEmail(process.env.ADMIN_EMAIL || "admin@gmail.com");
  const password = String(process.env.ADMIN_PASSWORD || "admin");
  if (
    process.env.NODE_ENV === "production" &&
    (password === "admin" ||
      !process.env.ADMIN_SESSION_SECRET ||
      process.env.ADMIN_SESSION_SECRET.length < 32)
  ) {
    throw new Error(
      "Unsafe admin credentials are blocked in production. Set a strong ADMIN_PASSWORD and ADMIN_SESSION_SECRET.",
    );
  }
  const exists = await Admin.findOne({ email }).select("+passwordHash");
  if (exists) {
    if (
      process.env.ADMIN_PASSWORD &&
      !(await bcrypt.compare(password, exists.passwordHash))
    ) {
      exists.passwordHash = await bcrypt.hash(password, 12);
      exists.active = true;
      await exists.save();
      console.log(`[admin] password rotated for ${email}`);
    }
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({
    email,
    passwordHash,
    name: "TasmaFive Admin",
    role: "owner",
  });
  console.log(`[admin] initial account created for ${email}`);
}

router.post("/login", loginLimiter, requireTrustedOrigin, async (req, res) => {
  const { Admin, AdminAudit } = getAdminModels();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const admin = await Admin.findOne({ email }).select("+passwordHash");
  if (
    !admin ||
    !admin.active ||
    !(await bcrypt.compare(password, admin.passwordHash))
  ) {
    return res.status(401).json({ error: "Invalid admin credentials." });
  }
  admin.lastLoginAt = new Date();
  await admin.save();
  const meta = clientMeta(req);
  const token = await createAdminSession(admin, meta);
  setAdminCookie(res, token);
  await AdminAudit.create({
    adminId: admin._id,
    action: "login",
    resource: "session",
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return res.json({
    ok: true,
    admin: {
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
});

router.post("/logout", requireTrustedOrigin, async (req, res) => {
  await revokeAdminSession(req);
  clearAdminCookie(res);
  return res.json({ ok: true });
});

router.get("/session", requireAdmin, (req, res) => {
  return res.json({ authenticated: true, admin: req.admin });
});

router.use(requireAdmin, requireTrustedOrigin);

router.get("/overview", async (_req, res) => {
  const [
    users,
    services,
    projects,
    contactMessages,
    quoteRequests,
    auditRequests,
    recentUsers,
    recentActivities,
  ] = await Promise.all([
    User.countDocuments(),
    Service.countDocuments(),
    Project.countDocuments(),
    ContactMessage.countDocuments(),
    QuoteRequest.countDocuments(),
    AuditRequest.countDocuments(),
    User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email phone createdAt")
      .lean(),
    Activity.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  return res.json({
    counts: {
      users,
      services,
      projects,
      contactMessages,
      quoteRequests,
      auditRequests,
    },
    recentUsers,
    recentActivities,
  });
});

router.get("/users", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const search = String(req.query.search || "").trim();
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-passwordHash -passwordSalt")
      .lean(),
    User.countDocuments(query),
  ]);
  return res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.get("/inquiries", async (_req, res) => {
  const [contacts, quotes, audits] = await Promise.all([
    ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean(),
    QuoteRequest.find().sort({ createdAt: -1 }).limit(200).lean(),
    AuditRequest.find().sort({ createdAt: -1 }).limit(200).lean(),
  ]);
  return res.json({ contacts, quotes, audits });
});

router.get("/services", async (_req, res) => {
  const items = await Service.find().sort({ section: 1, order: 1 }).lean();
  return res.json({ items });
});

router.post("/services", async (req, res) => {
  const input = serviceInput(req.body);
  if (!input.title || !input.slug) {
    return res.status(400).json({ error: "Title and slug are required." });
  }
  const item = await Service.create(input);
  await audit(req, "create", "service", item._id, { title: item.title });
  return res.status(201).json({ item });
});

router.put("/services/:id", async (req, res) => {
  const input = serviceInput(req.body);
  if (!input.title || !input.slug) {
    return res.status(400).json({ error: "Title and slug are required." });
  }
  const item = await Service.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ error: "Service not found." });
  await audit(req, "update", "service", item._id, { title: item.title });
  return res.json({ item });
});

router.delete("/services/:id", async (req, res) => {
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Service not found." });
  await audit(req, "delete", "service", item._id, { title: item.title });
  return res.json({ ok: true });
});

router.get("/projects", async (_req, res) => {
  const items = await Project.find().sort({ order: 1, createdAt: 1 }).lean();
  return res.json({ items });
});

router.post("/projects", async (req, res) => {
  const input = projectInput(req.body);
  if (!input.title || !input.slug || !input.url) {
    return res.status(400).json({ error: "Title, slug and URL are required." });
  }
  const item = await Project.create(input);
  await audit(req, "create", "project", item._id, { title: item.title });
  return res.status(201).json({ item });
});

router.put("/projects/:id", async (req, res) => {
  const input = projectInput(req.body);
  if (!input.title || !input.slug || !input.url) {
    return res.status(400).json({ error: "Title, slug and URL are required." });
  }
  const item = await Project.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ error: "Project not found." });
  await audit(req, "update", "project", item._id, { title: item.title });
  return res.json({ item });
});

router.delete("/projects/:id", async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Project not found." });
  await audit(req, "delete", "project", item._id, { title: item.title });
  return res.json({ ok: true });
});

export default router;
