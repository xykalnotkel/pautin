// Cloudflare Turnstile — verifikasi anti-bot untuk form daftar/masuk.
// Jika TURNSTILE_SECRET_KEY belum di-set (mode dev), verifikasi otomatis dilewati.
export const turnstileSiteKey = () => process.env.TURNSTILE_SITE_KEY || null;

export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // belum dikonfigurasi → jangan blokir (dev)
  if (!token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      cache: "no-store",
    });
    const j = await r.json();
    return !!j.success;
  } catch {
    return false;
  }
}

export const clientIp = (req) =>
  String(req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "0.0.0.0";
