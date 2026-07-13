import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { clientMeta, logLoginActivity, markActivityNotified } from "@/lib/auth/activity";
import { notifyAdminLogin } from "@/lib/auth/mail";

/**
 * Admin login for TasmaFive staff.
 * Defaults (override in .env.local):
 *   PROJECTS_ADMIN_EMAIL=admin@tasmafivesolutions.com
 *   PROJECTS_ADMIN_PASSWORD=Admin@TasmaFive
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
    };
    const meta = clientMeta(req);

    const expectedEmail = (
      process.env.PROJECTS_ADMIN_EMAIL || "admin@tasmafivesolutions.com"
    )
      .trim()
      .toLowerCase();
    const expectedPassword = (
      process.env.PROJECTS_ADMIN_PASSWORD || "Admin@TasmaFive"
    ).trim();

    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Admin email and password are required." },
        { status: 400 },
      );
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 },
      );
    }

    const token = createSessionToken({
      userId: "team-admin",
      email: expectedEmail,
      name: "Admin",
      projectsAccess: true,
    });
    await setSessionCookie(token);

    const event = logLoginActivity({
      type: "admin_login",
      name: "Admin",
      email: expectedEmail,
      ...meta,
    });
    const notified = await notifyAdminLogin({
      type: event.type,
      name: event.name,
      email: event.email,
      ip: event.ip,
      createdAt: event.createdAt,
    });
    if (notified.delivered) markActivityNotified(event.id);

    return NextResponse.json({
      ok: true,
      access: true,
      user: {
        id: "team-admin",
        name: "Admin",
        email: expectedEmail,
      },
      message: "Admin access granted.",
    });
  } catch {
    return NextResponse.json({ error: "Admin login failed." }, { status: 500 });
  }
}
