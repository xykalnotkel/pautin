// Email via Resend. Butuh env RESEND_API_KEY (+ RESEND_FROM).
// Tanpa RESEND_API_KEY → mode dev: token/tautan dikembalikan lewat kode (JANGAN di produksi).
const API = "https://api.resend.com/emails";

export const resendConfigured = () => !!process.env.RESEND_API_KEY;
export const mailFrom = () =>
  process.env.RESEND_FROM || "Pautin <onboarding@resend.dev>";

export async function sendMail({ to, subject, html, text }) {
  if (!resendConfigured()) {
    throw new Error("RESEND_API_KEY belum diset");
  }
  const r = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      // beberapa jaringan memblokir permintaan API tanpa signature browser
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
    },
    body: JSON.stringify({ from: mailFrom(), to, subject, html, text }),
    cache: "no-store",
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.message || `Resend ${r.status}`);
  return j;
}

const SHELL = (inner) => `<!doctype html><html lang="id"><body style="margin:0;background:#F7F3EA;padding:28px 14px;font-family:Manrope,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
<div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #E3D9C2;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px -40px rgba(27,43,36,.5)">
  <div style="background:#0F5B4D;padding:26px 30px;display:flex;align-items:center;gap:11px">
    <svg width="30" height="30" viewBox="0 0 64 64" style="border-radius:9px"><rect width="64" height="64" rx="15" fill="#0F5B4D"/><g fill="none" stroke="#F7F0E3" stroke-width="7" stroke-linecap="round"><rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)"/><rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)"/></g><circle cx="45" cy="19" r="5" fill="#E4572E"/></svg>
    <span style="color:#F7F0E3;font-weight:800;font-size:17px;letter-spacing:.2px">Pautin</span>
  </div>
  <div style="padding:30px 30px 26px">${inner}</div>
  <div style="padding:16px 30px 22px;border-top:1px solid #F0E9DA;color:#8B8575;font-size:11.5px;line-height:1.6">
    Email dikirim otomatis oleh Pautin — Satu link untuk semua tautanmu.<br>Bukan kamu? Abaikan email ini.
  </div>
</div></body></html>`;

export function verifyEmailHtml({ name, link }) {
  return SHELL(`
    <h1 style="margin:0 0 10px;font-size:19px;color:#16382F">Verifikasi emailmu, ${name.split(" ")[0]}</h1>
    <p style="margin:0 0 18px;font-size:14px;color:#55635C;line-height:1.65">Tinggal satu langkah lagi sebelum halaman <b>Pautin</b>-mu aktif. Klik tombol di bawah untuk mengonfirmasi alamat email ini:</p>
    <a href="${link}" style="display:inline-block;background:#E4572E;color:#fff;font-weight:800;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:999px">Aktifkan akun saya</a>
    <p style="margin:20px 0 0;font-size:12.5px;color:#8B8575;line-height:1.7">Tombol tidak bekerja? Salin tautan ini ke browser:<br><span style="color:#0F5B4D;word-break:break-all">${link}</span></p>
    <p style="margin:16px 0 0;font-size:12.5px;color:#8B8575">Tautan berlaku 24 jam dan hanya untuk satu kali pakai.</p>`);
}

export function verifyEmailText({ name, link }) {
  return `Hai ${name},\nVerifikasi emailmu untuk mengaktifkan halaman Pautin-mu:\n${link}\n\nTautan berlaku 24 jam. Abaikan email ini bila bukan kamu.`;
}
