// Pautin Security Worker — lapisan pertahanan sendiri di Cloudflare.
// Pasang sebagai rute pautin.xyc.my.id/* → fetch ke origin (Vercel).
//
// Fitur:
//  1) Blokir pola SQL-injection / XSS / path-traversal di query & body JSON
//  2) Rate limit per IP (KV "RL") — ketat untuk /api/login & /api/register
//  3) Blokir path admin/sensitif yang umum diserang
//  4) Halaman 502/503/504 bergaya (kecuali API), header keamanan tambahan
// Bila KV tidak tersedia: rate limit general tetap jalan di memori (fail-open).

const SQLI =
  /(union\s+(all\s+)?select|select\s+.{0,40}\s+from|insert\s+into|drop\s+table|alter\s+table|delete\s+from|update\s+.{0,20}\s+set|(\bor\b|\band\b)\s+['"]?\d\s*=\s*\d|--\s*$|;?\s*drop\s+table|\bx?p_cmdshell|char\s*\(\s*\d{2,}|concat\s*\(\s*0x)/i;
const XSS =
  /(<script|<\/script|javascript\s*:|vbscript\s*:|onerror\s*=|onload\s*=|onclick\s*=|onmouseover\s*=|onfocus\s*=|<\s*iframe|<\s*object|<\s*embed|data\s*:\s*text\/html|%3cscript|%3c%2fscript|%3ciframe)/i;
const TRAV = /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\|%252e)/i;
const JUNK_PATH = /(^|\/)(wp-admin|wp-login|wp-content|\.env|\.git|config\.json|phpmyadmin|_profiler|server-status|\.aws|\.ssh)(\/|$|\.)/i;

function scan(text, limit = 20000) {
  if (!text) return false;
  if (text.length > limit) text = text.slice(0, limit);
  return SQLI.test(text) || XSS.test(text) || TRAV.test(text);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const path = url.pathname;

    // 1) path sensitif
    if (JUNK_PATH.test(path)) return block("Akses ditolak.", 403);

    // 2) scan query string (decoded agar 'union%20select' ikut terdeteksi)
    const dec = (x) => { try { return decodeURIComponent(x); } catch { return x; } };
    if (scan(dec(url.search))) return block("Permintaan ditolak oleh filter keamanan.", 403);

    // 3) scan body (bila ada)
    let bodyText = null;
    const ct = request.headers.get("content-type") || "";
    if (request.method !== "GET" && ct.includes("json")) {
      try {
        const cl = request.headers.get("content-length");
        if (!cl || Number(cl) <= 30000) bodyText = await request.clone().text();
      } catch {}
      if (scan(bodyText)) return block("Permintaan ditolak oleh filter keamanan.", 403);
    }

    // 4) rate limit
    const minute = Math.floor(Date.now() / 60000);
    const isAuth = /^\/(api\/(login|register))/.test(path);
    const key = `rl:${ip}:${isAuth ? "auth" : "gen"}:${minute}`;
    let allow = true;
    const limit = isAuth ? 15 : 900;
    let cur = 0;
    if (env && env.RL) {
      try { cur = Number((await env.RL.get(key)) || 0); } catch (e) { console.error("kvget", e.message); }
      if (cur >= limit) allow = false;
      else {
        try { await env.RL.put(key, String(cur + 1), { expirationTtl: 120 }); } catch (e) { console.error("kvput", e.message); }
      }
    }

    if (!allow) {
      return new Response(
        JSON.stringify({ error: "Terlalu banyak permintaan dari perangkat ini. Coba beberapa saat lagi." }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60", "Cache-Control": "no-store" } }
      );
    }

    // 5) teruskan ke origin
    let res;
    try {
      res = await fetch(request);
    } catch {
      return styledError(502, "Origin tidak dapat dijangkau. Coba lagi sebentar.");
    }

    // 6) 502/503/504 bergaya untuk halaman (bukan API)
    if (res.status >= 500 && !path.startsWith("/api/")) {
      const text = await res.clone().text();
      if (!text || text.length < 200) return styledError(res.status, "Layanan sedang sibuk. Coba lagi sebentar.");
    }

    // 7) header keamanan tambahan
    const headers = new Headers(res.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    return new Response(res.body, { status: res.status, headers });
  },
};

function block(msg, status) {
  return new Response(
    JSON.stringify({ error: msg }),
    { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }
  );
}

function styledError(status, msg) {
  const html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${status} — Pautin</title><style>
  body{font-family:system-ui,sans-serif;background:#0B241D;color:#F7F0E3;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;background-image:radial-gradient(700px 460px at 80% -10%,rgba(228,87,46,.28),transparent 60%)}
  .b{padding:28px;max-width:440px}.h{font-size:26px;font-weight:800;margin:16px 0 8px;letter-spacing:-.5px}
  p{color:rgba(247,240,227,.68);margin:0 0 24px;line-height:1.7}a{display:inline-block;background:#E4572E;color:#fff;text-decoration:none;font-weight:800;padding:12px 24px;border-radius:999px}
  </style></head><body><div class="b">
  <svg viewBox="0 0 64 64" width="64" height="64" style="border-radius:18px;overflow:hidden"><rect width="64" height="64" fill="#0F5B4D"/><g fill="none" stroke="#F7F0E3" stroke-width="6" stroke-linecap="round"><rect x="17" y="17" width="21" height="21" rx="8" transform="rotate(45 27.5 27.5)"/><rect x="28" y="28" width="21" height="21" rx="8" transform="rotate(-45 38.5 38.5)"/></g><circle cx="44.5" cy="19.5" r="4.6" fill="#E4572E"/></svg>
  <div class="h">${status} — kendala server</div><p>${msg}</p><a href="/">Muat ulang beranda</a></div></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Retry-After": "30" } });
}
