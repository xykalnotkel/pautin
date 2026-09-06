import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let d = {};
  try { d = await req.json(); } catch {}
  const ids = Array.isArray(d.ids) ? d.ids : [];
  const mine = await db.execute({ sql: "SELECT id FROM links WHERE user_id=?", args: [Number(u.id)] });
  const mineSet = new Set(mine.rows.map((r) => Number(r.id)));
  const tx = [];
  let p = 0;
  for (const raw of ids) {
    const lid = Number(raw);
    if (Number.isInteger(lid) && mineSet.has(lid)) {
      tx.push({ sql: "UPDATE links SET pos=? WHERE id=? AND user_id=?", args: [p++, lid, Number(u.id)] });
    }
  }
  for (const t of tx) await db.execute(t);
  return NextResponse.json({ ok: true });
}
