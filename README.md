# 🔗 Pautin — "Satu Link untuk Semua Tautanmu"

Aplikasi web ala **Linktree** berbasis **Next.js (App Router)** — multi-user, tiap user punya
halaman profil berisi kumpulan link yang bisa dikelola dan dibagikan lewat satu tautan unik.
**Siap deploy ke Vercel.**

## ✨ Fitur

**Halaman publik** `/u/<username>`
- Profil: nama, bio, avatar, penghitung kunjungan
- Link media sosial otomatis jadi ikon bulat (IG, YouTube, TikTok, X, FB, LinkedIn, GitHub, WhatsApp, Telegram, Spotify, Shopee, Tokopedia, Saweria, Pinterest, email)
- Pelacakan klik per link · tombol bagikan / salin · SEO & Open Graph per user · responsif

**Dashboard** `/app`
- Registrasi + login (PBKDF2-SHA256 120.000 iterasi + salt, sesi aman)
- Cek username tersedia real-time · tambah/edit/hapus link dengan emoji (deteksi otomatis tipe & prefix `https://`)
- Drag & drop urutan link · 8 tema + bentuk tombol, pratinjau langsung
- Statistik kunjungan & klik · Salin Link, Bagikan (WA/FB/X/TG), QR code (unduh PNG)

## 🚀 Menjalankan lokal

```bash
cd pautin-next
npm install
npm run seed      # (opsional) pastikan 3 akun demo ada
npm run dev       # http://localhost:3000
```

## ▲ Deploy ke Vercel

1. **Buat database gratis (Turso)** — direkomendasikan agar data persisten:
   ```bash
   npm i -g @libsql/turso 2>/dev/null
   turso db create pautin
   turso db show pautin --url          # → TURSO_DATABASE_URL
   turso db tokens create pautin       # → TURSO_AUTH_TOKEN
   ```
2. **Push ke GitHub**:
   ```bash
   git init && git add -A && git commit -m "pautin"
   ```
3. **Vercel**: vercel.com → *Add New Project* → import repo → framework terdeteksi otomatis (**Next.js**).
4. **Environment Variables** (Settings → Environment Variables):
   | Nama | Nilai |
   |---|---|
   | `TURSO_DATABASE_URL` | `libsql://pautin-xxx.turso.io` |
   | `TURSO_AUTH_TOKEN` | token dari langkah 1 |
5. Deploy 🎉 — Vercel otomatis menjalankan `next build`.

> Tanpa Turso pun tetap bisa deploy: Vercel memakai SQLite sementara per-instance (data
> hilang saat instance di-recycle) — cocok untuk demo, bukan produksi.

**Import via Vercel CLI:**
```bash
npm i -g vercel
vercel            # deploy preview
vercel --prod     # deploy production
```

### Akun demo (password: `demo123`)
`rizky` (kreator) · `nadia` (foodie) · `kopikita` (kedai kopi)

## 📁 Struktur

```
pautin-next/
├─ app/
│  ├─ layout.js / globals.css / icon.svg   # root layout, favicon
│  ├─ page.js                              # landing (SSR/static)
│  ├─ not-found.js
│  ├─ app/page.js + layout.js              # shell dashboard (SPA client)
│  ├─ u/[username]/page.js                 # halaman publik (SSR dinamis)
│  └─ api/                                 # route handlers:
│     ├─ register · login · logout · me · check
│     ├─ profile · settings · reorder
│     └─ links · links/[id] · links/click/[id]
├─ lib/
│  ├─ db.js        # klien libSQL (file: SQLite lokal ↔ Turso cloud), skema, seed demo, validasi
│  ├─ auth.js      # PBKDF2, sesi (cookie HttpOnly + fallback header X-Auth-Token)
│  └─ theme.js     # 8 tema, ikon sosial, render HTML halaman publik
├─ public/a/       # CSS & JS dashboard (SPA legacy, dimuat di /app)
├─ scripts/seed.js
└─ package.json    # next 15 · react 19 · @libsql/client
```

## 🔌 API

| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/register` / `/api/login` | daftar / masuk → cookie + `{token}` |
| POST | `/api/logout` | keluar |
| GET | `/api/me` | profil + links + statistik |
| GET | `/api/check?u=...` | cek username tersedia |
| PUT | `/api/profile` · `/api/settings` | ubah profil / tema |
| POST | `/api/links` · PUT/DELETE `/api/links/<id>` | kelola link |
| POST | `/api/links/click/<id>` | catat klik (publik) |
| POST | `/api/reorder` | simpan urutan |

Sesi otentikasi: cookie `pt_sid` (HttpOnly) **atau** header `X-Auth-Token` (fallback untuk
iframe preview yang memblokir cookie).

## 🛡 Keamanan
- Password PBKDF2-SHA256 120k iterasi + salt acak · perbandingan timing-safe
- Semua output user di-escape (anti-XSS) · SQL pakai parameter binding (anti-injection)
- Username divalidasi regex + daftar cadangan · validasi URL ketat · ownership link selalu dicek
- Dashboard `noindex` agar tidak muncul di hasil pencarian

## 📁 Lainnya
- `pautin-python-legacy/` — versi Python murni sebelumnya (tanpa dependency), tetap bisa
  dijalankan `python3 server.py` jika suatu saat ingin versi non-Node.
