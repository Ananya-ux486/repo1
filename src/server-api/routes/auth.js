import { Router } from "express";
import rateLimit from "express-rate-limit";
import { timingSafeEqual } from "node:crypto";
import { User, Otp, Activity, Payment } from "../models/index.js";
import {
  hashPassword,
  verifyPassword,
  hashOtp,
  generateOtp,
  randomId,
  normalizeEmail,
  createSessionToken,
  readSession,
  setSessionCookie,
  clearSessionCookie,
  clientMeta,
  MAX_AGE_SEC,
} from "../utils/auth.js";
import { sendOtpEmail, notifyAdminLogin } from "../utils/mail.js";
import { demoOtpEnabled, safeLogError } from "../utils/security.js";

const router = Router();

/** When true, signup/login require email OTP. Default off until email is configured. */
function authRequireOtp() {
  return process.env.AUTH_REQUIRE_OTP === "true";
}

function limiter(windowMs, limit, message) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    message: { error: message },
  });
}

const signupLimiter = limiter(60 * 60 * 1000, 5, "Too many signup attempts. Try again later.");
const loginLimiter = limiter(15 * 60 * 1000, 10, "Too many login attempts. Try again later.");
const privilegedLimiter = limiter(15 * 60 * 1000, 5, "Too many access attempts. Try again later.");
const otpSendLimiter = limiter(10 * 60 * 1000, 5, "Too many OTP requests. Try again later.");
const otpVerifyLimiter = limiter(10 * 60 * 1000, 10, "Too many OTP attempts. Try again later.");

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}

function requireTrustedOrigin(req, res, next) {
  const origin = req.get("origin");
  if (!origin && process.env.NODE_ENV !== "production") return next();
  const allowed = new Set(
    String(process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  if (!origin || !allowed.has(origin)) {
    return res.status(403).json({ error: "Untrusted request origin." });
  }
  return next();
}

async function logActivity(fields) {
  const event = await Activity.create({
    type: fields.type,
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    ip: fields.ip,
    userAgent: fields.userAgent,
    notifiedAdmin: false,
    createdAt: new Date().toISOString(),
  });
  const count = await Activity.countDocuments();
  if (count > 500) {
    const old = await Activity.find().sort({ createdAt: 1 }).limit(count - 500).select("_id");
    await Activity.deleteMany({ _id: { $in: old.map((d) => d._id) } });
  }
  return event;
}

async function issueAccessSession(res, user, message) {
  const token = createSessionToken({
    userId: String(user._id),
    email: user.email,
    name: user.name,
    projectsAccess: true,
  });
  setSessionCookie(res, token);
  return res.json({
    ok: true,
    otpRequired: false,
    access: true,
    sessionExpiresInSec: MAX_AGE_SEC,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    message,
  });
}

async function issueOtpAndRespond(res, user, messageDelivered, messageDemo) {
  const code = generateOtp();
  await Otp.deleteMany({ email: user.email });
  await Otp.create({
    email: user.email,
    codeHash: hashOtp(code),
    expiresAt: Date.now() + 10 * 60 * 1000,
    purpose: "projects-access",
    attempts: 0,
  });

  const token = createSessionToken({
    userId: String(user._id),
    email: user.email,
    name: user.name,
    projectsAccess: false,
  });
  setSessionCookie(res, token);

  const delivered = await sendOtpEmail({
    to: user.email,
    name: user.name,
    code,
  });
  const allowDemo = !delivered.delivered && delivered.demo && demoOtpEnabled();
  if (!delivered.delivered && !allowDemo) {
    await Otp.deleteMany({ email: user.email });
    return res.status(503).json({
      error: "Verification email is temporarily unavailable. Please try again later.",
    });
  }

  const body = {
    ok: true,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
    otpRequired: true,
    message: delivered.delivered ? messageDelivered : messageDemo,
  };
  if (allowDemo) body.demoOtp = code;
  return res.json(body);
}

router.post("/signup", signupLimiter, requireTrustedOrigin, async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim();
    const password = String(req.body?.password || "");

    if (name.length < 2) {
      return res.status(400).json({ error: "Please enter your full name." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!/^[+\d][\d\s\-]{8,20}$/.test(phone)) {
      return res.status(400).json({ error: "Please enter a valid phone number." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        error: "User already exists. Please log in.",
      });
    }

    const { hash, salt } = hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: hash,
      passwordSalt: salt,
    });

    const meta = clientMeta(req);
    const event = await logActivity({
      type: "signup",
      name: user.name,
      email: user.email,
      phone: user.phone,
      ...meta,
    });
    const notified = await notifyAdminLogin({
      type: "signup",
      name: event.name,
      email: event.email,
      phone: event.phone,
      ip: event.ip,
      createdAt: event.createdAt,
    });
    if (notified.delivered) {
      await Activity.findByIdAndUpdate(event._id, { notifiedAdmin: true });
    }

    if (authRequireOtp()) {
      return issueOtpAndRespond(
        res,
        user,
        "Account created. OTP sent to your email.",
        "Account created. Enter the OTP to unlock projects.",
      );
    }

    return issueAccessSession(
      res,
      user,
      "Account created successfully. You are signed in for 1 hour.",
    );
  } catch (err) {
    safeLogError("signup", err);
    return res.status(500).json({ error: "Signup failed." });
  }
});

