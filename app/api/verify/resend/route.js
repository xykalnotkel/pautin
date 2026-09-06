import { NextResponse } from "next/server";
import { findUserByEmail, setVerifyToken, maskEmail } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";
import { hitLimit, clientIp } from "@/lib/ratelimit";
import { resendConfigured, sendMail, verifyEmailHtml, verifyEmailText } from "@/lib/email";
import { siteBaseUrl } from "@/lib/auth";

const safeOrigin = (req) => { try { return new URL(req.url).origin; } catch { return siteBaseUrl(); } };
import { randomBytes } from "node:crypto";
import { now } from "@/lib/db";

export const dynamic = "force-dynamic";

const COOLDOWN = 60; // detik antar pengiriman

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const email = String(d.email || "").trim().toLowerCase();
  const ip = clientIp(req);

  if (!(await hitLimit(`resend:${ip}`, 10, 300)).ok)
    return NextResponse.json({ error: "Terlalu sering. Coba lagi nanti." }, { status: 429 });
  if (!(await verifyTurnstile(d.turnstileToken, ip)))
    return NextResponse.json({ error: "Verifikasi keamanan gagal. Muat ulang halaman dan coba lagi." }, { status: 400 });

  const u = await findUserByEmail(email);
  if (!u) return NextResponse.json({ error: "Akun dengan email itu tidak ditemukan." }, { status: 404 });
  if (Number(u.email_verified)) return NextResponse.json({ ok: true, already: true });

  const wait = COOLDOWN - (now() - Number(u.vsent || 0));
  if (wait > 0)
    return NextResponse.json({ error: `Tunggu ${wait} detik sebelum kirim ulang.` }, { status: 429 });

  const token = randomBytes(24).toString("base64url");
  await setVerifyToken(Number(u.id), token);
  const base = process.env.VERCEL ? siteBaseUrl() : safeOrigin(req);
  const link = `${base}/verify?t=${encodeURIComponent(token)}`;

  if (!resendConfigured()) {
    // mode dev lokal tanpa Resend → tautan dikembalikan agar alur bisa dites
    return NextResponse.json({ ok: true, email: maskEmail(email), devLink: link });
  }
  try {
    await sendMail({
      to: email,
      subject: "Verifikasi email — Pautin",
      html: verifyEmailHtml({ name: u.name || u.username, link }),
      text: verifyEmailText({ name: u.name || u.username, link }),
    });
    return NextResponse.json({ ok: true, email: maskEmail(email) });
  } catch (e) {
    return NextResponse.json({ error: "Email gagal terkirim. Coba lagi sebentar." }, { status: 500 });
  }
}
