import { NextResponse } from "next/server";
import { availableSocials } from "@/lib/social";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    social: availableSocials(),
  });
}
