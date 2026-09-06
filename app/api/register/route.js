import { NextResponse } from "next/server";
import { createUser, openSession } from "@/lib/auth";
import { USERNAME_RE, RESERVED, db } from "@/lib/db";
import { verifyTurnstile, clientIp } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const username = String(d.username || "").trim().toLowerCase();
  const name = String(d.name || "").trim().slice(0, 60);
  const password = String(d.password || "");

  if (!(await verifyTurnstile(d.turnstileToken, clientIp(req))))
    return NextResponse.json({ error: "Verifikasi keamanan gagal. Muat ulang halaman & coba lagi." }, { status: 400 });

  if (!USERNAME_RE.test(username))
    return NextResponse.json({ error: "Username 3–20 huruf/angka kecil (a–z, 0–9), tanpa spasi." }, { status: 400 });
  if (RESERVED.has(username))
    return NextResponse.json({ error: "Username itu sudah dipakai sistem." }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: "Kata sandi minimal 6 karakter." }, { status: 400 });

  const dup = await db.execute({ sql: "SELECT 1 FROM users WHERE username=?", args: [username] });
  if (dup.rows[0])
    return NextResponse.json({ error: "Username sudah dipakai. Coba yang lain." }, { status: 409 });

  try {
    const uid = await createUser(username, name, password);
    const token = await openSession(uid);
    return NextResponse.json({ ok: true, token });
  } catch (e) {
    return NextResponse.json({ error: "Gagal mendaftar, coba lagi." }, { status: 500 });
  }
}
