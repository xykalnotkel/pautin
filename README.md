# Pautin — "Satu Link untuk Semua Tautanmu"

Aplikasi web ala **Linktree** berbasis **Next.js (App Router)** — multi-user, tiap user punya
halaman profil berisi kumpulan link yang bisa dikelola dan dibagikan lewat satu tautan unik.

**Live:** https://pautin.vercel.app · **Repo:** https://github.com/xykalnotkel/pautin
**Backend auth:** Cloudflare **D1** (database) + **Turnstile** (anti-bot daftar/masuk)

## Fitur

**Halaman publik** `/u/<username>`
- Profil: nama, bio, avatar, penghitung kunjungan
- Link media sosial otomatis jadi ikon bulat (IG, YouTube, TikTok, X, FB, LinkedIn, GitHub, WhatsApp, Telegram, Spotify, Shopee, Tokopedia, Saweria, Pinterest, email)
- Pelacakan klik per link · tombol bagikan / salin · SEO & Open Graph per user · responsif

**Dashboard** `/app`
- Registrasi + login (PBKDF2-SHA256 120.000 iterasi + salt, sesi aman)
- Cek username tersedia real-time · tambah/edit/hapus link dengan emoji (deteksi otomatis tipe & prefix `https://`)
- Drag & drop urutan link · 8 tema + bentuk tombol, pratinjau langsung
- Statistik kunjungan & klik · Salin Link, Bagikan (WA/FB/X/TG), QR code (unduh PNG)

## Menjalankan lokal

```bash
cd pautin-next
npm install
npm run seed   # (opsional) pastikan 3 akun demo ada
npm run dev    # http://localhost:3000
```

Tanpa env apa pun, aplikasi otomatis memakai **SQLite lokal** (`data.db`).

## Backend & Cloudflare

**Database — Cloudflare D1** (via HTTP API, adapter di `lib/db.js`):
- Bila env `CLOUDFLARE_API_TOKEN` + `CF_ACCOUNT_ID` + `CF_D1_ID` di-set → pakai D1.
- Selain itu → libSQL (Turso) / file SQLite. Skema & seed demo otomatis saat inisialisasi.

**Anti-bot — Cloudflare Turnstile** (`lib/turnstile.js`):
- Form daftar/masuk menampilkan widget bila `TURNSTILE_SITE_KEY` ada; server memverifikasi
  token ke `siteverify` bila `TURNSTILE_SECRET_KEY` di-set. Jika belum diset → dilewati (mode dev).

**Sesi:** cookie `pt_sid` HttpOnly, plus fallback header `X-Auth-Token` (untuk lingkungan
yang memblokir cookie). Password di-hash PBKDF2-SHA256 120k iterasi + salt acak.

### Verifikasi email
Pendaftaran baru **wajib** email unik + verifikasi lewat tautan (dikirim dengan Resend,
env `RESEND_API_KEY` + `RESEND_FROM`). Akun tanpa email terverifikasi tidak bisa masuk.
Tidak ada lagi akun demo/seed otomatis.

## Deploy / update di Vercel

Project sudah terhubung. Env yang dibutuhkan (Settings → Environment Variables):

| Nama | Keterangan |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token API Cloudflare (izin D1) |
| `CF_ACCOUNT_ID` | ID akun Cloudflare |
| `CF_D1_ID` | ID database D1 `pautin` |
| `TURNSTILE_SITE_KEY` | opsional — site key Turnstile |
| `TURNSTILE_SECRET_KEY` | opsional — secret key Turnstile |

Setelah edit kode:

```bash
git add -A && git commit -m "..." && git push
# lalu deploy dari folder:
npx vercel --prod        # (CLI sudah ter-link ke project pautin)
```

## Struktur

```
pautin-next/
├─ app/
│  ├─ layout.js / globals.css / icon.svg   # root layout, favicon
│  ├─ page.js                              # landing
│  ├─ not-found.js
│  ├─ app/page.js + layout.js              # shell dashboard (SPA client)
│  ├─ u/[username]/page.js                 # halaman publik (SSR dinamis)
│  └─ api/                                 # route handlers:
│     ├─ register · login · logout · me · check · config
│     ├─ profile · settings · reorder
│     └─ links · links/[id] · links/click/[id]
├─ lib/
│  ├─ db.js        # dual-storage: D1 (Cloudflare) ↔ libSQL lokal; skema, seed, validasi
│  ├─ auth.js      # PBKDF2, sesi cookie + header
│  ├─ turnstile.js # verifikasi Turnstile (opsional)
│  └─ theme.js     # 8 tema, ikon sosial, render halaman publik
├─ public/a/       # CSS & JS dashboard
├─ scripts/seed.js
└─ package.json    # next 15 · react 19 · @libsql/client
```


## Identitas & legal
- Logo, ikon SVG, palet, dan typeface (Sora/Manrope) adalah aset asli Pautin — tanpa emoji di seluruh UI.
- Halaman publik: /about · /legal/terms · /legal/privacy · /legal/license (+ LICENSE MIT).
- Aset merek pihak ketiga hanya ikon media sosial sebagai penanda tautan.

## Penyimpanan media (Cloudinary, WebP tajam & ringan)
Upload foto profil → `/api/upload/avatar` (tanda tangan server-side) → transformasi eager
`c_fill,w_512,h_512,q_auto:good,f_webp`; saat ditampilkan dipakai turunan `q_auto,f_webp`
dengan lebar sesuai konteks (256–512). Env: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`.

## Perlindungan (gratis)
1. **Cloudflare proxy (anti-DDoS native)** — domain pautin.xyc.my.id di belakang Cloudflare free plan.
2. **Rate limit** login/register per IP di D1 (`lib/ratelimit.js`).
3. **Turnstile** anti-bot (opsional, aktif setelah site/secret key diset).
4. Security headers global; password PBKDF2-SHA256 + salt.

## API

| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/register` / `/api/login` | daftar / masuk (Turnstile bila aktif) → cookie + `{token}` |
| POST | `/api/logout` | keluar |
| GET | `/api/me` | profil + links + statistik |
| GET | `/api/check?u=...` | cek username tersedia |
| GET | `/api/config` | konfig publik (mis. `turnstileSiteKey`) |
| PUT | `/api/profile` · `/api/settings` | ubah profil / tema |
| POST | `/api/links` · PUT/DELETE `/api/links/<id>` | kelola link |
| POST | `/api/links/click/<id>` | catat klik (publik) |
| POST | `/api/reorder` | simpan urutan |

## Keamanan
- Password PBKDF2-SHA256 120k iterasi + salt acak · perbandingan timing-safe
- Semua output user di-escape (anti-XSS) · SQL pakai parameter binding (anti-injection)
- Username divalidasi regex + daftar cadangan · validasi URL ketat · ownership link selalu dicek
- Dashboard `noindex` · Turnstile opsional anti-bot
- File `.env.example` berisi placeholder — kunci asli **tidak pernah** masuk git
