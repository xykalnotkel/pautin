// Rate limiting ringan (anti-bruteforce / anti-spam) di atas D1/SQLite.
// Gratis & native: tidak butuh layanan eksternal.
import { db, now } from "./db";

const TABLE = `CREATE TABLE IF NOT EXISTS rate_limits(
  key TEXT PRIMARY KEY,
  n INTEGER NOT NULL DEFAULT 0,
  win INTEGER NOT NULL
)`;

let ensured = false;
async function ensure() {
  if (ensured) return;
  await db.execute({ sql: TABLE, args: [] });
  ensured = true;
}

/**
 * @param key  mis. `login:1.2.3.4` / `register:1.2.3.4`
 * @param max  jumlah maksimum dalam jendela
 * @param winSec  jendela detik
 * @returns {Promise<{ok:boolean, remaining:number}>}
 */
export async function hitLimit(key, max, winSec = 60) {
  await ensure();
  const t = now();
  const cur = t - (t % winSec); // jendela membulat agar konsisten
  try {
    const r = await db.execute({
      sql: "INSERT INTO rate_limits(key,n,win) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET n=n+1, win=? WHERE rate_limits.win=?",
      args: [key, cur, cur, cur],
    });
    void r;
  } catch (e) {
    // beberapa backend (D1) tidak mendukung UPSERT lama; pakai SELECT+UPDATE
    const row = await db.execute({ sql: "SELECT n, win FROM rate_limits WHERE key=?", args: [key] });
    if (!row.rows[0]) {
      await db.execute({ sql: "INSERT INTO rate_limits(key,n,win) VALUES(?,1,?)", args: [key, cur] });
    } else {
      const n = row.rows[0].win === cur ? Number(row.rows[0].n) + 1 : 1;
      await db.execute({ sql: "UPDATE rate_limits SET n=?, win=? WHERE key=?", args: [n, cur, key] });
    }
  }
  const got = await db.execute({ sql: "SELECT n, win FROM rate_limits WHERE key=?", args: [key] });
  const n = got.rows[0] && got.rows[0].win === cur ? Number(got.rows[0].n) : 1;
  // bersihkan sesekali (jendela lama, acak kecil)
  if (Math.random() < 0.03) {
    try {
      await db.execute({ sql: "DELETE FROM rate_limits WHERE win < ?", args: [t - 7200] });
    } catch {}
  }
  return { ok: n <= max, remaining: Math.max(0, max - n) };
}

export const clientIp = (req) =>
  String(req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 45) || "0.0.0.0";
