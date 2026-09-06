// Lapisan penyimpanan ganda:
//   1) Cloudflare D1 (HTTP API)  — bila env CLOUDFLARE_API_TOKEN + CF_ACCOUNT_ID + CF_D1_ID di-set (produksi)
//   2) libSQL (Turso) / file SQLite — bila tidak (dev lokal / preview)
import path from "path";
import crypto from "node:crypto";
import { createClient } from "@libsql/client";

const isVercel = !!process.env.VERCEL;

// ================================================================ ADAPTER D1
function makeD1(accountId, databaseId, apiToken) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  function norm(v) {
    if (v === undefined) return null;
    if (typeof v === "bigint") return Number(v);
    return v;
  }
  async function execute({ sql, args = [] }) {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params: args.map(norm) }),
      cache: "no-store",
    });
    const j = await res.json().catch(() => ({}));
    if (!j.success) {
      const msg = (j.errors || []).map((e) => e.message).join("; ") || "D1 error";
      throw new Error(msg);
    }
    const st = (j.result || [])[0] || {};
    if (st.success === false) throw new Error(st.error || "D1 statement error");
    const meta = st.meta || {};
    const lastInsertRowid = meta.last_row_id !== undefined ? Number(meta.last_row_id) : undefined;
    return { rows: st.results || [], lastInsertRowid };
  }
  return {
    execute,
    kind: "d1",
    async executeMultiple(statements) {
      for (const s of statements) await execute({ sql: s, args: [] });
    },
  };
}

// ================================================================ ADAPTER LIBSQL
function makeLibsql() {
  const FILE_URL = "file:" + path.join(process.cwd(), "data.db");
  const dbUrl = process.env.TURSO_DATABASE_URL || FILE_URL;
  const client = createClient({
    url: dbUrl,
    authToken: dbUrl.startsWith("http") ? process.env.TURSO_AUTH_TOKEN || undefined : undefined,
  });
  return {
    kind: "libsql",
    execute: (q) => client.execute(q),
    executeMultiple: (statements) => client.executeMultiple(statements.join(";\n")),
  };
}

// ================================================================ PEMILIH
export const USE_D1 = !!(process.env.CLOUDFLARE_API_TOKEN && process.env.CF_ACCOUNT_ID && process.env.CF_D1_ID);

export const db = USE_D1
  ? makeD1(process.env.CF_ACCOUNT_ID, process.env.CF_D1_ID, process.env.CLOUDFLARE_API_TOKEN)
  : makeLibsql();

export const now = () => Math.floor(Date.now() / 1000);

// ---------------------------------------------------------------- schema
export const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    salt TEXT NOT NULL, pass TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    avatar TEXT NOT NULL DEFAULT '',
    theme TEXT NOT NULL DEFAULT 'galaxy',
    radius TEXT NOT NULL DEFAULT 'soft',
    views INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS links(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL, url TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '', kind TEXT NOT NULL DEFAULT 'link',
    pos INTEGER NOT NULL DEFAULT 0, clicks INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions(
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires INTEGER NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS idx_links_user ON links(user_id, pos)",
  "CREATE INDEX IF NOT EXISTS idx_sess_exp ON sessions(expires)",
];

export async function migrate() {
  await db.executeMultiple(SCHEMA_STATEMENTS);
}

// ---------------------------------------------------------------- password
export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(pw, salt, 120_000, 32, "sha256").toString("hex");
  return salt + ":" + hash;
}
export function verifyPassword(pw, stored) {
  const [salt, hash] = String(stored).split(":");
  if (!salt || !hash) return false;
  const test = crypto.pbkdf2Sync(pw, salt, 120_000, 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(test, "hex"));
}
export const newToken = () => crypto.randomBytes(32).toString("base64url");

// ---------------------------------------------------------------- seed demo
const DEMO = [
  {
    username: "rizky", password: "demo123", name: "Rizky Pratama",
    bio: "Developer & kreator konten 🚀 Tips coding, teknologi, dan produktivitas.",
    theme: "galaxy", radius: "soft", views: 4128,
    links: [
      { title: "YouTube — channel coding-ku", url: "https://youtube.com/@rizkypratama", emoji: "🎬", clicks: 812 },
      { title: "Tulisan di blog", url: "https://medium.com/@rizkypratama", emoji: "📝", clicks: 543 },
      { title: "Gabung komunitas Discord", url: "https://discord.gg", emoji: "💬", clicks: 391 },
      { title: "Traktir kopi ☕ (Saweria)", url: "https://saweria.co/rizky", emoji: "☕", clicks: 77 },
      { title: "Instagram", url: "https://instagram.com/rizky.pratama", clicks: 1204 },
      { title: "TikTok", url: "https://tiktok.com/@rizky.pratama", clicks: 933 },
      { title: "X (Twitter)", url: "https://x.com/rizkypratama", clicks: 168 },
    ],
  },
  {
    username: "nadia", password: "demo123", name: "Nadia Ayu",
    bio: "Foodie & traveller 🍜✈️ Resep rumahan, itinerary seru, dan cerita perjalanan.",
    theme: "mawar", radius: "full", views: 2856,
    links: [
      { title: "Resep harian — blog", url: "https://medium.com/@nadia.ayu", emoji: "🍜", clicks: 402 },
      { title: "Itinerary liburan gratis", url: "https://drive.google.com", emoji: "🗺️", clicks: 311 },
      { title: "Koleksi resep di YouTube", url: "https://youtube.com/@nadiaayu", emoji: "🎬", clicks: 287 },
      { title: "Dukung perjalananku", url: "https://saweria.co/nadia", emoji: "✈️", clicks: 45 },
      { title: "Instagram", url: "https://instagram.com/nadia.ayu", clicks: 890 },
      { title: "Pinterest", url: "https://pinterest.com/nadiaayu", clicks: 230 },
    ],
  },
  {
    username: "kopikita", password: "demo123", name: "Kopi Kita ☕",
    bio: "Kedai kopi kecil di sudut kota. Buka setiap hari 08.00–22.00.",
    theme: "kopi", radius: "sharp", views: 1630,
    links: [
      { title: "Order & reservasi via WhatsApp", url: "https://wa.me/6281234567890", emoji: "📱", clicks: 245 },
      { title: "Lihat lokasi di Google Maps", url: "https://maps.google.com/?q=kopi+kita", emoji: "📍", clicks: 167 },
      { title: "Playlist teman ngopi", url: "https://open.spotify.com", emoji: "🎵", clicks: 98 },
      { title: "Instagram", url: "https://instagram.com/kopikita.id", clicks: 420 },
      { title: "TikTok", url: "https://tiktok.com/@kopikita.id", clicks: 301 },
    ],
  },
];

