import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, projectsAccess: false });
  }

  return NextResponse.json({
    authenticated: true,
    projectsAccess: Boolean(session.projectsAccess),
    user: {
      id: session.userId,
      name: session.name,
      email: session.email,
    },
  });
}
