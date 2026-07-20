import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "auth-store.json");

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

type OtpRecord = {
  email: string;
  codeHash: string;
  expiresAt: number;
  purpose: "projects-access";
  attempts: number;
};

type AuthStore = {
  users: AuthUser[];
  otps: OtpRecord[];
};

function emptyStore(): AuthStore {
  return { users: [], otps: [] };
}

function readStore(): AuthStore {
  try {
    if (!existsSync(STORE_PATH)) return emptyStore();
    const raw = readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as AuthStore;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      otps: Array.isArray(parsed.otps) ? parsed.otps : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: AuthStore) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string, salt?: string) {
  const usedSalt = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, usedSalt, 64).toString("hex");
  return { hash, salt: usedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

export function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function findUserByEmail(email: string) {
  const store = readStore();
  return store.users.find((u) => u.email === normalizeEmail(email)) ?? null;
}

export function createUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const store = readStore();
  const email = normalizeEmail(input.email);
  if (store.users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists. Please log in.");
  }

  const { hash, salt } = hashPassword(input.password);
  const user: AuthUser = {
    id: randomBytes(12).toString("hex"),
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  writeStore(store);
  return user;
}

export function createOtp(email: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const store = readStore();
  const normalized = normalizeEmail(email);
  store.otps = store.otps.filter((o) => o.email !== normalized);
  store.otps.push({
    email: normalized,
    codeHash: hashOtp(code),
    expiresAt: Date.now() + 10 * 60 * 1000,
    purpose: "projects-access",
    attempts: 0,
  });
  writeStore(store);
  return code;
}

export function verifyOtpCode(email: string, code: string) {
  const store = readStore();
  const normalized = normalizeEmail(email);
  const record = store.otps.find((o) => o.email === normalized);
  if (!record) return { ok: false as const, error: "OTP expired. Please request a new code." };
  if (record.expiresAt < Date.now()) {
    store.otps = store.otps.filter((o) => o.email !== normalized);
    writeStore(store);
    return { ok: false as const, error: "OTP expired. Please request a new code." };
  }
  if (record.attempts >= 5) {
    store.otps = store.otps.filter((o) => o.email !== normalized);
    writeStore(store);
    return { ok: false as const, error: "Too many attempts. Please request a new OTP." };
  }

  record.attempts += 1;
  const match = record.codeHash === hashOtp(code.trim());
  if (!match) {
    writeStore(store);
    return { ok: false as const, error: "Invalid OTP. Please check and try again." };
  }

  store.otps = store.otps.filter((o) => o.email !== normalized);
  writeStore(store);
  return { ok: true as const };
}

export function publicUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}
