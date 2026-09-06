import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: "tautan tidak ditemukan" }, { status: 404 });
  try {
    await db.execute({ sql: "UPDATE links SET clicks=clicks+1 WHERE id=?", args: [Number(id)] });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
