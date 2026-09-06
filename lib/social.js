// Login sosial Google + Discord. Aktif hanya bila env client id/secret di-set.
import { db, now, hashPassword } from "./db";
import { siteBaseUrl, claimUsername, findUserByEmail } from "./auth";

const DEFS = {
  google: {
    envId: "GOOGLE_CLIENT_ID",
    envSecret: "GOOGLE_CLIENT_SECRET",
    label: "Google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    profileUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid email profile",
    prompt: "select_account",
    color: "#ffffff",
    text: "#3c4043",
  },
  discord: {
    envId: "DISCORD_CLIENT_ID",
    envSecret: "DISCORD_CLIENT_SECRET",
    label: "Discord",
    authUrl: "https://discord.com/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    profileUrl: "https://discord.com/api/users/@me",
    scope: "identify email",
    prompt: "consent",
    color: "#5865F2",
    text: "#ffffff",
  },
};

export function socialEnabled(provider) {
  const d = DEFS[provider];
  return !!d && !!process.env[d.envId] && !!process.env[d.envSecret];
}
export const availableSocials = () => Object.keys(DEFS).filter(socialEnabled);

export function authUrl(provider, state) {
  const d = DEFS[provider];
  const cb = encodeURIComponent(`${siteBaseUrl()}/api/auth/${provider}/callback`);
  const p = new URL(d.authUrl);
  if (provider === "google") {
    p.search = new URLSearchParams({
      client_id: process.env[d.envId],
      redirect_uri: cb,
      response_type: "code",
      scope: d.scope,
      state,
      prompt: d.prompt,
    }).toString();
  } else {
    p.search = new URLSearchParams({
      client_id: process.env[d.envId],
      redirect_uri: cb,
      response_type: "code",
      scope: d.scope,
      state,
      prompt: d.prompt,
    }).toString();
  }
  return p.toString();
}

export async function exchangeCode(provider, code) {
  const d = DEFS[provider];
  const body =
    provider === "google"
      ? {
          code,
          client_id: process.env[d.envId],
          client_secret: process.env[d.envSecret],
          redirect_uri: `${siteBaseUrl()}/api/auth/${provider}/callback`,
          grant_type: "authorization_code",
        }
      : new URLSearchParams({
          code,
          client_id: process.env[d.envId],
          client_secret: process.env[d.envSecret],
          redirect_uri: `${siteBaseUrl()}/api/auth/${provider}/callback`,
          grant_type: "authorization_code",
        });
  const r = await fetch(d.tokenUrl, {
    method: "POST",
    headers:
      provider === "google"
        ? { "Content-Type": "application/json" }
        : { "Content-Type": "application/x-www-form-urlencoded" },
    body: provider === "google" ? JSON.stringify(body) : body.toString(),
    cache: "no-store",
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error("token exchange gagal");
  const pr = await fetch(d.profileUrl, {
    headers: { Authorization: `Bearer ${j.access_token}` },
    cache: "no-store",
  });
  const prof = await pr.json().catch(() => ({}));
  if (!pr.ok) throw new Error("profil gagal");
  if (provider === "google") {
    return { email: String(prof.email || "").toLowerCase(), name: prof.name || "", verified: !!prof.email_verified };
  }
  return {
    email: String(prof.email || "").toLowerCase(),
    name: prof.global_name || prof.username || "",
    verified: !!prof.verified && !!prof.email,
  };
}

export async function upsertSocialUser(provider, profile) {
  const email = String(profile.email || "").trim().toLowerCase();
  if (!email || !profile.verified) throw new Error("no-email");
  let u = await findUserByEmail(email);
  if (u) {
    // akun lama: buktikan kepemilikan email via provider → langsung terverifikasi
    if (!Number(u.email_verified)) {
      await db.execute({
        sql: "UPDATE users SET email_verified=1, vtoken='', vexp=0 WHERE id=?",
        args: [Number(u.id)],
      });
    }
    return Number(u.id);
  }
  const [salt, pass] = hashPassword(`soc:${now()}:${Math.random()}`).split(":");
  const username = await claimUsername((profile.name || email.split("@")[0]).replace(/\s+/g, ""));
  const name = String(profile.name || username).slice(0, 60);
  const r = await db.execute({
    sql: "INSERT INTO users(username,salt,pass,name,email,email_verified,created_at) VALUES(?,?,?,?,?,1,?)",
    args: [username, salt, pass, name, email, now()],
  });
  return Number(r.lastInsertRowid);
}
