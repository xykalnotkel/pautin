import { cookies, headers } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { db, now, verifyPassword, hashPassword } from "./db";

const COOKIE = "pt_sid";
const TTL = 60 * 60 * 24 * 30; // 30 hari

export async function getUserByLogin(login, password) {
  const q = String(login || "").toLowerCase();
  const r = await db.execute({
    sql: "SELECT * FROM users WHERE username=? OR (email<>'' AND email=?)",
    args: [q, q],
  });
  const u = r.rows[0];
  if (!u) return null;
  const stored = u.salt + ":" + u.pass;
  if (!verifyPassword(password, stored)) return null;
  return u;
}

export async function findUserByEmail(email) {
  const r = await db.execute({ sql: "SELECT * FROM users WHERE email=? AND email<>''", args: [String(email || "").toLowerCase()] });
  return r.rows[0] || null;
}

// token verifikasi email (hanya hash-nya yang disimpan)
export function hashVerifyToken(raw) {
  return createHash("sha256").update(String(raw)).digest("hex");
}

export const siteBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://pautin.xyc.my.id";

export function maskEmail(email) {
  const [a, b] = String(email || "").split("@");
  if (!b) return email;
  const keep = Math.min(2, Math.max(1, a.length - 2));
  return a.slice(0, keep) + "•••" + a.slice(-1) + "@" + b;
}

export async function setVerifyToken(userId, rawToken, ttlSec = 60 * 60 * 24) {
  await db.execute({
    sql: "UPDATE users SET vtoken=?, vexp=?, vsent=? WHERE id=?",
    args: [hashVerifyToken(rawToken), now() + ttlSec, now(), Number(userId)],
  });
}

export async function setResetToken(userId, rawToken, ttlSec = 60 * 60) {
  // token atur ulang kata sandi (hash sha256 disimpan), berlaku 1 jam
  await db.execute({
    sql: "UPDATE users SET rtok=?, rexp=? WHERE id=?",
    args: [hashVerifyToken(rawToken), now() + ttlSec, Number(userId)],
  });
}

export async function resetPassword(rawToken, password) {
  // hash yang sama dengan token verifikasi; konsumsi sekali pakai
  const t = String(rawToken || "").trim();
  if (!t || t.length > 200) return false;
  const hash = hashVerifyToken(t);
  const r = await db.execute({
    sql: "SELECT id FROM users WHERE rtok=? AND rexp>?",
    args: [hash, now()],
  });
  const u = r.rows[0];
  if (!u) return false;
  const [salt, pass] = hashPassword(password).split(":");
  await db.execute({
    sql: "UPDATE users SET salt=?, pass=?, rtok='', rexp=0 WHERE id=? AND rtok=?",
    args: [salt, pass, Number(u.id), hash],
  });
  const chk = await db.execute({ sql: "SELECT id FROM users WHERE id=? AND rtok='' AND rexp=0", args: [Number(u.id)] });
  return !!chk.rows[0];
}

export async function createUser(username, name, password, email = "") {
  const [salt, pass] = hashPassword(password).split(":");
  const r = await db.execute({
    sql: "INSERT INTO users(username,salt,pass,name,email,created_at) VALUES(?,?,?,?,?,?)",
    args: [username, salt, pass, name || username, String(email || "").toLowerCase(), now()],
  });
  return Number(r.lastInsertRowid);
}

export async function claimUsername(base) {
  // username unik dari basis nama/email (a-z0-9, min 3)
  let slug = String(base || "user").toLowerCase().replace(/[^a-z0-9]+/g, "").replace(/^[0-9]+/, "").slice(0, 20);
  if (slug.length < 3) slug = "user" + slug;
  const chk = async (s) => {
    const r = await db.execute({ sql: "SELECT 1 FROM users WHERE username=?", args: [s] });
    return !r.rows[0];
  };
  if (await chk(slug)) return slug;
  for (let i = 0; i < 8; i++) {
    const cand = slug.slice(0, 16) + Math.floor(Math.random() * 90 + 10);
    if (await chk(cand)) return cand;
  }
  return slug.slice(0, 14) + Math.floor(Date.now() % 100000);
}

export async function openSession(uid) {
  const token = randomBytes(32).toString("base64url");
  await db.execute({
    sql: "INSERT INTO sessions(token,user_id,expires) VALUES(?,?,?)",
    args: [token, uid, now() + TTL],
  });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: !!process.env.VERCEL,
    path: "/", maxAge: TTL,
  });
  return token; // dikirim juga via JSON → fallback header (mis. preview iframe tanpa cookie)
}

export async function destroySession() {
  const store = await cookies();
  const hs = await headers();
  const tok = store.get(COOKIE)?.value || hs.get("x-auth-token");
  if (tok) await db.execute({ sql: "DELETE FROM sessions WHERE token=?", args: [tok] });
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSessionUser() {
  const store = await cookies();
  const hs = await headers();
  const tok = store.get(COOKIE)?.value || hs.get("x-auth-token");
  if (!tok) return null;
  const r = await db.execute({
    sql: `SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id
         WHERE s.token=? AND s.expires>?`,
    args: [tok, now()],
  });
  if (!r.rows[0]) return null;
  return r.rows[0];
}

export async function getMePayload(userId) {
  const ur = await db.execute({ sql: "SELECT * FROM users WHERE id=?", args: [userId] });
  const u = ur.rows[0];
  if (!u) return null;
  const lr = await db.execute({ sql: "SELECT * FROM links WHERE user_id=? ORDER BY pos, id", args: [userId] });
  const cr = await db.execute({ sql: "SELECT COALESCE(SUM(clicks),0) c FROM links WHERE user_id=?", args: [userId] });
  return {
    user: { id: Number(u.id), username: u.username, name: u.name, bio: u.bio, avatar: u.avatar, theme: u.theme, radius: u.radius, grid: u.grid || "list", av: u.av || "circle", font: u.font || "sans", accent: u.accent || "", views: Number(u.views), created_at: Number(u.created_at), email: u.email || "", email_verified: !!Number(u.email_verified), hasPassword: !!(u.salt && u.pass) },
    links: lr.rows.map(row2obj),
    total_clicks: Number(cr.rows[0].c),
  };
}

export function row2obj(row) {
  const o = {};
  for (const k of Object.keys(row)) o[k] = row[k];
  if (o.id !== undefined) o.id = Number(o.id);
  if (o.user_id !== undefined) o.user_id = Number(o.user_id);
  if (o.pos !== undefined) o.pos = Number(o.pos);
  if (o.clicks !== undefined) o.clicks = Number(o.clicks);
  if (o.views !== undefined) o.views = Number(o.views);
  if (o.created_at !== undefined) o.created_at = Number(o.created_at);
  return o;
}
