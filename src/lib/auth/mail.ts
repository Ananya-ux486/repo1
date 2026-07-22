/**
 * OTP delivery — uses Resend if RESEND_API_KEY is set.
 * Otherwise falls back to demo mode (OTP returned to client for local testing).
 */

export async function sendOtpEmail(input: {
  to: string;
  name: string;
  code: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.AUTH_FROM_EMAIL?.trim() || "TasmaFive <onboarding@resend.dev>";

  if (!apiKey) {
    console.info(`[auth-otp] Demo OTP for ${input.to}: ${input.code}`);
    return { delivered: false as const, demo: true as const };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: `${input.code} is your TasmaFive verification code`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
            <h2 style="margin:0 0 12px;color:#ea580c">TasmaFive Solutions</h2>
            <p style="margin:0 0 16px">Hi ${input.name || "there"},</p>
            <p style="margin:0 0 16px">Use this one-time password to unlock our private project portfolio:</p>
            <p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:24px 0;color:#0f172a">${input.code}</p>
            <p style="margin:0 0 8px;color:#64748b;font-size:14px">This code expires in 10 minutes. Do not share it with anyone.</p>
            <p style="margin:24px 0 0;color:#94a3b8;font-size:12px">© TasmaFive Solutions</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[auth-otp] Resend failed:", text);
      return { delivered: false as const, demo: true as const };
    }

    return { delivered: true as const, demo: false as const };
  } catch (err) {
    console.error("[auth-otp] send failed:", err);
    return { delivered: false as const, demo: true as const };
  }
}

/** Notify admin when a visitor signs up / unlocks projects */
export async function notifyAdminLogin(input: {
  type: string;
  name: string;
  email: string;
  phone?: string;
  ip?: string;
  createdAt: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const adminTo =
    process.env.PROJECTS_ADMIN_NOTIFY_EMAIL?.trim() ||
    process.env.PROJECTS_ADMIN_EMAIL?.trim() ||
    "admin@tasmafivesolutions.com";
  const from =
    process.env.AUTH_FROM_EMAIL?.trim() || "TasmaFive <onboarding@resend.dev>";

  const label =
    input.type === "signup"
      ? "New signup"
      : input.type === "otp_verified"
        ? "Projects unlocked (OTP verified)"
        : input.type === "admin_login"
          ? "Admin login"
          : "Login activity";

  console.info(
    `[admin-notify] ${label}: ${input.name} <${input.email}> phone=${input.phone || "-"} ip=${input.ip || "-"} at ${input.createdAt}`,
  );

  if (!apiKey) {
    return { delivered: false as const };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [adminTo],
        subject: `[TasmaFive] ${label}: ${input.name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
            <h2 style="margin:0 0 8px;color:#ea580c">Portfolio access alert</h2>
            <p style="margin:0 0 16px;color:#64748b">${label}</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#64748b">Name</td><td style="padding:8px 0;font-weight:600">${input.name}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0;font-weight:600">${input.email}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Phone</td><td style="padding:8px 0;font-weight:600">${input.phone || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">IP</td><td style="padding:8px 0;font-weight:600">${input.ip || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Time</td><td style="padding:8px 0;font-weight:600">${input.createdAt}</td></tr>
            </table>
            <p style="margin:24px 0 0;color:#94a3b8;font-size:12px">Logged in TasmaFive projects activity database.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.error("[admin-notify] email failed:", await res.text());
      return { delivered: false as const };
    }
    return { delivered: true as const };
  } catch (err) {
    console.error("[admin-notify] failed:", err);
    return { delivered: false as const };
  }
}
