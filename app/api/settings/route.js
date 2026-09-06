import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { THEMES } from "@/lib/theme";

export const dynamic = "force-dynamic";
const RADII = { full: 1, soft: 1, sharp: 1 };

export async function PUT(req) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let d = {};
  try { d = await req.json(); } catch {}
  const theme = String(d.theme || "");
  const radius = String(d.radius || "");
  if (!THEMES[theme]) return NextResponse.json({ error: "tema tidak dikenal" }, { status: 400 });
  if (!RADII[radius]) return NextResponse.json({ error: "bentuk tidak dikenal" }, { status: 400 });
  await db.execute({ sql: "UPDATE users SET theme=?, radius=? WHERE id=?", args: [theme, radius, Number(u.id)] });
  return NextResponse.json({ ok: true });
}
