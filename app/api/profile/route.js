import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, cleanUrl } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let d = {};
  try { d = await req.json(); } catch {}
  const name = String(d.name || "").trim().slice(0, 60) || u.name;
  const bio = String(d.bio || "").trim().slice(0, 200);
  let av = cleanUrl(d.avatar || "").slice(0, 300);
  if (av && !/^https?:\/\//.test(av) && !av.startsWith("mailto:")) av = "";
  await db.execute({ sql: "UPDATE users SET name=?, bio=?, avatar=? WHERE id=?", args: [name, bio, av, Number(u.id)] });
  return NextResponse.json({ ok: true });
}
