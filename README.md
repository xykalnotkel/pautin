# Pautin — "Satu Link untuk Semua Tautanmu"

Aplikasi web ala **Linktree** berbasis **Next.js (App Router)** — multi-user, tiap user punya
halaman profil berisi kumpulan link yang bisa dikelola dan dibagikan lewat satu tautan unik.

**Live:** https://pautin.xyc.my.id · **Repo:** https://github.com/xykalnotkel/pautin
**Database:** Cloudflare **D1** · **Email:** Resend (verifikasi & atur ulang kata sandi)

## Kenapa "Pautin"?

**Paut** berarti mengikat atau menyambungkan — akar kata dari *berpaut* dan *pautan* (tautan).
Akhiran khas Indonesia **-in** mengubahnya menjadi ajakan: *pautkan*. Jadi **Pautin** artinya
"satukan semua tautanmu di satu tempat". Logo dua mata rantai yang saling mengait melambangkan
dua sisi yang tersambung jadi satu — kamu dan semua tautanmu.

## Fitur

**Halaman publik** `/u/<username>`
- Profil: nama, bio, avatar, penghitung kunjungan
- Link media sosial otomatis jadi ikon bulat (IG, YouTube, TikTok, X, FB, LinkedIn, GitHub, WhatsApp, Telegram, Spotify, Shopee, Tokopedia, Saweria, Pinterest, email)
- **Folder/grup tautan**: judul seksi otomatis di halaman publik
- Pelacakan klik per link · tombol bagikan / salin · SEO & Open Graph per user · responsif

**Dashboard** `/app`
- Registrasi + verifikasi email (wajib) · login (PBKDF2-SHA256 120.000 iterasi + salt, sesi aman)
- **Lupa kata sandi**: tautan atur ulang sekali pakai via email (berlaku 1 jam)
- Cek username tersedia real-time · tambah/edit/hapus link dengan ikon, kategori grup, dan prefix `https://` otomatis
- Drag & drop urutan link · 8 tema + bentuk tombol + **warna aksen kustom**, pratinjau langsung
- Statistik kunjungan & klik + **grafik 30 hari** + tautan terpopuler
- Salin Link, Bagikan (WA/FB/X/TG), QR code (unduh PNG)

## Menjalankan lokal

```bash
cd pautin-next
npm install
npm run dev    # http://localhost:3000
```

Tanpa env apa pun, aplikasi otomatis memakai **SQLite lokal** (`data.db`). Tanpa `RESEND_API_KEY`,
tautan verifikasi/atur ulang dikembalikan lewat respons API (mode pengembangan) agar alur bisa dites.

## Database — Cloudflare D1

Adapter di `lib/db.js` mendukung dua penyimpanan:
- Bila env `CLOUDFLARE_API_TOKEN` + `CF_ACCOUNT_ID` + `CF_D1_ID` di-set → pakai D1.
- Selain itu → libSQL (Turso) / file SQLite. Skema & upgrade kolom otomatis saat inisialisasi.

## Email (Resend)

Env: `RESEND_API_KEY` (wajib di produksi) dan opsional `RESEND_FROM` (default `onboarding@resend.dev`).
Dipakai untuk: verifikasi email pendaftaran, kirim ulang verifikasi, dan tautan atur ulang kata sandi.

## Deploy / update di Vercel

Project sudah terhubung. Env yang dibutuhkan (Settings → Environment Variables):

