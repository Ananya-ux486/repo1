import { NextResponse } from "next/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "audit-requests.json");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, string>;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const countryCode = (body.countryCode || "").trim();
    const phone = (body.phone || "").trim();
    const company = (body.company || "").trim();
    const website = (body.website || "").trim();
    const focus = (body.focus || "").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !phone || !countryCode || !focus) {
      return NextResponse.json(
        {
          error:
            "Name, email, phone with country code, and audit focus are required.",
        },
        { status: 400 },
      );
    }

    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    let list: unknown[] = [];
    try {
      if (existsSync(FILE)) list = JSON.parse(readFileSync(FILE, "utf8"));
    } catch {
      list = [];
    }
    if (!Array.isArray(list)) list = [];

    list.unshift({
      id: randomBytes(8).toString("hex"),
      name,
      email,
      countryCode,
      phone,
      fullPhone: `${countryCode} ${phone}`.trim(),
      company,
      website,
      focus,
      message,
      createdAt: new Date().toISOString(),
    });
    writeFileSync(FILE, JSON.stringify(list.slice(0, 200), null, 2), "utf8");
    console.info(`[audit] ${name} <${email}> · ${countryCode} ${phone}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not save audit request." },
      { status: 500 },
    );
  }
}
