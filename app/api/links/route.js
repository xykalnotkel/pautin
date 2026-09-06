import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, cleanUrl, badUrl, kindOf, now } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let d = {};
  try { d = await req.json(); } catch {}

  let title = String(d.title || "").trim().slice(0, 90);
  const url = cleanUrl(d.url).slice(0, 500);
  const emoji = String(d.emoji || "").trim().slice(0, 8);

  if (!url) return NextResponse.json({ error: "URL wajib diisi." }, { status: 400 });
  if (badUrl(url)) return NextResponse.json({ error: "URL tidak valid. Contoh: https://instagram.com/namamu" }, { status: 400 });
  if (!title) {
    try { title = new URL(url).hostname.replace(/^www\./, ""); } catch { title = url; }
  }
  const kind = kindOf(url);
  const nxt = await db.execute({ sql: "SELECT COALESCE(MAX(pos)+1,0) p FROM links WHERE user_id=?", args: [Number(u.id)] });
  const pos = Number(nxt.rows[0].p);
  const r = await db.execute({
    sql: "INSERT INTO links(user_id,title,url,emoji,kind,pos,clicks,created_at) VALUES(?,?,?,?,?,?,0,?)",
    args: [Number(u.id), title, url, emoji, kind, pos, now()],
  });
  return NextResponse.json({ ok: true, id: Number(r.lastInsertRowid) }, { status: 201 });
}
