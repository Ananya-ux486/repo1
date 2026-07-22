import { isIP } from "node:net";

const DEV_AUTH_SECRET = "tasmafive-dev-auth-secret-change-me";
const DEFAULT_PROJECT_ADMIN_EMAIL = "admin@tasmafivesolutions.com";
const DEFAULT_PROJECT_ADMIN_PASSWORD = "Admin@TasmaFive";
const DEFAULT_TEAM_CODE = "tasmafive";

function value(name) {
  return String(process.env[name] || "").trim();
}

function isStrongSecret(secret, minimum = 32) {
  return secret.length >= minimum && new Set(secret).size >= 12;
}

function isPrivateIpv4(hostname) {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    parts[0] === 0
  );
}

export function isSafePublicUrl(input, { allowRelative = false } = {}) {
  const raw = String(input || "").trim();
  if (!raw) return true;
  if (allowRelative && /^\/(?!\/)/.test(raw)) {
    return !raw.includes("\\") && !raw.toLowerCase().includes("%2f%2f");
  }
  try {
    const url = new URL(raw);
    const hostname = url.hostname
      .toLowerCase()
      .replace(/\.$/, "")
      .replace(/^\[|\]$/g, "");
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      return false;
    }
    if (
      !hostname ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return false;
    }
    const ipVersion = isIP(hostname);
    if (ipVersion === 4 && isPrivateIpv4(hostname)) return false;
    if (
      ipVersion === 6 &&
      (hostname === "::1" ||
        hostname === "::" ||
        hostname.startsWith("fc") ||
        hostname.startsWith("fd") ||
        hostname.startsWith("fe8") ||
        hostname.startsWith("fe9") ||
        hostname.startsWith("fea") ||
        hostname.startsWith("feb"))
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function demoOtpEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    value("ALLOW_DEMO_OTP") === "true" &&
    !value("RESEND_API_KEY")
  );
}

export function safeLogError(context, error) {
  const code = String(error?.code || error?.name || "Error").slice(0, 80);
  console.error(`[${context}] ${code}`);
}

export function validateRuntimeConfig() {
  const production = process.env.NODE_ENV === "production";
  const errors = [];
  const mongoUri = value("MONGODB_URI");
  if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    errors.push("MONGODB_URI must be a valid MongoDB URI.");
  }
  if (production) {
    const authSecret = value("AUTH_SECRET") || value("NEXTAUTH_SECRET");
    if (!isStrongSecret(authSecret) || authSecret === DEV_AUTH_SECRET) {
      errors.push("AUTH_SECRET must be a unique, high-entropy secret of at least 32 characters.");
    }
    if (
      !value("PROJECTS_ADMIN_EMAIL") ||
      value("PROJECTS_ADMIN_EMAIL").toLowerCase() === DEFAULT_PROJECT_ADMIN_EMAIL ||
      !isStrongSecret(value("PROJECTS_ADMIN_PASSWORD"), 16) ||
      value("PROJECTS_ADMIN_PASSWORD") === DEFAULT_PROJECT_ADMIN_PASSWORD
    ) {
      errors.push("Replace the default project admin email and password.");
    }
    if (!isStrongSecret(value("PROJECTS_TEAM_CODE"), 16) || value("PROJECTS_TEAM_CODE") === DEFAULT_TEAM_CODE) {
      errors.push("PROJECTS_TEAM_CODE must be a unique secret of at least 16 characters.");
    }
    if (value("ALLOW_DEMO_OTP") === "true") {
      errors.push("ALLOW_DEMO_OTP cannot be enabled in production.");
    }
    for (const name of ["PUBLIC_SITE_URL", "API_PUBLIC_URL"]) {
      try {
        const url = new URL(value(name));
        if (
          url.protocol !== "https:" ||
          !isSafePublicUrl(url.href) ||
          url.username ||
          url.password
        ) {
          throw new Error();
        }
      } catch {
        errors.push(`${name} must be a safe public HTTPS URL in production.`);
      }
    }
    for (const name of ["ALLOWED_ORIGINS"]) {
      const origins = value(name).split(",").filter(Boolean);
      const invalid = origins.some((origin) => {
        try {
          const url = new URL(origin);
          return (
            origin === "*" ||
            url.protocol !== "https:" ||
            url.origin !== origin ||
            !isSafePublicUrl(origin)
          );
        } catch {
          return true;
        }
      });
      if (!origins.length || invalid) {
        errors.push(`${name} must contain explicit HTTPS origins only in production.`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`Unsafe server configuration:\n- ${errors.join("\n- ")}`);
  }
}
