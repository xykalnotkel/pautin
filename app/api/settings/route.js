import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { THEMES, RADII, AV_SHAPES, FONT_STACKS, GRID_MODES } from "@/lib/theme";

export const dynamic = "force-dynamic";

const FIELDS = [
  ["theme", THEMES],
  ["radius", RADII],
  ["grid", GRID_MODES],
  ["av", AV_SHAPES],
  ["font", FONT_STACKS],
];

const ACCENT_RE = /^#[0-9a-fA-F]{6}$/;

export async function PUT(req) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let d = {};
  try { d = await req.json(); } catch {}

  const sets = [];
  const args = [];
  for (const [key, allowed] of FIELDS) {
    if (d[key] === undefined) continue;
    const val = String(d[key]);
    if (!allowed[val]) return NextResponse.json({ error: key + " tidak dikenal" }, { status: 400 });
    sets.push(`${key}=?`);
    args.push(val);
  }
  if (d.accent !== undefined) {
    const val = String(d.accent).trim();
    if (val !== "" && !ACCENT_RE.test(val))
      return NextResponse.json({ error: "warna aksen tidak valid" }, { status: 400 });
    sets.push("accent=?");
    args.push(val);
  }
  if (!sets.length) return NextResponse.json({ ok: true });
  await db.execute({
    sql: `UPDATE users SET ${sets.join(", ")} WHERE id=?`,
    args: [...args, Number(u.id)],
  });
  return NextResponse.json({ ok: true });
}
