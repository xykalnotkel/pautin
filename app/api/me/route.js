import { NextResponse } from "next/server";
import { getSessionUser, getMePayload } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const payload = await getMePayload(Number(u.id));
  return NextResponse.json(payload);
}
