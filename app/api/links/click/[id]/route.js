import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: "tautan tidak ditemukan" }, { status: 404 });
  try {
    await db.execute({ sql: "UPDATE links SET clicks=clicks+1 WHERE id=?", args: [Number(id)] });
    await db.execute({ sql: "INSERT INTO daily_stats(user_id,day,clicks) SELECT user_id,date('now'),1 FROM links WHERE id=? ON CONFLICT(user_id,day) DO UPDATE SET clicks=clicks+1", args: [Number(id)] });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
