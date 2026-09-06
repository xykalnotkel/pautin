// Kerangka halaman statis (legal/about) dengan identitas Pautin.
export const brand = {
  green: "#0F5B4D", cream: "#F7F3EA", paper: "#FFFCF5", ink: "#14231E",
  orange: "#E4572E", line: "#E6DECB", mute: "#66766F",
};

const Mark = ({ s = 30 }) => (
  <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden="true" style={{ borderRadius: s * 0.28, overflow: "hidden", flex: "0 0 auto" }}>
    <rect width="64" height="64" fill="#0F5B4D" />
    <g fill="none" stroke="#F7F0E3" strokeWidth="7" strokeLinecap="round">
      <rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)" />
      <rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)" />
    </g>
    <circle cx="45" cy="19" r="5" fill="#E4572E" />
  </svg>
);

export default function Shell({ title, kicker, children, lastUpdate }) {
  const { line, ink, mute } = brand;
  return (
    <>
      <style>{`
        .sh{min-height:100vh;background:radial-gradient(900px 480px at 88% -10%,rgba(15,91,77,.10),transparent 60%),#F7F3EA;display:flex;flex-direction:column}
        .shnav{position:sticky;top:0;z-index:20;background:rgba(247,243,234,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid ${line}}
        .shnav .in{max-width:900px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;gap:12px;justify-content:space-between}
        .shbrand{display:flex;align-items:center;gap:10px;font-weight:800;font-family:var(--font-sora),sans-serif;font-size:18px;letter-spacing:-.3px;color:${ink}}
        .shbody{flex:1;max-width:900px;margin:0 auto;padding:52px 22px 80px;width:100%}
        .shkick{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:${brand.orange}}
        .shh{font-family:var(--font-sora),sans-serif;font-size:clamp(30px,4.6vw,44px);letter-spacing:-1.2px;line-height:1.08;margin:14px 0 10px;color:${ink}}
        .shsub{color:${mute};font-size:16px;line-height:1.7;margin-bottom:34px}
        .prose{background:${brand.paper};border:1px solid ${line};border-radius:22px;padding:clamp(22px,4vw,44px);box-shadow:0 24px 60px -34px rgba(20,35,30,.35)}
        .prose h2{font-family:var(--font-sora),sans-serif;font-size:21px;letter-spacing:-.4px;color:${ink};margin:34px 0 10px;display:flex;align-items:center;gap:10px}
        .prose h2:first-child{margin-top:0}
        .prose p,.prose li{font-size:15px;line-height:1.85;color:#2c3b35}
        .prose ul{margin:8px 0 4px;padding-left:6px}
        .prose li{position:relative;padding-left:26px;margin:7px 0}
        .prose li::before{content:"";position:absolute;left:2px;top:12px;width:7px;height:7px;border-radius:2px;background:${brand.orange};transform:rotate(45deg)}
        .prose a{color:${brand.green};font-weight:800;text-decoration:underline;text-underline-offset:3px}
        .shdate{display:inline-block;margin-top:8px;font-size:12.5px;font-weight:700;color:${mute};background:#EFE9DB;border:1px solid ${line};padding:5px 12px;border-radius:999px}
        .shfoot{border-top:1px solid ${line};background:#F1EBDD}
        .shfoot .in{max-width:900px;margin:0 auto;padding:26px 22px;display:flex;flex-wrap:wrap;gap:10px 22px;align-items:center;justify-content:space-between;color:${mute};font-size:13.5px}
        .shfoot nav{display:flex;gap:18px;flex-wrap:wrap}
        .shfoot a{font-weight:700;color:${ink}}
        .shfoot a:hover{color:${brand.orange}}
        .btnp{display:inline-flex;align-items:center;gap:9px;background:#0F5B4D;color:#F7F0E3!important;font-weight:800;font-size:14px;padding:10px 20px;border-radius:999px;text-decoration:none!important;transition:.18s;box-shadow:0 10px 24px -12px rgba(15,91,77,.8)}
        .btnp:hover{transform:translateY(-1px);background:#0B4A3E}
      `}</style>
      <div className="sh">
        <header className="shnav">
          <div className="in">
            <a className="shbrand" href="/"><Mark s={30} />Pautin</a>
            <a className="btnp" href="/app?signup=1">Mulai gratis</a>
          </div>
        </header>
        <main className="shbody">
          <span className="shkick">{kicker}</span>
          <h1 className="shh">{title}</h1>
          <div className="shsub">{children && <span className="shdate">Versi berlaku: {lastUpdate}</span>}</div>
          <article className="prose">{children}</article>
        </main>
        <footer className="shfoot">
          <div className="in">
            <span>© 2026 Pautin · MIT License</span>
            <nav>
              <a href="/about">Tentang</a>
              <a href="/legal/terms">Ketentuan</a>
              <a href="/legal/privacy">Privasi</a>
              <a href="/legal/license">Lisensi</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
