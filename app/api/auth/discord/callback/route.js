import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { socialEnabled, exchangeCode, upsertSocialUser } from "@/lib/social";
import { openSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const fail = NextResponse.redirect(new URL("/dashboard?authfail=1", req.url));
  if (!socialEnabled("discord")) return fail;
  const url = new URL(req.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const store = await cookies();
  const expect = store.get("pt_oauth")?.value;
  store.set("pt_oauth", "", { httpOnly: true, path: "/", maxAge: 0 });
  if (!expect || state !== expect || !code) return fail;
  try {
    const prof = await exchangeCode("discord", code);
    const uid = await upsertSocialUser("discord", prof);
    await openSession(uid);
    return NextResponse.redirect(new URL("/dashboard?social=1", req.url));
  } catch (e) {
    return fail;
  }
}
