import { NextResponse } from "next/server";
import {
  createOtp,
  findUserByEmail,
  normalizeEmail,
} from "@/lib/auth/store";
import { sendOtpEmail } from "@/lib/auth/mail";
import { getSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const session = await getSession();
    const email = normalizeEmail(body.email || session?.email || "");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }

    const code = createOtp(email);
    const mail = await sendOtpEmail({ to: email, name: user.name, code });

    return NextResponse.json({
      ok: true,
      message: mail.delivered
        ? "A new OTP has been sent to your email."
        : "A new OTP has been generated.",
      demoOtp: mail.demo ? code : undefined,
    });
  } catch {
    return NextResponse.json({ error: "Could not send OTP." }, { status: 500 });
  }
}
