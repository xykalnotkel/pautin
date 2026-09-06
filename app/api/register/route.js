import { NextResponse } from "next/server";
import { createUser, setVerifyToken } from "@/lib/auth";
import { USERNAME_RE, RESERVED, db } from "@/lib/db";
import { verifyTurnstile } from "@/lib/turnstile";
import { hitLimit, clientIp } from "@/lib/ratelimit";
import { siteBaseUrl } from "@/lib/auth";
import { resendConfigured, sendMail, verifyEmailHtml, verifyEmailText } from "@/lib/email";
import { randomBytes } from "node:crypto";

const safeOrigin = (req) => { try { return new URL(req.url).origin; } catch { return siteBaseUrl(); } };

export const dynamic = "force-dynamic";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const username = String(d.username || "").trim().toLowerCase();
  const name = String(d.name || "").trim().slice(0, 60);
  const email = String(d.email || "").trim().toLowerCase();
  const password = String(d.password || "");
  const ip = clientIp(req);

  // Anti-spam pendaftaran
  if (!(await hitLimit(`register:${ip}`, 8, 600)).ok)
    return NextResponse.json({ error: "Terlalu banyak pendaftaran dari perangkat ini. Tunggu sebentar." }, { status: 429 });

  if (!(await verifyTurnstile(d.turnstileToken, ip)))
    return NextResponse.json({ error: "Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi." }, { status: 400 });

  if (!USERNAME_RE.test(username))
    return NextResponse.json({ error: "Username 3–20 huruf/angka kecil (a–z, 0–9), tanpa spasi." }, { status: 400 });
  if (RESERVED.has(username))
    return NextResponse.json({ error: "Username itu sudah dipakai sistem." }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: "Kata sandi minimal 6 karakter." }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 120)
    return NextResponse.json({ error: "Alamat email tidak valid." }, { status: 400 });

  const dup = await db.execute({ sql: "SELECT 1 FROM users WHERE username=?", args: [username] });
  if (dup.rows[0])
    return NextResponse.json({ error: "Username sudah dipakai. Coba yang lain." }, { status: 409 });
  const dupE = await db.execute({ sql: "SELECT 1 FROM users WHERE email=? AND email<>''", args: [email] });
  if (dupE.rows[0])
    return NextResponse.json({ error: "Email sudah terdaftar. Silakan masuk atau gunakan email lain." }, { status: 409 });

  const token = randomBytes(24).toString("base64url");
  let uid;
  try {
    uid = await createUser(username, name, password, email);
  } catch (e) {
    if (String(e.message).includes("UNIQUE"))
      return NextResponse.json({ error: "Username atau email sudah dipakai." }, { status: 409 });
    return NextResponse.json({ error: "Gagal mendaftar, coba lagi." }, { status: 500 });
  }
  await setVerifyToken(uid, token);

  const base = process.env.VERCEL ? siteBaseUrl() : safeOrigin(req);
  const link = `${base}/verify?t=${encodeURIComponent(token)}`;
  const dev = !resendConfigured();
  // di luar Vercel (dev lokal) tautan ikut dikembalikan agar QA tetap bisa lanjut
  const showLink = dev || !process.env.VERCEL;
  let mailOk = false, mailErr = "";
  if (!dev) {
    try {
      await sendMail({
        to: email,
        subject: "Verifikasi email — Pautin",
        html: verifyEmailHtml({ name: name || username, link }),
        text: verifyEmailText({ name: name || username, link }),
      });
      mailOk = true;
    } catch (e) {
      mailErr = String(e.message || e).slice(0, 120);
    }
  }

  return NextResponse.json({
    ok: true,
    needVerify: true,
    email: email,
    devLink: showLink ? link : undefined,
    mailSent: mailOk,
    mailErr: dev ? undefined : mailErr || undefined,
  });
}


