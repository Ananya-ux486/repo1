import { NextResponse } from "next/server";
import {
  createOtp,
  findUserByEmail,
  normalizeEmail,
  publicUser,
  verifyPassword,
} from "@/lib/auth/store";
import { sendOtpEmail, notifyAdminLogin } from "@/lib/auth/mail";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { clientMeta, logLoginActivity, markActivityNotified } from "@/lib/auth/activity";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = normalizeEmail(body.email || "");
    const password = body.password || "";
    const meta = clientMeta(req);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const code = createOtp(email);
    const mail = await sendOtpEmail({ to: email, name: user.name, code });

    const event = logLoginActivity({
      type: "login",
      name: user.name,
      email: user.email,
      phone: user.phone,
      ...meta,
    });
    const notified = await notifyAdminLogin({
      type: event.type,
      name: event.name,
      email: event.email,
      phone: event.phone,
      ip: event.ip,
      createdAt: event.createdAt,
    });
    if (notified.delivered) markActivityNotified(event.id);

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      projectsAccess: false,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: publicUser(user),
      otpRequired: true,
      message: mail.delivered
        ? "OTP sent to your email."
        : "Enter the OTP to unlock projects.",
      demoOtp: mail.demo ? code : undefined,
    });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
