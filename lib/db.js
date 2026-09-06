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
    email TEXT NOT NULL DEFAULT '',
    email_verified INTEGER NOT NULL DEFAULT 0,
    vtoken TEXT NOT NULL DEFAULT '',
    vexp INTEGER NOT NULL DEFAULT 0,
    vsent INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    avatar TEXT NOT NULL DEFAULT '',
    theme TEXT NOT NULL DEFAULT 'galaxy',
    radius TEXT NOT NULL DEFAULT 'soft',
    grid TEXT NOT NULL DEFAULT 'list',
    av TEXT NOT NULL DEFAULT 'circle',
    font TEXT NOT NULL DEFAULT 'sans',
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

const USER_UPGRADES = [
  ["email", "email TEXT NOT NULL DEFAULT ''"],
  ["email_verified", "email_verified INTEGER NOT NULL DEFAULT 0"],
  ["vtoken", "vtoken TEXT NOT NULL DEFAULT ''"],
  ["vexp", "vexp INTEGER NOT NULL DEFAULT 0"],
  ["vsent", "vsent INTEGER NOT NULL DEFAULT 0"],
  ["grid", "grid TEXT NOT NULL DEFAULT 'list'"],
  ["av", "av TEXT NOT NULL DEFAULT 'circle'"],
  ["font", "font TEXT NOT NULL DEFAULT 'sans'"],
];

export async function migrate() {
  await db.executeMultiple(SCHEMA_STATEMENTS);
  // upgrade tabel lama (sebelum kolom email/verifikasi ada)
  try {
    const pr = await db.execute({ sql: "PRAGMA table_info(users)", args: [] });
    const have = new Set((pr.rows || []).map((c) => String(c.name)));
    for (const [name, ddl] of USER_UPGRADES) {
      if (have.has(name)) continue;
      await db.execute({ sql: `ALTER TABLE users ADD COLUMN ${ddl}`, args: [] });
    }
  } catch (e) {
    console.error("migrate upgrade:", e);
  }
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
  "discord.com": "discord", "discord.gg": "discord", "discordapp.com": "discord",
  "threads.net": "threads", "twitch.tv": "twitch", "dribbble.com": "dribbble",
  "medium.com": "medium", "spotify.link": "spotify",
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
  const words = String(name || "?").trim().split(/\s+/).filter((w) => w);
  return (words.length ? words.slice(0, 2).map((w) => w[0]).join("") : "?").toUpperCase();
}

export const fmtNum = (n) => new Number(n || 0).toLocaleString("id-ID");

// init sekali (skema)
migrate().catch((e) => console.error("db init:", e));
