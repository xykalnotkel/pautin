import { NextResponse } from "next/server";
import { turnstileSiteKey } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ turnstileSiteKey: turnstileSiteKey() });
}
