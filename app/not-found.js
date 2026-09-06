export default function NotFound() {
  return (
    <>
      <style>{`
        body{background:#0B1F19;color:#F7F0E3;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;background-image:radial-gradient(760px 480px at 80% -10%,rgba(228,87,46,.3),transparent 60%),radial-gradient(600px 400px at -8% 110%,rgba(15,91,77,.5),transparent 62%)}
        .box{padding:30px;max-width:520px}
        svg{animation:drift 3s ease-in-out infinite}
        @keyframes drift{50%{transform:translateY(-8px)}}
        .h{font-size:24px;font-weight:800;margin:18px 0 8px;font-family:var(--font-sora),sans-serif;letter-spacing:-.5px}
        p{color:rgba(247,240,227,.68);margin:0 0 26px;font-size:14.5px;line-height:1.7}
        a{display:inline-flex;align-items:center;gap:9px;background:#E4572E;color:#fff;text-decoration:none;font-weight:800;padding:12px 26px;border-radius:999px;font-size:14.5px;transition:.2s}
        a:hover{transform:translateY(-2px)}
      `}</style>
      <div className="box">
        <svg viewBox="0 0 64 64" width="74" height="74" style={{ borderRadius: 20, overflow: "hidden" }} aria-hidden="true">
          <rect width="64" height="64" fill="#0F5B4D" />
          <g fill="none" stroke="#F7F0E3" strokeWidth="6" strokeLinecap="round">
            <rect x="17" y="17" width="21" height="21" rx="8" transform="rotate(45 27.5 27.5)" />
            <rect x="28" y="28" width="21" height="21" rx="8" transform="rotate(-45 38.5 38.5)" />
          </g>
          <circle cx="44.5" cy="19.5" r="4.6" fill="#E4572E" />
        </svg>
        <div className="h">Halaman tidak ditemukan</div>
        <p>Username ini belum punya halaman Pautin, atau alamat yang kamu buka salah ketik.</p>
        <a href="/">Kembali ke beranda</a>
      </div>
    </>
  );
}
