import { NextResponse } from "next/server";
import { USERNAME_RE, RESERVED, db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const u = (req.nextUrl.searchParams.get("u") || "").trim().toLowerCase();
  let ok = USERNAME_RE.test(u) && !RESERVED.has(u);
  if (ok) {
    const r = await db.execute({ sql: "SELECT 1 FROM users WHERE username=?", args: [u] });
    ok = !r.rows[0];
  }
  return NextResponse.json({ ok });
}
