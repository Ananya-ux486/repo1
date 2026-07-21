import { createHash, randomBytes } from "crypto";
import { getAdminModels } from "../models/admin.js";

const COOKIE_NAME = "tf_admin_session";
const MAX_AGE_MS = 8 * 60 * 60 * 1000;

function tokenHash(token) {
  return createHash("sha256").update(String(token || "")).digest("hex");
}

export async function createAdminSession(admin, meta = {}) {
  const { AdminSession } = getAdminModels();
  const token = randomBytes(32).toString("base64url");
  await AdminSession.create({
    adminId: admin._id,
    tokenHash: tokenHash(token),
    expiresAt: new Date(Date.now() + MAX_AGE_MS),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return token;
}

export function setAdminCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_MS,
  });
}

export function clearAdminCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function revokeAdminSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return;
  const { AdminSession } = getAdminModels();
  await AdminSession.updateOne(
    { tokenHash: tokenHash(token), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: "Admin authentication required." });
    }
    const { Admin, AdminSession } = getAdminModels();
    const session = await AdminSession.findOne({
      tokenHash: tokenHash(token),
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();
    if (!session) {
      clearAdminCookie(res);
      return res.status(401).json({ error: "Admin authentication required." });
    }
    const admin = await Admin.findOne({
      _id: session.adminId,
      active: true,
    })
      .select("email name role")
      .lean();
    if (!admin) {
      clearAdminCookie(res);
      return res.status(401).json({ error: "Admin authentication required." });
    }
    req.admin = {
      adminId: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      sessionId: String(session._id),
    };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireTrustedOrigin(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (!origin) return next();
  const allowed = new Set(
    (
      process.env.ADMIN_ORIGINS ||
      "http://localhost:3001,https://admin.tasmafivesolutions.com"
    )
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  if (!allowed.has(origin)) {
    return res.status(403).json({ error: "Untrusted request origin." });
  }
  next();
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME };
