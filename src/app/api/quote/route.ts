import { NextResponse } from "next/server";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "quote-requests.json");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, string>;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const projectType = (body.projectType || "").trim();
    const budget = (body.budget || "").trim();
    const details = (body.details || "").trim();

    if (!name || !email || !phone || !projectType || !budget || !details) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
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
      projectType,
      budget,
      details,
      createdAt: new Date().toISOString(),
    });
    writeFileSync(FILE, JSON.stringify(list.slice(0, 200), null, 2), "utf8");
    console.info(`[quote] ${name} <${email}> · ${projectType} · ${budget}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save quote request." }, { status: 500 });
  }
}