| Nama | Keterangan |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token API Cloudflare (izin D1) |
| `CF_ACCOUNT_ID` | ID akun Cloudflare |
| `CF_D1_ID` | ID database D1 `pautin` |
| `RESEND_API_KEY` | API key Resend untuk email transaksional |
| `RESEND_FROM` | opsional — pengirim email |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | upload foto profil |
| `NEXT_PUBLIC_SITE_URL` | opsional — `https://pautin.xyc.my.id` |

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
│  ├─ page.js                              # landing (termasuk cerita nama Pautin)
│  ├─ not-found.js
│  ├─ app/page.js + layout.js              # shell dashboard (SPA client)
│  ├─ u/[username]/page.js                 # halaman publik (SSR dinamis)
│  ├─ verify/page.js · reset/page.js       # verifikasi email & atur ulang kata sandi
│  └─ api/                                 # route handlers:
│     ├─ register · login · logout · me · check · config
│     ├─ profile · settings · reorder · stats
│     ├─ forgot · reset · verify(/resend)
│     └─ links · links/[id] · links/click/[id]
├─ lib/
│  ├─ db.js        # dual-storage: D1 (Cloudflare) ↔ libSQL lokal; skema, upgrade, migrasi
│  ├─ auth.js      # PBKDF2, sesi cookie + header, token verifikasi & reset
│  ├─ email.js     # template email Resend (verifikasi, atur ulang)
│  └─ theme.js     # tema, ikon sosial, warna aksen, render halaman publik
├─ public/a/       # CSS & JS dashboard
├─ scripts/seed.js
└─ package.json    # next 15 · react 19 · @libsql/client
```

## Identitas & legal
- Nama Pautin berasal dari "paut" + akhiran "-in" (lihat cerita nama di atas). Logo, ikon SVG, palet,
  dan typeface (Sora/Manrope) adalah aset asli Pautin — tanpa emoji di seluruh UI.
- Halaman publik: /about · /legal/terms · /legal/privacy · /legal/license (+ LICENSE MIT).
- Aset merek pihak ketiga hanya ikon media sosial sebagai penanda tautan.

## Penyimpanan media (Cloudinary, WebP tajam & ringan)
Upload foto profil → `/api/upload/avatar` (tanda tangan server-side) → transformasi eager
`c_fill,w_512,h_512,q_auto:good,f_webp`; saat ditampilkan dipakai turunan `q_auto,f_webp`
dengan lebar sesuai konteks (256–512). Env: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`.

## Perlindungan (gratis)
1. **Cloudflare proxy (anti-DDoS native)** — domain pautin.xyc.my.id di belakang Cloudflare free plan.
2. **Rate limit** login/register/forgot/reset per IP di D1 (`lib/ratelimit.js`).
3. **Verifikasi email wajib** untuk akun baru; token disimpan sebagai hash SHA-256 (sekali pakai + kedaluwarsa).
4. Security headers global; password PBKDF2-SHA256 + salt.

## API

| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/register` | daftar (email unik, wajib verifikasi) → `{token, devLink?}` |
| POST | `/api/login` | masuk → cookie + `{token}` (403 `unverified` bila belum verifikasi) |
| POST | `/api/logout` | keluar |
| GET | `/api/me` | profil + links + statistik ringkas |
| GET | `/api/check?u=...` | cek username tersedia |
| GET | `/api/config` | konfig publik (daftar login sosial) |
| PUT | `/api/profile` · `/api/settings` | ubah profil / tema + aksen |
| POST | `/api/links` · PUT/DELETE `/api/links/<id>` | kelola link (termasuk grup) |
| POST | `/api/links/click/<id>` | catat klik (publik) |
| POST | `/api/reorder` | simpan urutan |
| GET | `/api/stats` | grafik 30 hari + total + terpopuler |
| POST | `/api/verify/resend` | kirim ulang verifikasi (cooldown 60 dtk) |
| POST | `/api/forgot` · `/api/reset` | lupa kata sandi & setel ulang |

## Keamanan
- Password PBKDF2-SHA256 120k iterasi + salt acak · perbandingan timing-safe
- Semua output user di-escape (anti-XSS) · SQL pakai parameter binding (anti-injection)
- Username divalidasi regex · validasi URL ketat · ownership link selalu dicek
- Respons `/api/forgot` seragam walau akun tidak ada (anti-enumerasi akun)