router.post("/login", loginLimiter, requireTrustedOrigin, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found. Please sign up first.",
      });
    }
    if (!verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      return res.status(401).json({
        error: "Incorrect password. Please try again.",
      });
    }

    const meta = clientMeta(req);
    const event = await logActivity({
      type: "login",
      name: user.name,
      email: user.email,
      phone: user.phone,
      ...meta,
    });
    const notified = await notifyAdminLogin({
      type: "login",
      name: event.name,
      email: event.email,
      phone: event.phone,
      ip: event.ip,
      createdAt: event.createdAt,
    });
    if (notified.delivered) {
      await Activity.findByIdAndUpdate(event._id, { notifiedAdmin: true });
    }

    if (authRequireOtp()) {
      return issueOtpAndRespond(
        res,
        user,
        "OTP sent to your email.",
        "Enter the OTP to unlock projects.",
      );
    }

    return issueAccessSession(
      res,
      user,
      "Login successful. Your session stays active for 1 hour.",
    );
  } catch (err) {
    safeLogError("login", err);
    return res.status(500).json({ error: "Login failed." });
  }
});

router.post("/logout", requireTrustedOrigin, (_req, res) => {
  clearSessionCookie(res);
  return res.json({ ok: true });
});

router.get("/session", (req, res) => {
  const session = readSession(req);
  if (!session) {
    return res.json({ authenticated: false, projectsAccess: false });
  }
  return res.json({
    authenticated: true,
    projectsAccess: Boolean(session.projectsAccess),
    user: {
      id: session.userId,
      name: session.name,
      email: session.email,
    },
  });
});

router.post("/team-unlock", privilegedLimiter, requireTrustedOrigin, (req, res) => {
  const expected = (process.env.PROJECTS_TEAM_CODE || "tasmafive").trim();
  const given = String(req.body?.passcode || "").trim();
  if (!given || !safeEqual(given, expected)) {
    return res.status(401).json({ error: "Invalid team access code." });
  }
  const token = createSessionToken({
    userId: "team-admin",
    email: "team@tasmafivesolutions.com",
    name: "TasmaFive Team",
    projectsAccess: true,
  });
  setSessionCookie(res, token);
  return res.json({
    ok: true,
    access: true,
    user: {
      id: "team-admin",
      name: "TasmaFive Team",
      email: "team@tasmafivesolutions.com",
    },
    message: "Team access unlocked.",
  });
});

router.post("/admin-login", privilegedLimiter, requireTrustedOrigin, async (req, res) => {
  try {
    const expectedEmail = (
      process.env.PROJECTS_ADMIN_EMAIL || "admin@tasmafivesolutions.com"
    )
      .trim()
      .toLowerCase();
    const expectedPassword = (
      process.env.PROJECTS_ADMIN_PASSWORD || "Admin@TasmaFive"
    ).trim();

    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "").trim();

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Admin email and password are required." });
    }
    if (!safeEqual(email, expectedEmail) || !safeEqual(password, expectedPassword)) {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    const token = createSessionToken({
      userId: "team-admin",
      email: expectedEmail,
      name: "Admin",
      projectsAccess: true,
    });
    setSessionCookie(res, token);

    const meta = clientMeta(req);
    const event = await logActivity({
      type: "admin_login",
      name: "Admin",
      email: expectedEmail,
      ...meta,
    });
    const notified = await notifyAdminLogin({
      type: "admin_login",
      name: event.name,
      email: event.email,
      ip: event.ip,
      createdAt: event.createdAt,
    });
    if (notified.delivered) {
      await Activity.findByIdAndUpdate(event._id, { notifiedAdmin: true });
    }

    return res.json({
      ok: true,
      access: true,
      user: { id: "team-admin", name: "Admin", email: expectedEmail },
      message: "Admin access granted.",
    });
  } catch (err) {
    safeLogError("admin-login", err);
    return res.status(500).json({ error: "Admin login failed." });
  }
});

