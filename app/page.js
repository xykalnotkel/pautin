const GRAD = "linear-gradient(135deg,#7c3aed,#db2777)";
const INK = "#16121f", MUTE = "#6a6480", SOFT = "#f4f1fb", LINE = "#e6e1f2", VIOLET = "#7c3aed";

export const metadata = {
  title: "Pautin — Satu Link untuk Semua Tautanmu",
  description:
    "Buat halaman profil berisi semua tautanmu dalam satu link singkat. Gratis, cepat, tanpa ribet. Bagikan satu link untuk semuanya.",
  alternates: { canonical: "/" },
};

const Logo = ({ w = 17, h = 17, lw = 30 }) => (
  <svg viewBox="0 0 64 64" width={w} height={h} fill="none" stroke="#fff" strokeWidth={lw / 4} strokeLinecap="round">
    <path d="M24 42 40 26M27 27h9v9" />
  </svg>
);
const Box = ({ s = 34, r = 10 }) => (
  <span className="logo" style={{ width: s, height: s, borderRadius: r, background: GRAD, display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px -6px rgba(124,58,237,.6)" }}>
    <Logo w={s * 0.53} h={s * 0.53} />
  </span>
);

export default function Landing() {
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", background: "rgba(255,255,255,.75)", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 19, letterSpacing: "-.3px" }}>
            <Box />Pautin
          </a>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <a href="/app" style={{ color: "#4c4560", fontWeight: 700, fontSize: 14, padding: "9px 16px", borderRadius: 999 }}>Masuk</a>
            <a href="/app?signup=1" className="btn" style={{ fontSize: 13.5, padding: "10px 20px" }}>Daftar Gratis</a>
          </div>
        </div>
      </nav>

      <style>{`
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;font-size:15px;color:#fff;background:${GRAD};padding:13px 26px;border-radius:999px;border:none;cursor:pointer;transition:.22s;box-shadow:0 10px 26px -10px rgba(124,58,237,.65)}
        .btn:hover{transform:translateY(-2px);box-shadow:0 16px 34px -12px rgba(124,58,237,.7)}
        .btn.ghost{background:transparent;color:#4c4560;box-shadow:none;border:1.5px solid ${LINE}}
        .btn.ghost:hover{background:${SOFT};box-shadow:none}
        .hero{background:radial-gradient(1000px 560px at 88% -12%,rgba(124,58,237,.16),transparent 62%),radial-gradient(800px 500px at -8% 34%,rgba(219,39,119,.10),transparent 60%)}
        @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      `}</style>

      <header className="hero">
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "150px 26px 96px", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 54, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 999, padding: "8px 15px", fontSize: 12.5, fontWeight: 700, color: "#4c4560", boxShadow: "0 8px 22px -12px rgba(60,20,120,.25)", marginBottom: 22 }}>
              <span style={{ background: GRAD, color: "#fff", borderRadius: 999, padding: "2px 9px", fontSize: 11, fontWeight: 800 }}>Baru ✨</span>
              100% gratis & tanpa iklan — selamanya
            </div>
            <h1 style={{ fontSize: "clamp(34px,5vw,56px)", lineHeight: 1.07, letterSpacing: "-1.6px", fontWeight: 800 }}>
              Satu link.
              <br />
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Semua tautanmu.</span>
            </h1>
            <p style={{ color: MUTE, fontSize: "clamp(15px,1.6vw,17.5px)", lineHeight: 1.7, margin: "20px 0 28px", maxWidth: 520 }}>
              Buat halaman profil berisi semua link pentingmu — media sosial, toko, portofolio, atau donasi — dalam satu
              tautan singkat yang gampang dibagikan ke mana saja.
            </p>
            <div style={{ display: "flex", gap: 13, flexWrap: "wrap" }}>
              <a href="/app?signup=1" className="btn">Buat Halaman Gratis <Logo w={15} h={15} /></a>
              <a href="/u/rizky" className="btn ghost">Lihat Contoh Halaman</a>
            </div>
            <p style={{ marginTop: 18, fontSize: 13, color: "#948da8" }}>
              Gratis daftar · <b style={{ color: "#5b5470" }}>tanpa kartu kredit</b> · pasang di bio IG, WhatsApp, dan lainnya
            </p>
          </div>

          <div style={{ position: "relative", maxWidth: 300, margin: "0 auto" }}>
            <div style={{ background: "#0c0a1e", backgroundImage: "radial-gradient(420px 300px at 85% -5%,rgba(139,92,246,.5),transparent 60%),radial-gradient(400px 320px at -10% 110%,rgba(236,72,153,.28),transparent 62%)", borderRadius: 42, padding: 12, boxShadow: "0 40px 80px -30px rgba(76,29,149,.55),inset 0 0 0 2px rgba(255,255,255,.06)", transform: "rotate(2.5deg)" }}>
              <div style={{ borderRadius: 32, overflow: "hidden", background: "rgba(255,255,255,.03)" }}>
                <div style={{ height: 22, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <i style={{ width: 86, height: 14, borderRadius: 999, background: "rgba(255,255,255,.16)", display: "block" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 18px 24px", textAlign: "center" }}>
                  <div style={{ width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#f472b6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 21, color: "#fff", boxShadow: "0 0 0 5px rgba(167,139,250,.25)", marginBottom: 12 }}>RP</div>
                  <div style={{ color: "#f6f4ff", fontWeight: 800, fontSize: 16.5 }}>Rizky Pratama</div>
                  <div style={{ color: "rgba(246,244,255,.55)", fontSize: 11.5, margin: "3px 0 6px" }}>@rizky</div>
                  <div style={{ color: "rgba(246,244,255,.6)", fontSize: 11.5, lineHeight: 1.5, maxWidth: 210 }}>Developer &amp; kreator konten 🚀 Tips coding, teknologi, dan produktivitas.</div>
                  <div style={{ display: "flex", gap: 9, margin: "14px 0 18px" }}>
                    {["🎬", "📝", "☕", "📷"].map((e, i) => (
                      <span key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{e}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                    {[["🎬", "Channel YouTube-ku"], ["📝", "Tulisan di blog"], ["☕", "Traktir kopi"], ["📧", "Hubungi aku"]].map(([e, t]) => (
                      <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 14, padding: "9px 13px" }}>
                        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(167,139,250,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{e}</span>
                        <span style={{ flex: 1, fontSize: 12, color: "#f6f4ff", fontWeight: 600, textAlign: "left" }}>{t}</span>
                        <span style={{ color: "rgba(246,244,255,.4)", fontSize: 11 }}>↗</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.13)", color: "rgba(246,244,255,.65)", fontSize: 10, borderRadius: 999, padding: "4px 11px", marginTop: 18 }}>🔗 pautin/u/rizky</div>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", left: -118, top: 110, background: "#fff", borderRadius: 16, boxShadow: "0 24px 50px -18px rgba(76,29,149,.35)", padding: "11px 15px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 9, animation: "floaty 4.5s ease-in-out infinite", border: `1px solid ${LINE}` }}>
              <span style={{ fontSize: 17 }}>📲</span>
              <span>Link dibuka!<small style={{ display: "block", color: MUTE, fontWeight: 600, fontSize: 10.5 }}>+1 kunjungan baru</small></span>
            </div>
            <div style={{ position: "absolute", right: -100, top: 300, background: "#fff", borderRadius: 16, boxShadow: "0 24px 50px -18px rgba(76,29,149,.35)", padding: "11px 15px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 9, animation: "floaty 4.5s ease-in-out infinite", animationDelay: "2.2s", border: `1px solid ${LINE}` }}>
              <span style={{ fontSize: 17 }}>✨</span>
              <span>Tema Galaksi aktif<small style={{ display: "block", color: MUTE, fontWeight: 600, fontSize: 10.5 }}>8 tema siap dipakai</small></span>
            </div>
          </div>
        </div>
      </header>

      <section style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, background: "#fcfbff", padding: "34px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 26px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, textAlign: "center" }}>
          {[["100%", "gratis & tanpa iklan"], ["±10 detik", "langsung jadi"], ["∞", "link tanpa batas"], ["8 tema", "sesuai seleramu"]].map(([v, k]) => (
            <div key={k}>
              <b style={{ display: "block", fontSize: 27, fontWeight: 800, letterSpacing: -1 }}>{v}</b>
              <span style={{ color: MUTE, fontSize: 13.5, fontWeight: 600 }}>{k}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "96px 0", background: SOFT }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 26px" }}>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", letterSpacing: "-1.1px", lineHeight: 1.15, fontWeight: 800, textAlign: "center" }}>Kelola semudah menyeret kartu</h2>
          <p style={{ color: MUTE, textAlign: "center", margin: "14px auto 54px", maxWidth: 560, fontSize: 15.5, lineHeight: 1.7 }}>
            Tambah link, susun urutannya pakai drag &amp; drop, pantau statistik klik — semua dari dashboard pribadimu.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            {["➕ Tambah Link", "✏️ Edit & Hapus", "⠿ Seret untuk Urutkan", "👁 Lihat Halaman", "🔗 Bagikan"].map((c, i) => (
              <span key={c} style={i === 0 ? { background: GRAD, color: "#fff", boxShadow: "0 8px 20px -8px rgba(124,58,237,.7)", padding: "7px 15px", borderRadius: 999, fontSize: 12.5, fontWeight: 700 } : { padding: "7px 15px", borderRadius: 999, background: "#fff", border: `1px solid ${LINE}`, fontSize: 12.5, fontWeight: 700, color: "#4c4560" }}>{c}</span>
            ))}
          </div>
          <div style={{ maxWidth: 560, margin: "0 auto", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 70px -30px rgba(76,29,149,.25)" }}>
            <div style={{ display: "flex", gap: 8, padding: "14px 18px", background: "#faf9fd", borderBottom: `1px solid ${LINE}` }}>
              <i style={{ width: 11, height: 11, borderRadius: "50%", background: "#f87171" }} /><i style={{ width: 11, height: 11, borderRadius: "50%", background: "#fbbf24" }} /><i style={{ width: 11, height: 11, borderRadius: "50%", background: "#34d399" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${LINE}`, fontSize: 12, color: MUTE }}>
              <span style={{ fontWeight: 700, color: "#4c4560", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Halamanmu siap dibagikan 👉</span>
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 800 }}>pautin/u/username-mu</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 18 }}>
              {[["🎬", "Channel YouTube-ku", "youtube", "812 klik"], ["📝", "Tulisan di blog", "medium", "543 klik"], ["☕", "Traktir kopi", "saweria", "77 klik"], ["📧", "Hubungi aku", "mail", "34 klik"]].map(([e, t, k, c]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 13px", border: `1.5px solid ${LINE}`, borderRadius: 14 }}>
                  <span style={{ color: "#c9c3da", fontSize: 11 }}>⠿</span>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{e}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
                      {t}<small style={{ fontSize: 9.5, background: SOFT, color: VIOLET, fontWeight: 800, padding: "2px 7px", borderRadius: 999, textTransform: "uppercase", letterSpacing: .4 }}>{k}</small>
                    </span>
                  </span>
                  <span style={{ color: "#c9c3da", fontSize: 11.5, fontWeight: 700 }}>{c}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "2px dashed #d8d1ec", borderRadius: 14, padding: 11, color: VIOLET, fontSize: 13, fontWeight: 800, background: "#fdfcff" }}>➕ Tambah link baru…</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 26px" }}>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", letterSpacing: "-1.1px", lineHeight: 1.15, fontWeight: 800, textAlign: "center" }}>Cara pakainya gampang</h2>
          <p style={{ color: MUTE, textAlign: "center", margin: "14px auto 54px", maxWidth: 560, fontSize: 15.5, lineHeight: 1.7 }}>Tiga langkah, dan link-mu siap dibagikan.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, position: "relative" }}>
            {[
              ["📝", "Daftar & pilih username", "Daftar gratis dengan username keren. Halamanmu langsung dapat alamat unik: pautin/u/username-mu."],
              ["🔗", "Tambah semua tautanmu", "Isi judul + URL — Instagram, WhatsApp, tokomu, portofolio, apa saja. Emoji & label otomatis."],
              ["📣", "Bagikan satu link saja", "Salin link unikmu, pasang di bio IG, profil TikTok, kartu nama, atau grup WA."],
            ].map(([e, h, p], i) => (
              <div key={h} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 20, padding: "28px 24px", position: "relative", boxShadow: "0 8px 28px -18px rgba(76,29,149,.2)" }}>
                <span style={{ position: "absolute", top: -15, left: 22, width: 34, height: 34, borderRadius: "50%", background: GRAD, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, boxShadow: "0 8px 18px -6px rgba(124,58,237,.6)" }}>{i + 1}</span>
                <div style={{ fontSize: 27, margin: "6px 0 12px" }}>{e}</div>
                <h3 style={{ fontSize: 16.5, marginBottom: 8 }}>{h}</h3>
                <p style={{ color: MUTE, fontSize: 13.8, lineHeight: 1.65 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 26px" }}>
          <div style={{ background: "linear-gradient(135deg,#2a1b4e,#4a1d3f)", borderRadius: 30, padding: "74px 30px", textAlign: "center", position: "relative", overflow: "hidden", color: "#fff" }}>
            <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(124,58,237,.5),transparent)", top: -260, left: -120 }} />
            <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(219,39,119,.4),transparent)", bottom: -220, right: -100 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", letterSpacing: "-1.1px", fontWeight: 800, color: "#fff" }}>Siap punya halaman sendiri?</h2>
              <p style={{ color: "rgba(255,255,255,.75)", margin: "14px auto 30px", maxWidth: 460, fontSize: 15.5, lineHeight: 1.7 }}>
                Daftar sekarang, gratis. Ambil username favoritmu sebelum kehabisan! 🏃
              </p>
              <a href="/app?signup=1" className="btn">🚀 Daftar Gratis Sekarang</a>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${LINE}`, padding: "34px 0 40px", background: "#fcfbff" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 26px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", color: MUTE, fontSize: 13 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, fontSize: 16, color: INK }}><Box s={26} r={8} />Pautin</a>
          <span>Dibuat dengan ❤️ untuk semua yang mau berbagi tautan · Next.js siap Vercel</span>
        </div>
      </footer>
    </>
  );
}
