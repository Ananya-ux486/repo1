import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { randomBytes } from "crypto";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const ACTIVITY_PATH = path.join(DATA_DIR, "login-activity.json");

export type LoginActivity = {
  id: string;
  type: "signup" | "login" | "otp_verified" | "admin_login";
  name: string;
  email: string;
  phone?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  notifiedAdmin: boolean;
};

type ActivityStore = {
  events: LoginActivity[];
};

function emptyStore(): ActivityStore {
  return { events: [] };
}

function readStore(): ActivityStore {
  try {
    if (!existsSync(ACTIVITY_PATH)) return emptyStore();
    const parsed = JSON.parse(readFileSync(ACTIVITY_PATH, "utf8")) as ActivityStore;
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: ActivityStore) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(ACTIVITY_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function logLoginActivity(
  input: Omit<LoginActivity, "id" | "createdAt" | "notifiedAdmin"> & {
    notifiedAdmin?: boolean;
  },
): LoginActivity {
  const store = readStore();
  const event: LoginActivity = {
    id: randomBytes(8).toString("hex"),
    type: input.type,
    name: input.name,
    email: input.email,
    phone: input.phone,
    ip: input.ip,
    userAgent: input.userAgent,
    createdAt: new Date().toISOString(),
    notifiedAdmin: Boolean(input.notifiedAdmin),
  };

  store.events.unshift(event);
  // Keep last 500 events
  store.events = store.events.slice(0, 500);
  writeStore(store);
  return event;
}

export function listLoginActivity(limit = 100): LoginActivity[] {
  return readStore().events.slice(0, limit);
}

export function markActivityNotified(id: string) {
  const store = readStore();
  const event = store.events.find((e) => e.id === id);
  if (!event) return;
  event.notifiedAdmin = true;
  writeStore(store);
}

export function clientMeta(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  return { ip, userAgent };
}
