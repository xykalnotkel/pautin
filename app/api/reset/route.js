import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth";
import { hitLimit, clientIp } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const t = String(d.t || "").trim();
  const password = String(d.password || "");
  const ip = clientIp(req);

  if (!(await hitLimit(`reset:${ip}`, 8, 300)).ok)
    return NextResponse.json({ error: "Terlalu sering. Coba lagi nanti." }, { status: 429 });

  if (!t || t.length > 200)
    return NextResponse.json({ error: "Tautan atur ulang tidak valid." }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ error: "Kata sandi minimal 8 karakter." }, { status: 400 });
  if (!/\d/.test(password))
    return NextResponse.json({ error: "Kata sandi harus mengandung minimal satu angka." }, { status: 400 });
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
    return NextResponse.json({ error: "Kata sandi harus punya huruf kecil dan besar." }, { status: 400 });

  const ok = await resetPassword(t, password);
  if (!ok)
    return NextResponse.json({ error: "Tautan atur ulang tidak valid atau sudah kedaluwarsa. Minta tautan baru." }, { status: 400 });

  return NextResponse.json({ ok: true });
}
