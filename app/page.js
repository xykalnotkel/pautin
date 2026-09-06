const G = "#0F5B4D", DG = "#0B4A3E", OR = "#E4572E", CREAM = "#F7F3EA", PAPER = "#FFFCF5";
const INK = "#14231E", MUTE = "#5F6F68", LINE = "#E6DECB";

export const metadata = {
  title: "Pautin — Satu Link untuk Semua Tautanmu",
  description:
    "Buat halaman profil berisi semua tautanmu dalam satu link singkat. Gratis, cepat, tanpa ribet. Bagikan satu link untuk semuanya.",
  alternates: { canonical: "/" },
};

const P = { green: G, dark: DG, orange: OR, cream: CREAM, paper: PAPER, ink: INK, mute: MUTE, line: LINE };

const Mark = ({ s = 32 }) => (
  <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden="true" style={{ borderRadius: s * 0.3, overflow: "hidden", flex: "0 0 auto" }}>
    <rect width="64" height="64" fill={G} />
    <g fill="none" stroke="#F7F0E3" strokeWidth="7" strokeLinecap="round">
      <rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)" />
      <rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)" />
    </g>
    <circle cx="45" cy="19" r="5" fill={OR} />
  </svg>
);
const ic = (d, w = 16) => (
  <svg viewBox="0 0 24 24" width={w} height={w} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const I = {
  plus: ic(<><path d="M12 5v14M5 12h14" /></>),
  arrow: ic(<><path d="M4 12h16m-6-6 6 6-6 6" /></>),
  check: ic(<path d="m5 12.5 4.5 4.5L19 7.5" />),
  edit: ic(<path d="M16.8 3.6a2.3 2.3 0 0 1 3.3 3.3L7.5 19.5 3 21l1.5-4.5Z" />),
  up: ic(<path d="M7 17 17 7M9 7h8v8" />),
  user: ic(<><circle cx="9" cy="8.5" r="3.4" /><path d="M3 20a6 6 0 0 1 12 0" /></>),
  linkrow: ic(<><path d="M9.5 14.5a4.2 4.2 0 0 0 6 .6l2.6-2.6a4.24 4.24 0 0 0-6-6l-1.4 1.4" /><path d="M14.5 9.5a4.2 4.2 0 0 0-6-.6l-2.6 2.6a4.24 4.24 0 0 0 6 6l1.4-1.4" /></>, 15),
  heart: ic(<path d="M12 20.2s-7.5-4.4-9.2-9A5.3 5.3 0 0 1 12 6.6a5.3 5.3 0 0 1 9.2 4.6c-1.7 4.6-9.2 9-9.2 9z" />, 15),
  chat: ic(<path d="M21 11.8a8.6 8.6 0 0 1-8.6 8.6 9.6 9.6 0 0 1-3.4-.6L3 21.5l1.6-5.5A8.6 8.6 0 1 1 21 11.8z" />, 15),
  pin: ic(<><path d="M12 21.5s7-6.2 7-11.5a7 7 0 1 0-14 0c0 5.3 7 11.5 7 11.5z" /><circle cx="12" cy="9.8" r="2.6" /></>, 15),
  doc: ic(<><path d="M6 3.5h8L19 8.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3.5z" /><path d="M13.5 3.5V9H19" /></>, 15),
  mail: ic(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>, 15),
  play: ic(<><circle cx="12" cy="12" r="9" /><path d="M9.8 8.2v7.6l6.2-3.8z" /></>),
  drag: ic(<g fill="currentColor" stroke="none"><circle cx="8.5" cy="6" r="1.3"/><circle cx="8.5" cy="12" r="1.3"/><circle cx="8.5" cy="18" r="1.3"/><circle cx="15.5" cy="6" r="1.3"/><circle cx="15.5" cy="12" r="1.3"/><circle cx="15.5" cy="18" r="1.3"/></g>),
  eye: ic(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>),
  share: ic(<><circle cx="6" cy="12" r="2.6" /><circle cx="17.5" cy="5.5" r="2.6" /><circle cx="17.5" cy="18.5" r="2.6" /><path d="m8.6 11 6.5-4M8.6 13l6.5 4" /></>),
  shield: ic(<><path d="M12 3 4.5 5.8v5.4c0 4.6 3.2 8.3 7.5 9.8 4.3-1.5 7.5-5.2 7.5-9.8V5.8Z" /><path d="m9 11.6 2.2 2.2L15.4 9.5" /></>, 15),
};

function PhoneMock() {
  const rows = [
    [I.play ?? null, "Channel YouTube-ku"],
    [I.doc, "Tulisan di blog"],
    [I.heart, "Dukung karyaku"],
    [I.mail, "Hubungi aku"],
  ];
  return (
    <div style={{ position: "relative", maxWidth: 300, margin: "0 auto" }}>
      <div style={{ background: "#0B1F19", backgroundImage: "radial-gradient(420px 300px at 85% -5%,rgba(228,87,46,.35),transparent 60%),radial-gradient(400px 320px at -10% 110%,rgba(15,91,77,.55),transparent 62%)", borderRadius: 42, padding: 12, boxShadow: "0 46px 90px -34px rgba(11,30,25,.75),inset 0 0 0 2px rgba(255,255,255,.07)", transform: "rotate(2deg)" }}>
        <div style={{ borderRadius: 32, overflow: "hidden", background: "rgba(255,255,255,.03)" }}>
          <div style={{ height: 22, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <i style={{ width: 86, height: 14, borderRadius: 999, background: "rgba(255,255,255,.14)", display: "block" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 18px 24px", textAlign: "center" }}>
            <Mark s={58} />
            <div style={{ color: "#F7F0E3", fontWeight: 800, fontSize: 16.5, marginTop: 10, fontFamily: "var(--font-sora),sans-serif" }}>Rizky Pratama</div>
            <div style={{ color: "rgba(247,240,227,.55)", fontSize: 11.5, margin: "3px 0 4px" }}>@rizky</div>
            <div style={{ color: "rgba(247,240,227,.62)", fontSize: 11.5, lineHeight: 1.55, maxWidth: 215 }}>
              Developer dan kreator konten. Tips coding, teknologi, dan produktivitas.
            </div>
            <div style={{ display: "flex", gap: 9, margin: "15px 0 18px" }}>
              {["youtube", "article", "chat", "heart"].map((_, i) => (
                <span key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(247,240,227,.9)" }}>
                  {[I.heart, I.doc, I.chat, I.pin][i] || I.linkrow}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              {[I.play || I.linkrow, I.doc, I.heart, I.mail].map((icEl, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.075)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14, padding: "9px 13px", textAlign: "left" }}>
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(228,87,46,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F7F0E3" }}>{icEl}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "#F7F0E3", fontWeight: 600 }}>{rows[i][1]}</span>
                  <span style={{ color: "rgba(247,240,227,.4)" }}>{I.up}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.13)", color: "rgba(247,240,227,.7)", fontSize: 10.5, borderRadius: 999, padding: "5px 12px", marginTop: 18, fontFamily: "monospace" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7BC9A8", display: "inline-block" }} />
              pautin/u/rizky
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: -110, top: 108, background: "#fff", borderRadius: 16, boxShadow: "0 24px 50px -18px rgba(11,30,25,.4)", padding: "11px 14px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 10, animation: "floaty 4.5s ease-in-out infinite", border: `1px solid ${LINE}`, color: INK }}>
        <span style={{ color: G }}>{I.eye || I.check}</span>
        <span>Kunjungan baru<small style={{ display: "block", color: MUTE, fontWeight: 600, fontSize: 10.5 }}>+1 tampilan halaman</small></span>
      </div>
    </div>
  );
}

const faqs = [
  ["Apa bedanya Pautin dengan layanan sejenis?", "Secara konsep sama: satu halaman berisi banyak tautan. Pautin menekankan kecepatan, privasi, dan kesederhanaan — tanpa iklan, tanpa paket berbayar untuk fitur inti."],
  ["Apakah benar-benar gratis?", "Ya. Semua fitur yang tersedia sekarang — halaman profil, tautan tanpa batas, tema, statistik, dan QR — gratis sepenuhnya."],
  ["Bagaimana dengan keamanan akun?", "Kata sandi di-hash PBKDF2-SHA256 dengan garam acak. Formulir dilindungi verifikasi Cloudflare Turnstile dan pembatasan laju permintaan, serta halaman dilayani lewat jaringan anti-DDoS Cloudflare."],
  ["Bisakah mengganti username?", "Untuk saat ini username dipilih sekali saat mendaftar (3-20 huruf/angka kecil). Pilih yang mewakili dirimu."],
  ["Siapa pemilik data saya?", "Anda. Kami tidak menjual data. Rincian lengkap ada di halaman Kebijakan Privasi."],
];

export default function Landing() {
  return (
    <>
      <style>{`
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-weight:800;font-size:15px;color:#F7F0E3;background:${G};padding:13px 26px;border-radius:999px;transition:.2s;box-shadow:0 14px 30px -12px rgba(15,91,77,.75);letter-spacing:-.1px}
        .btn:hover{transform:translateY(-2px);background:${DG}}
        .btn.ghost{background:transparent;color:${INK};box-shadow:none;border:1.6px solid ${LINE}}
        .btn.ghost:hover{background:${PAPER}}
        .hero{background:radial-gradient(1000px 620px at 88% -14%,rgba(15,91,77,.14),transparent 62%),radial-gradient(760px 480px at -6% 40%,rgba(228,87,46,.09),transparent 60%)}
        @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .chipx{padding:8px 16px;border-radius:999px;background:#fff;border:1.5px solid ${LINE};font-size:12.5px;font-weight:800;color:${INK};display:inline-flex;align-items:center;gap:8px}
        .chipa{padding:8px 16px;border-radius:999px;background:${G};color:#F7F0E3;font-size:12.5px;font-weight:800;display:inline-flex;align-items:center;gap:8px;box-shadow:0 8px 20px -10px rgba(15,91,77,.8)}
        .secT{font-family:var(--font-sora),sans-serif;font-size:clamp(27px,3.6vw,40px);letter-spacing:-1.1px;font-weight:800;text-align:center;line-height:1.12}
        details.fq{border:1.5px solid ${LINE};background:${PAPER};border-radius:16px;overflow:hidden}
        details.fq summary{list-style:none;cursor:pointer;padding:17px 20px;font-weight:800;font-size:14.5px;color:${INK};display:flex;justify-content:space-between;gap:12px;align-items:center}
        details.fq summary::-webkit-details-marker{display:none}
        details.fq .pm{width:24px;height:24px;border-radius:50%;background:#EFE9DB;color:${G};display:flex;align-items:center;justify-content:center;flex:0 0 auto;transition:.25s;font-weight:800}
        details.fq[open] summary .pm{transform:rotate(45deg);background:${OR};color:#fff}
        details.fq .ab{padding:0 20px 18px;color:${MUTE};font-size:13.8px;line-height:1.75}
        @media(max-width:920px){.hero .grid{grid-template-columns:1fr!important;gap:64px;text-align:center}.hero .ctr{margin:0 auto}.hero .mid{justify-content:center}.steps{grid-template-columns:1fr!important}.floater{display:none}}
        @media(max-width:560px){.statsg{grid-template-columns:1fr 1fr!important}.phonew{transform:scale(.94)}}
      `}</style>
      <div style={{ minHeight: "100vh", background: CREAM, color: INK, overflowX: "hidden" }}>
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 60, background: "rgba(247,243,234,.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${LINE}` }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 19, fontFamily: "var(--font-sora),sans-serif", letterSpacing: "-.3px", color: INK }}>
              <Mark s={30} />Pautin
            </a>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <a href="/app" style={{ color: INK, fontWeight: 700, fontSize: 14, padding: "9px 16px", borderRadius: 999 }}>Masuk</a>
              <a href="/app?signup=1" className="btn" style={{ fontSize: 13.5, padding: "10px 20px" }}>Daftar Gratis</a>
            </div>
          </div>
        </nav>

        <header className="hero" style={{ paddingTop: 148 }}>
          <div className="grid" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 22px 90px", display: "grid", gridTemplateColumns: "1.02fr .98fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: PAPER, border: `1px solid ${LINE}`, borderRadius: 999, padding: "8px 15px", fontSize: 12.5, fontWeight: 800, color: INK, boxShadow: "0 8px 22px -14px rgba(11,30,25,.4)", marginBottom: 24 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: G, color: "#F7F0E3" }}>{I.check}</span>
                Gratis, tanpa iklan, data milikmu
              </div>
              <h1 style={{ fontFamily: "var(--font-sora),sans-serif", fontSize: "clamp(36px,5.4vw,62px)", lineHeight: 1.04, letterSpacing: "-2.2px", fontWeight: 800, margin: "0 0 8px" }}>
                Satu link.
                <br />
                <span style={{ color: G }}>Semua tautanmu.</span>
              </h1>
              <div style={{ height: 6, width: 96, background: OR, borderRadius: 999, margin: "18px 0 24px" }} />
              <p style={{ color: MUTE, fontSize: "clamp(15px,1.6vw,17.5px)", lineHeight: 1.75, maxWidth: 520, margin: "0 0 30px" }}>
                Halaman pribadi berisi semua tautan pentingmu — media sosial, toko, portofolio, donasi — dalam satu
                alamat singkat yang siap dibagikan ke mana saja.
              </p>
              <div className="mid" style={{ display: "flex", gap: 13, flexWrap: "wrap", marginBottom: 16 }}>
                <a href="/app?signup=1" className="btn">Buat Halaman Gratis {I.arrow}</a>
                <a href="/u/rizky" className="btn ghost">Lihat Contoh</a>
              </div>
              <p style={{ fontSize: 13, color: MUTE, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: G }}>{I.shield}</span> Dilindungi Cloudflare · PBKDF2 · anti-bot Turnstile
              </p>
            </div>
            <div className="phonew"><PhoneMock /></div>
          </div>
        </header>

        <section style={{ background: "#1A2E27", color: "#F7F0E3", padding: "26px 0" }}>
          <div className="statsg" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 22px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, textAlign: "center" }}>
            {[["100%", "gratis & tanpa iklan"], ["±10 detik", "langsung jadi"], ["Tanpa batas", "jumlah tautan"], ["3 lapis", "perlindungan akun"]].map(([v, k]) => (
              <div key={k}>
                <div style={{ fontFamily: "var(--font-sora),sans-serif", fontWeight: 800, fontSize: 25, letterSpacing: -1, color: "#F7F0E3" }}>{v}</div>
                <div style={{ color: "rgba(247,240,227,.6)", fontSize: 13, fontWeight: 600 }}>{k}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "96px 22px" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <h2 className="secT">Kelola semudah menyeret kartu</h2>
            <p style={{ color: MUTE, textAlign: "center", margin: "14px auto 52px", maxWidth: 560, fontSize: 15.5, lineHeight: 1.75 }}>
              Tambah tautan, susun urutannya, pantau statistik — semua dari dashboard pribadimu.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
              <span className="chipa">{I.plus} Tambah Tautan</span>
              <span className="chipx">{I.edit} Edit dan Hapus</span>
              <span className="chipx">{I.drag || I.up} Seret untuk Urutkan</span>
              <span className="chipx">{I.eye ? I.eye : I.linkrow} Lihat Halaman</span>
            </div>
            <div style={{ maxWidth: 620, margin: "0 auto", background: PAPER, border: `1.5px solid ${LINE}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 90px -40px rgba(11,30,25,.5)" }}>
              <div style={{ display: "flex", gap: 8, padding: "13px 18px", background: "#F1EBDD", borderBottom: `1px solid ${LINE}` }}>
                <i style={{ width: 11, height: 11, borderRadius: "50%", background: "#E4572E" }} /><i style={{ width: 11, height: 11, borderRadius: "50%", background: "#E9A13B" }} /><i style={{ width: 11, height: 11, borderRadius: "50%", background: "#3E9E7B" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${LINE}`, fontSize: 12, color: MUTE }}>
                <span style={{ fontWeight: 700, color: INK }}>Halaman siap dibagikan</span>
                <span style={{ fontFamily: "monospace", background: "#F1EBDD", border: `1px solid ${LINE}`, padding: "4px 10px", borderRadius: 999, color: G, fontWeight: 800 }}>pautin/u/username-mu</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: 18 }}>
                {[["youtube", "Channel YouTube-ku", "812 klik"], ["article", "Tulisan di blog", "543 klik"], ["heart", "Dukung karyaku", "77 klik"]].map(([k, t, c]) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1.5px solid ${LINE}`, borderRadius: 14, background: "#fff" }}>
                    <span style={{ color: "#B9AE97" }}>{I.drag ? I.drag : I.up}</span>
                    <span style={{ width: 38, height: 38, borderRadius: 12, background: "#F1EBDD", color: G, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {k === "youtube" ? (I.play || I.linkrow) : k === "article" ? I.doc : I.heart}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t}</span>
                      <span style={{ color: MUTE, fontSize: 11.5 }}>{c} · video / artikel / dukungan</span>
                    </span>
                    <span style={{ color: "#B9AE97" }}>{I.up}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, border: `2px dashed #C9BC9C`, borderRadius: 14, padding: 12, color: G, fontSize: 13.5, fontWeight: 800, background: "#FFFDF8" }}>
                  {I.plus} Tambah tautan baru…
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: "#F1EBDD", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "96px 22px" }}>
            <h2 className="secT">Cara pakainya</h2>
            <div className="steps" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 48 }}>
              {[
                [I.user, "Pilih username", "Daftar gratis dan ambil alamat unik: pautin/u/username-mu. Cek ketersediaannya langsung saat mengetik."],
                [I.linkrow, "Isi semua tautanmu", "Tambah judul, tautan, dan ikon. Media sosial terdeteksi otomatis dan tampil sebagai ikon bulat."],
                [I.share ? I.share : I.up, "Bagikan satu link", "Salin, bagikan ke WhatsApp atau media sosial, atau cetak QR code untuk kartu namamu."],
              ].map(([icEl, h, p], i) => (
                <div key={h} style={{ background: PAPER, border: `1.5px solid ${LINE}`, borderRadius: 22, padding: "30px 26px", position: "relative", boxShadow: "0 18px 40px -30px rgba(11,30,25,.4)" }}>
                  <span style={{ position: "absolute", top: -16, left: 24, width: 34, height: 34, borderRadius: "50%", background: OR, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sora),sans-serif", fontWeight: 800, fontSize: 15, boxShadow: "0 10px 20px -8px rgba(228,87,46,.8)" }}>{i + 1}</span>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "#E4EFEA", color: G, display: "flex", alignItems: "center", justifyContent: "center", margin: "2px 0 16px" }}>{icEl}</div>
                  <h3 style={{ fontFamily: "var(--font-sora),sans-serif", fontSize: 17, marginBottom: 8, letterSpacing: "-.3px" }}>{h}</h3>
                  <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.7 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "40px 22px 96px", maxWidth: 800, margin: "0 auto" }}>
          <h2 className="secT">Pertanyaan umum</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40 }}>
            {faqs.map(([q, a]) => (
              <details className="fq" key={q}>
                <summary>{q}<span className="pm">+</span></summary>
                <div className="ab">{a}</div>
              </details>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "0 22px 100px" }}>
          <div style={{ background: "linear-gradient(135deg,#0B4A3E,#123F35)", borderRadius: 30, padding: "76px 30px", textAlign: "center", position: "relative", overflow: "hidden", color: "#F7F0E3" }}>
            <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(228,87,46,.4),transparent)", top: -280, left: -140 }} />
            <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(255,255,255,.12),transparent)", bottom: -240, right: -110 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Mark s={64} />
              <h2 style={{ fontFamily: "var(--font-sora),sans-serif", fontSize: "clamp(26px,3.6vw,40px)", letterSpacing: "-1.2px", margin: "22px 0 12px", fontWeight: 800 }}>Siap punya halaman sendiri?</h2>
              <p style={{ color: "rgba(247,240,227,.72)", maxWidth: 460, margin: "0 auto 30px", fontSize: 15.5, lineHeight: 1.75 }}>
                Daftar sekarang, gratis. Ambil username favoritmu sebelum kehabisan.
              </p>
              <a href="/app?signup=1" className="btn" style={{ background: OR, boxShadow: "0 16px 36px -12px rgba(228,87,46,.9)" }}>Mulai Sekarang {I.arrow}</a>
            </div>
          </div>
        </section>

        <footer style={{ borderTop: `1px solid ${LINE}`, background: "#F1EBDD", padding: "34px 22px 40px" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "space-between", alignItems: "center", color: MUTE, fontSize: 13.5 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, fontFamily: "var(--font-sora),sans-serif", fontSize: 16, color: INK }}>
              <Mark s={26} />Pautin
            </a>
            <nav style={{ display: "flex", gap: 18, flexWrap: "wrap", fontWeight: 700 }}>
              <a href="/about" style={{ color: INK }}>Tentang</a>
              <a href="/legal/terms" style={{ color: INK }}>Ketentuan</a>
              <a href="/legal/privacy" style={{ color: INK }}>Privasi</a>
              <a href="/legal/license" style={{ color: INK }}>Lisensi</a>
            </nav>
            <span>© 2026 Pautin — MIT License</span>
          </div>
        </footer>
      </div>
    </>
  );
}
