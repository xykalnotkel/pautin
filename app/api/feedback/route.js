import { NextResponse } from "next/server";
import { db, now } from "@/lib/db";
import { hitLimit, clientIp } from "@/lib/ratelimit";
import { getSessionUser } from "@/lib/auth";
import { resendConfigured, sendMail } from "@/lib/email";

export const dynamic = "force-dynamic";

const CATS = ["saran", "kritik", "masalah", "lainnya"];
const CAT_LABEL = { saran: "Saran", kritik: "Kritik", masalah: "Laporan masalah", lainnya: "Lainnya" };

export async function POST(req) {
  let d = {};
  try { d = await req.json(); } catch {}
  const ip = clientIp(req);
  if (!(await hitLimit(`feedback:${ip}`, 6, 900)).ok)
    return NextResponse.json({ error: "Terlalu banyak kiriman. Coba lagi beberapa menit lagi." }, { status: 429 });

  const category = CATS.includes(String(d.category || "")) ? String(d.category) : "saran";
  let message = String(d.message || "").trim();
  if (message.length < 10)
    return NextResponse.json({ error: "Tulis pesan minimal 10 karakter agar kami bisa memahaminya." }, { status: 400 });
  if (message.length > 2000)
    return NextResponse.json({ error: "Pesan maksimal 2000 karakter." }, { status: 400 });

  let name = String(d.name || "").trim().slice(0, 60);
  let email = String(d.email || "").trim().toLowerCase().slice(0, 120);
  if (email && !/^\S+@\S+\.\S+$/.test(email))
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });

  const url = String(d.url || "").trim().slice(0, 300);

  // lampirkan akun bila sedang masuk (opsional, token via cookie/header)
  let userId = 0;
  try {
    const me = await getSessionUser();
    if (me) {
      userId = Number(me.id);
      if (!name) name = String(me.name || me.username || "").slice(0, 60);
      if (!email) email = String(me.email || "").slice(0, 120);
    }
  } catch {}

  await db.execute({
    sql: "INSERT INTO feedback(user_id, name, email, category, message, url, created_at) VALUES(?,?,?,?,?,?,?)",
    args: [userId, name, email, category, message, url, now()],
  });

  // kabari pemilik bila email notifikasi dikonfigurasi (opsional, best-effort)
  const to = process.env.FEEDBACK_TO;
  if (resendConfigured() && to) {
    try {
      await sendMail({
        to,
        subject: `Feedback ${CAT_LABEL[category]} — ${name || "anonim"} (@${userId ? "akun" : "tamu"})`,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">
          <p><b>Kategori:</b> ${CAT_LABEL[category]}<br>
          <b>Nama:</b> ${(name || "—").replace(/[<>&"]/g, "")}<br>
          <b>Email:</b> ${email || "—"}<br>
          <b>Halaman asal:</b> ${url || "—"}</p>
          <p style="white-space:pre-wrap">${message.replace(/[<>&"]/g, "")}</p></div>`,
        text: `[${CAT_LABEL[category]}] ${name || "anonim"} (${email || "tanpa email"})\nDari: ${url || "-"}\n\n${message}`,
      });
    } catch {}
  }

  return NextResponse.json({ ok: true });
}
