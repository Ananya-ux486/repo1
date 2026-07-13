import { NextResponse } from "next/server";
import {
  findUserByEmail,
  normalizeEmail,
  publicUser,
  verifyOtpCode,
} from "@/lib/auth/store";
import { createSessionToken, getSession, setSessionCookie } from "@/lib/auth/session";
import { clientMeta, logLoginActivity, markActivityNotified } from "@/lib/auth/activity";
import { notifyAdminLogin } from "@/lib/auth/mail";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; code?: string };
    const session = await getSession();
    const email = normalizeEmail(body.email || session?.email || "");
    const code = (body.code || "").trim();
    const meta = clientMeta(req);

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Enter the 6-digit OTP sent to your email." },
        { status: 400 },
      );
    }

    const result = verifyOtpCode(email, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      projectsAccess: true,
    });
    await setSessionCookie(token);

    const event = logLoginActivity({
      type: "otp_verified",
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

    return NextResponse.json({
      ok: true,
      access: true,
      user: publicUser(user),
      message: "Verified. You can now view our projects.",
    });
  } catch {
    return NextResponse.json({ error: "OTP verification failed." }, { status: 500 });
  }
}
