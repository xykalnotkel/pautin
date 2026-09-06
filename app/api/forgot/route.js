import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { setResetToken, siteBaseUrl, maskEmail } from "@/lib/auth";
import { hitLimit, clientIp } from "@/lib/ratelimit";
import { resendConfigured, sendMail, resetEmailHtml, resetEmailText } from "@/lib/email";

export const dynamic = "force-dynamic";

const safeOrigin = (req) => {
  try { return new URL(req.url).origin; } catch { return siteBaseUrl(); }
};

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const id = String(d.id || "").trim().toLowerCase();
  const ip = clientIp(req);

  if (!id) return NextResponse.json({ error: "Masukkan username atau email." }, { status: 400 });
  if (!(await hitLimit(`forgot:${ip}`, 8, 300)).ok)
    return NextResponse.json({ error: "Terlalu sering. Coba lagi nanti." }, { status: 429 });

  const r = await db.execute({
    sql: "SELECT id,username,name,email FROM users WHERE username=? OR (email<>'' AND email=?) LIMIT 1",
    args: [id, id],
  });
  const u = r.rows[0];

  // Anti-bruteforce: jawaban sama walau akun tidak ada (tidak membocorkan keberadaan akun)
  if (!u || !String(u.email || "").trim()) return NextResponse.json({ ok: true });

  const token = randomBytes(24).toString("base64url");
  await setResetToken(Number(u.id), token);

  const base = process.env.VERCEL ? siteBaseUrl() : safeOrigin(req);
  const link = `${base}/reset?t=${encodeURIComponent(token)}`;
  const name = u.name || u.username;

  if (!resendConfigured()) {
    return NextResponse.json({ ok: true, email: maskEmail(u.email), devLink: link });
  }
  try {
    await sendMail({
      to: u.email,
      subject: "Atur ulang kata sandi — Pautin",
      html: resetEmailHtml({ name, link }),
      text: resetEmailText({ name, link }),
    });
    return NextResponse.json({ ok: true, email: maskEmail(u.email) });
  } catch (e) {
    return NextResponse.json({ error: "Email gagal terkirim. Coba lagi sebentar." }, { status: 500 });
  }
}
