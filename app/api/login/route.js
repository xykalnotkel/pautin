import { NextResponse } from "next/server";
import { getUserByLogin, openSession } from "@/lib/auth";
import { verifyTurnstile, clientIp } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const username = String(d.username || "").trim().toLowerCase();
  const password = String(d.password || "");

  if (!(await verifyTurnstile(d.turnstileToken, clientIp(req))))
    return NextResponse.json({ error: "Verifikasi keamanan gagal. Muat ulang halaman & coba lagi." }, { status: 400 });

  const u = await getUserByLogin(username, password);
  if (!u)
    return NextResponse.json({ error: "Username atau kata sandi salah." }, { status: 401 });
  const token = await openSession(Number(u.id));
  return NextResponse.json({ ok: true, token });
}
