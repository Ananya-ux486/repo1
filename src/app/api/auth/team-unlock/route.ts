import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

/**
 * Team / admin unlock — skip visitor signup for TasmaFive staff.
 * Set PROJECTS_TEAM_CODE in .env.local (default for local: tasmafive)
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { passcode?: string };
    const expected = (process.env.PROJECTS_TEAM_CODE || "tasmafive").trim();
    const given = (body.passcode || "").trim();

    if (!given || given !== expected) {
      return NextResponse.json(
        { error: "Invalid team access code." },
        { status: 401 },
      );
    }

    const token = createSessionToken({
      userId: "team-admin",
      email: "team@tasmafivesolutions.com",
      name: "TasmaFive Team",
      projectsAccess: true,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      access: true,
      user: {
        id: "team-admin",
        name: "TasmaFive Team",
        email: "team@tasmafivesolutions.com",
      },
      message: "Team access unlocked.",
    });
  } catch {
    return NextResponse.json({ error: "Unlock failed." }, { status: 500 });
  }
}
