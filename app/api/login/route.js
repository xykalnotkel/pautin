import { NextResponse } from "next/server";
import { getUserByLogin, openSession } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";
import { hitLimit, clientIp } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const login = String(d.username || "").trim().toLowerCase();
  const password = String(d.password || "");
  const ip = clientIp(req);

  // Anti-bruteforce: batas percobaan per IP + per IP/akun
  if (!(await hitLimit(`login:${ip}`, 15, 60)).ok)
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi sebentar lagi." }, { status: 429 });
  if (!(await hitLimit(`login:${ip}:${login}`, 6, 60)).ok)
    return NextResponse.json({ error: "Terlalu banyak percobaan untuk akun ini. Tunggu sebentar." }, { status: 429 });

  if (!(await verifyTurnstile(d.turnstileToken, ip)))
    return NextResponse.json({ error: "Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi." }, { status: 400 });

  const u = await getUserByLogin(login, password);
  if (!u)
    return NextResponse.json({ error: "Username/email atau kata sandi salah." }, { status: 401 });

  if (!Number(u.email_verified)) {
    return NextResponse.json({
      error: "Email belum diverifikasi. Buka tautan verifikasi dari emailmu, atau kirim ulang di bawah.",
      code: "unverified",
      email: u.email,
    }, { status: 403 });
  }

  const token = await openSession(Number(u.id));
  return NextResponse.json({ ok: true, token });
}
