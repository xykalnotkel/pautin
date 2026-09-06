import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { socialEnabled, authUrl } from "@/lib/social";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!socialEnabled("google"))
    return NextResponse.json({ error: "Login google belum tersedia." }, { status: 404 });
  const state = randomBytes(16).toString("base64url");
  const store = await cookies();
  store.set("pt_oauth", state, {
    httpOnly: true, sameSite: "lax", secure: !!process.env.VERCEL,
    path: "/", maxAge: 600,
  });
  return NextResponse.redirect(authUrl("google", state));
}
