import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const uid = Number(u.id);

  const r = await db.execute({
    sql: "SELECT day, SUM(views) v, SUM(clicks) c FROM daily_stats WHERE user_id=? AND day>=date('now','-29 days') GROUP BY day ORDER BY day",
    args: [uid],
  });

  const m = {};
  (r.rows || []).forEach((x) => { m[x.day] = { views: Number(x.v), clicks: Number(x.c) }; });

  // 30 hari terakhir (termasuk hari tanpa data = 0)
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const e = m[key] || { views: 0, clicks: 0 };
    days.push({ day: key.slice(5), views: e.views, clicks: e.clicks });
  }

  const tot = await db.execute({
    sql: "SELECT (SELECT views FROM users WHERE id=?) views, (SELECT COALESCE(SUM(clicks),0) FROM links WHERE user_id=?) clicks",
    args: [uid, uid],
  });
  const row = tot.rows[0] || { views: 0, clicks: 0 };

  const top = await db.execute({
    sql: "SELECT id,title,clicks FROM links WHERE user_id=? AND clicks>0 ORDER BY clicks DESC LIMIT 5",
    args: [uid],
  });

  return NextResponse.json({
    days,
    totalViews: Number(row.views),
    totalClicks: Number(row.clicks),
    top: (top.rows || []).map((l) => ({ id: Number(l.id), title: l.title, clicks: Number(l.clicks) })),
  });
}
