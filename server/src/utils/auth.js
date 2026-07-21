import { createHmac, randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";

const COOKIE_NAME = "tf_projects_auth";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function secret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "tasmafive-dev-auth-secret-change-me"
  );
}

export function hashPassword(password, salt) {
  const usedSalt = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, usedSalt, 64).toString("hex");
  return { hash, salt: usedSalt };
}

export function verifyPassword(password, hash, salt) {
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

export function hashOtp(code) {
  return createHash("sha256").update(code).digest("hex");
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function randomId(bytes = 12) {
  return randomBytes(bytes).toString("hex");
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function encode(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function decode(token) {
  const [body, sig] = String(token || "").split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken({ userId, email, name, projectsAccess }) {
  return encode({
    userId,
    email,
    name,
    projectsAccess: Boolean(projectsAccess),
    exp: Date.now() + MAX_AGE_SEC * 1000,
  });
}

export function readSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  return decode(token);
}

export function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: MAX_AGE_SEC * 1000,
  });
}

export function clearSessionCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 0,
  });
}

export function clientMeta(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : String(forwarded || "")
        .split(",")[0]
        .trim() || req.socket?.remoteAddress || "";
  const userAgent = req.headers["user-agent"] || "";
  return { ip, userAgent };
}

export { COOKIE_NAME, MAX_AGE_SEC };
