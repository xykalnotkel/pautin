import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATIC = ["", "/about", "/legal/terms", "/legal/privacy", "/legal/license"];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pautin.xyc.my.id";
  const entries = STATIC.map((p) => ({
    url: base + p,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.6,
  }));
  try {
    const users = await db.execute({
      sql: "SELECT u.username, MAX(l.created_at) AS lm FROM users u LEFT JOIN links l ON l.user_id=u.id GROUP BY u.id",
      args: [],
    });
    for (const row of users.rows) {
      entries.push({
        url: `${base}/u/${row.username}`,
        lastModified: row.lm ? new Date(Number(row.lm) * 1000) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {}
  return entries;
}
