import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, cleanUrl, badUrl, kindOf } from "@/lib/db";

export const dynamic = "force-dynamic";

async function ownLink(id, uid) {
  const r = await db.execute({ sql: "SELECT * FROM links WHERE id=? AND user_id=?", args: [id, uid] });
  return r.rows[0] || null;
}

export async function PUT(req, { params }) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const link = await ownLink(Number(id), Number(u.id));
  if (!link) return NextResponse.json({ error: "tautan tidak ditemukan" }, { status: 404 });

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
  await db.execute({
    sql: "UPDATE links SET title=?, url=?, emoji=?, kind=? WHERE id=?",
    args: [title, url, emoji, kindOf(url), Number(id)],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const link = await ownLink(Number(id), Number(u.id));
  if (!link) return NextResponse.json({ error: "tautan tidak ditemukan" }, { status: 404 });
  await db.execute({ sql: "DELETE FROM links WHERE id=?", args: [Number(id)] });
  return NextResponse.json({ ok: true });
}
