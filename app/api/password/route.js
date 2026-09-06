import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, verifyPassword, hashPassword } from "@/lib/db";
import { hitLimit, clientIp } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const ip = clientIp(req);
  if (!(await hitLimit(`pass:${ip}`, 6, 300)).ok)
    return NextResponse.json({ error: "Terlalu sering. Coba lagi nanti." }, { status: 429 });

  let d = {};
  try { d = await req.json(); } catch {}
  const old = String(d.old || "");
  const password = String(d.password || "");

  if (password.length < 8)
    return NextResponse.json({ error: "Kata sandi minimal 8 karakter." }, { status: 400 });
  if (!/\d/.test(password))
    return NextResponse.json({ error: "Kata sandi harus mengandung minimal satu angka." }, { status: 400 });
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
    return NextResponse.json({ error: "Kata sandi harus punya huruf kecil dan besar." }, { status: 400 });

  const r = await db.execute({ sql: "SELECT salt,pass FROM users WHERE id=?", args: [Number(u.id)] });
  const row = r.rows[0];
  if (!row) return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });

  const stored = String(row.salt || "") + ":" + String(row.pass || "");
  const hasPass = !!(row.salt && row.pass);
  if (hasPass && !verifyPassword(old, stored))
    return NextResponse.json({ error: "Kata sandi lama salah." }, { status: 400 });

  const [salt, pass] = hashPassword(password).split(":");
  await db.execute({ sql: "UPDATE users SET salt=?, pass=? WHERE id=?", args: [salt, pass, Number(u.id)] });
  return NextResponse.json({ ok: true });
}
