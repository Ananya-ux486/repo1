import { NextResponse } from "next/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "contact-messages.json");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, string>;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const reason = (body.reason || "").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !message || !reason) {
      return NextResponse.json(
        { error: "Name, email, reason, and message are required." },
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
      phone,
      reason,
      message,
      createdAt: new Date().toISOString(),
    });
    writeFileSync(FILE, JSON.stringify(list.slice(0, 200), null, 2), "utf8");
    console.info(`[contact] ${name} <${email}> · ${reason}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save message." }, { status: 500 });
  }
}
