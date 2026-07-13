import { NextResponse } from "next/server";
import { listLoginActivity } from "@/lib/auth/activity";
import { getSession } from "@/lib/auth/session";

/** Admin-only: recent portfolio login / signup activity */
export async function GET() {
  const session = await getSession();
  if (!session?.projectsAccess || session.userId !== "team-admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const events = listLoginActivity(100);
  return NextResponse.json({ ok: true, events });
}
