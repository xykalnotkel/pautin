import { cookies, headers } from "next/headers";
import { randomBytes } from "node:crypto";
import { db, now, verifyPassword, hashPassword } from "./db";

const COOKIE = "pt_sid";
const TTL = 60 * 60 * 24 * 30; // 30 hari

export async function getUserByLogin(username, password) {
  const r = await db.execute({ sql: "SELECT * FROM users WHERE username=?", args: [username] });
  const u = r.rows[0];
  if (!u) return null;
  const stored = u.salt + ":" + u.pass;
  if (!verifyPassword(password, stored)) return null;
  return u;
}

export async function createUser(username, name, password) {
  const [salt, pass] = hashPassword(password).split(":");
  const r = await db.execute({
    sql: "INSERT INTO users(username,salt,pass,name,created_at) VALUES(?,?,?,?,?)",
    args: [username, salt, pass, name || username, now()],
  });
  const uid = Number(r.lastInsertRowid);
  await db.execute({
    sql: "INSERT INTO links(user_id,title,url,kind,pos,created_at) VALUES(?,?,?,?,?,?)",
    args: [uid, "Website-ku", "https://example.com", "web", 0, now()],
  });
  return uid;
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
    user: { id: Number(u.id), username: u.username, name: u.name, bio: u.bio, avatar: u.avatar, theme: u.theme, radius: u.radius, views: Number(u.views), created_at: Number(u.created_at) },
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