export async function seedIfEmpty(force = false) {
  if (process.env.PAUTIN_NO_SEED && !force) return;
  try {
    const { rows } = await db.execute({ sql: "SELECT COUNT(*) AS c FROM users", args: [] });
    if (Number(rows[0]?.c) > 0 && !force) return;
    for (const u of DEMO) {
      const [salt, pass] = hashPassword(u.password).split(":");
      const r = await db.execute({
        sql: "INSERT INTO users(username,salt,pass,name,bio,avatar,theme,radius,views,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
        args: [u.username, salt, pass, u.name, u.bio, "", u.theme, u.radius, u.views, now()],
      });
      const uid = Number(r.lastInsertRowid);
      for (let i = 0; i < u.links.length; i++) {
        const l = u.links[i];
        await db.execute({
          sql: "INSERT INTO links(user_id,title,url,emoji,kind,pos,clicks,created_at) VALUES(?,?,?,?,?,?,?,?)",
          args: [uid, l.title, l.url, l.emoji || "", kindOf(l.url), i, l.clicks || 0, now()],
        });
      }
    }
  } catch (e) {
    if (!String(e.message).includes("UNIQUE")) throw e;
  }
}

// ---------------------------------------------------------------- helpers URL
export const USERNAME_RE = /^[a-z0-9]{3,20}$/;
export const RESERVED = new Set(["app", "api", "u", "a", "admin", "masuk", "daftar", "www", "root", "user", "login", "register"]);

const SOCIAL_HOSTS = {
  "instagram.com": "instagram", "youtube.com": "youtube", "m.youtube.com": "youtube", "youtu.be": "youtube",
  "tiktok.com": "tiktok", "vt.tiktok.com": "tiktok",
  "x.com": "x", "twitter.com": "x",
  "facebook.com": "facebook", "fb.com": "facebook",
  "linkedin.com": "linkedin", "github.com": "github",
  "wa.me": "whatsapp", "whatsapp.com": "whatsapp", "api.whatsapp.com": "whatsapp",
  "t.me": "telegram", "telegram.me": "telegram",
  "open.spotify.com": "spotify", "spotify.com": "spotify",
  "shopee.co.id": "shopee", "tokopedia.com": "tokopedia",
  "saweria.co": "saweria", "pinterest.com": "pinterest",
};
export const SOCIAL_KINDS = new Set(Object.values(SOCIAL_HOSTS).concat(["mail", "web"]));

function netlocOf(url) {
  try {
    const p = new URL(url);
    return (p.hostname || "").toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function kindOf(url) {
  if (url.toLowerCase().startsWith("mailto:")) return "mail";
  const host = netlocOf(url);
  if (!host) return "link";
  const parts = host.split(".");
  return SOCIAL_HOSTS[host] || (parts.length >= 2 ? parts[parts.length - 2] : "link");
}

export function cleanUrl(raw) {
  let u = String(raw || "").trim();
  if (!u) return "";
  if (u.startsWith("mailto:") || /^[a-z]+:\/\//i.test(u)) return u;
  return "https://" + u;
}

export function badUrl(url) {
  if (url.startsWith("mailto:")) return !/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url);
  try {
    const p = new URL(url);
    const host = (p.hostname || "").toLowerCase();
    return (p.protocol !== "http:" && p.protocol !== "https:") || !host.includes(".") || host.length < 4;
  } catch {
    return true;
  }
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function initials(name) {
  const words = String(name || "?").trim().split(/\s+/).filter((w) => w && !w.startsWith("☕"));
  return (words.length ? words.slice(0, 2).map((w) => w[0]).join("") : "?").toUpperCase();
}

export const fmtNum = (n) => new Number(n || 0).toLocaleString("id-ID");

// init sekali (skema + seed demo bila masih kosong)
migrate()
  .then(() => seedIfEmpty())
  .catch((e) => console.error("db init:", e));
