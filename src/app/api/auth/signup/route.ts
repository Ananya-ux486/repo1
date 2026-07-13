import { NextResponse } from "next/server";
import { createUser, createOtp, normalizeEmail, publicUser } from "@/lib/auth/store";
import { sendOtpEmail, notifyAdminLogin } from "@/lib/auth/mail";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { clientMeta, logLoginActivity, markActivityNotified } from "@/lib/auth/activity";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    };

    const name = body.name?.trim() || "";
    const email = normalizeEmail(body.email || "");
    const phone = body.phone?.trim() || "";
    const password = body.password || "";
    const meta = clientMeta(req);

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!/^[+\d][\d\s-]{8,15}$/.test(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const user = createUser({ name, email, phone, password });
    const code = createOtp(email);
    const mail = await sendOtpEmail({ to: email, name, code });

    const event = logLoginActivity({
      type: "signup",
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
        ? "Account created. OTP sent to your email."
        : "Account created. Enter the OTP to unlock projects.",
      demoOtp: mail.demo ? code : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
