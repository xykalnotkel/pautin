import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// /app (versi lama) → /dashboard, dengan parameter dipertahankan
export default async function OldAppPage({ searchParams }) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp || {})) {
    if (v !== undefined && v !== null && v !== "") q.set(k, Array.isArray(v) ? String(v[0]) : String(v));
  }
  const s = q.toString();
  redirect(s ? `/dashboard?${s}` : "/dashboard");
}
