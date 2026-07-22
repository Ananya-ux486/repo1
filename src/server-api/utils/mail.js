import { demoOtpEnabled } from "./security.js";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendOtpEmail({ to, name, code }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.AUTH_FROM_EMAIL?.trim() || "TasmaFive <onboarding@resend.dev>";

  if (!apiKey) {
    return { delivered: false, demo: demoOtpEnabled() };
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
        to: [to],
        subject: `${code} is your TasmaFive verification code`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
            <h2 style="margin:0 0 12px;color:#ea580c">TasmaFive Solutions</h2>
            <p style="margin:0 0 16px">Hi ${escapeHtml(name || "there")},</p>
            <p style="margin:0 0 16px">Use this one-time password to unlock our private project portfolio:</p>
            <p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:24px 0;color:#0f172a">${code}</p>
            <p style="margin:0 0 8px;color:#64748b;font-size:14px">This code expires in 10 minutes.</p>
          </div>
        `,
      }),
    });
    if (!res.ok) return { delivered: false, demo: false };
    return { delivered: true, demo: false };
  } catch {
    return { delivered: false, demo: false };
  }
}

export async function notifyAdminLogin(input) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { delivered: false };

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
        subject: `[TasmaFive] ${label}: ${String(input.name || "").replace(/[\r\n]/g, " ").slice(0, 120)}`,
        html: `<p>${escapeHtml(label)}</p><p>${[
          input.name,
          input.email,
          input.phone || "—",
          input.ip || "—",
          input.createdAt,
        ]
          .map(escapeHtml)
          .join(" · ")}</p>`,
      }),
    });
    return { delivered: res.ok };
  } catch {
    return { delivered: false };
  }
}
