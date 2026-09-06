import { NextResponse } from "next/server";
import { turnstileSiteKey } from "@/lib/turnstile";
import { availableSocials } from "@/lib/social";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    turnstileSiteKey: turnstileSiteKey(),
    social: availableSocials(),
  });
}
