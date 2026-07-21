import { Router } from "express";
import { User, Otp, Activity } from "../models/index.js";
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
} from "../utils/auth.js";
import { sendOtpEmail, notifyAdminLogin } from "../utils/mail.js";

const router = Router();

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

  const body = {
    ok: true,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    otpRequired: true,
    message: delivered.delivered ? messageDelivered : messageDemo,
  };
  if (!delivered.delivered) body.demoOtp = code;
  return res.json(body);
}

router.post("/signup", async (req, res) => {
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
    if (!/^[+\d][\d\s\-]{8,15}$/.test(phone)) {
      return res.status(400).json({ error: "Please enter a valid phone number." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "An account with this email already exists. Please log in.",
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

    return issueOtpAndRespond(
      res,
      user,
      "Account created. OTP sent to your email.",
      "Account created. Enter the OTP to unlock projects.",
    );
  } catch (err) {
    console.error("[signup]", err);
    return res.status(500).json({ error: "Signup failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      return res.status(401).json({ error: "Invalid email or password." });
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

    return issueOtpAndRespond(
      res,
      user,
      "OTP sent to your email.",
      "Enter the OTP to unlock projects.",
    );
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ error: "Login failed." });
  }
});

router.post("/logout", (_req, res) => {
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

router.post("/team-unlock", (req, res) => {
  const expected = (process.env.PROJECTS_TEAM_CODE || "tasmafive").trim();
  const given = String(req.body?.passcode || "").trim();
  if (!given || given !== expected) {
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

router.post("/admin-login", async (req, res) => {
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
    if (email !== expectedEmail || password !== expectedPassword) {
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
    console.error("[admin-login]", err);
    return res.status(500).json({ error: "Admin login failed." });
  }
});

router.post("/otp/send", async (req, res) => {
  try {
    const session = readSession(req);
    const email = normalizeEmail(req.body?.email || session?.email);
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found for this email." });
    }

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
    const body = {
      ok: true,
      message: delivered.delivered
        ? "A new OTP has been sent to your email."
        : "A new OTP has been generated.",
    };
    if (!delivered.delivered) body.demoOtp = code;
    return res.json(body);
  } catch (err) {
    console.error("[otp/send]", err);
    return res.status(500).json({ error: "Could not send OTP." });
  }
});

router.post("/otp/verify", async (req, res) => {
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
        phone: user.phone,
      },
      message: "Verified. You can now view our projects.",
    });
  } catch (err) {
    console.error("[otp/verify]", err);
    return res.status(500).json({ error: "Verification failed." });
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