router.post("/otp/send", otpSendLimiter, requireTrustedOrigin, async (req, res) => {
  try {
    const session = readSession(req);
    const email = normalizeEmail(req.body?.email || session?.email);
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: true, message: "If the account exists, a new OTP will be sent." });

    const code = generateOtp();
    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      codeHash: hashOtp(code),
      expiresAt: Date.now() + 10 * 60 * 1000,
      purpose: "projects-access",
      attempts: 0,
    });

    const delivered = await sendOtpEmail({
      to: user.email,
      name: user.name,
      code,
    });
    const allowDemo = !delivered.delivered && delivered.demo && demoOtpEnabled();
    if (!delivered.delivered && !allowDemo) {
      await Otp.deleteMany({ email });
      return res.status(503).json({
        error: "Verification email is temporarily unavailable. Please try again later.",
      });
    }
    const body = {
      ok: true,
      message: delivered.delivered
        ? "A new OTP has been sent to your email."
        : "A new OTP has been generated.",
    };
    if (allowDemo) body.demoOtp = code;
    return res.json(body);
  } catch (err) {
    safeLogError("otp-send", err);
    return res.status(500).json({ error: "Could not send OTP." });
  }
});

router.post("/otp/verify", otpVerifyLimiter, requireTrustedOrigin, async (req, res) => {
  try {
    const session = readSession(req);
    const email = normalizeEmail(req.body?.email || session?.email);
    const code = String(req.body?.code || "").trim();

    if (!email || !/^\d{6}$/.test(code)) {
      return res
        .status(400)
        .json({ error: "Enter the 6-digit OTP sent to your email." });
    }

    const otp = await Otp.findOne({ email });
    if (!otp) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new code." });
    }
    if (otp.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new code." });
    }
    if (otp.attempts >= 5) {
      await Otp.deleteMany({ email });
      return res
        .status(400)
        .json({ error: "Too many attempts. Please request a new OTP." });
    }

    otp.attempts += 1;
    await otp.save();

    if (otp.codeHash !== hashOtp(code)) {
      return res
        .status(400)
        .json({ error: "Invalid OTP. Please check and try again." });
    }

    await Otp.deleteMany({ email });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Account not found." });
    }

    const token = createSessionToken({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      projectsAccess: true,
    });
    setSessionCookie(res, token);

    const meta = clientMeta(req);
    const event = await logActivity({
      type: "otp_verified",
      name: user.name,
      email: user.email,
      phone: user.phone,
      ...meta,
    });
    const notified = await notifyAdminLogin({
      type: "otp_verified",
      name: event.name,
      email: event.email,
      phone: event.phone,
      ip: event.ip,
      createdAt: event.createdAt,
    });
    if (notified.delivered) {
      await Activity.findByIdAndUpdate(event._id, { notifiedAdmin: true });
    }

    return res.json({
      ok: true,
      access: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
      },
      message: "Verified. You can now view our projects.",
    });
  } catch (err) {
    safeLogError("otp-verify", err);
    return res.status(500).json({ error: "Verification failed." });
  }
});

router.delete("/account", privilegedLimiter, requireTrustedOrigin, async (req, res) => {
  try {
    const session = readSession(req);
    if (!session?.userId || session.userId === "team-admin") {
      return res.status(401).json({ error: "Account authentication required." });
    }
    const password = String(req.body?.password || "");
    const user = await User.findById(session.userId);
    if (
      !user ||
      !password ||
      !verifyPassword(password, user.passwordHash, user.passwordSalt)
    ) {
      return res.status(401).json({ error: "Password confirmation failed." });
    }

    const anonymousId = randomId(16);
    await Payment.updateMany(
      { ownerUserId: user._id },
      {
        $set: {
          "customer.name": "Deleted account",
          "customer.email": `deleted-${anonymousId}@invalid.local`,
          "customer.phone": "",
          "metadata.accountDeleted": true,
        },
      },
    );
    await Promise.all([
      Otp.deleteMany({ email: user.email }),
      Activity.deleteMany({ email: user.email }),
    ]);
    await User.deleteOne({ _id: user._id });
    clearSessionCookie(res);
    return res.json({ ok: true });
  } catch (err) {
    safeLogError("account-delete", err);
    return res.status(500).json({ error: "Account deletion failed." });
  }
});

router.get("/activity", async (req, res) => {
  const session = readSession(req);
  if (
    !session?.projectsAccess ||
    session.userId !== "team-admin"
  ) {
    return res.status(401).json({ error: "Admin access required." });
  }
  const events = await Activity.find().sort({ createdAt: -1 }).limit(100).lean();
  return res.json({
    ok: true,
    events: events.map((e) => ({
      id: String(e._id),
      type: e.type,
      name: e.name,
      email: e.email,
      phone: e.phone,
      ip: e.ip,
      userAgent: e.userAgent,
      createdAt: e.createdAt,
      notifiedAdmin: e.notifiedAdmin,
    })),
  });
});

export default router;
