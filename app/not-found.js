export default function NotFound() {
  return (
    <>
      <style>{`
        body{background:#0c0a1e;color:#f6f4ff;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;background-image:radial-gradient(800px 500px at 80% -10%,rgba(139,92,246,.4),transparent 60%)}
        .box{padding:30px}.big{font-size:64px}.h{font-size:22px;font-weight:800;margin:10px 0 6px}
        p{color:#a5a3c9;margin:0 0 22px;font-size:14.5px}
        a{display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;text-decoration:none;font-weight:700;padding:12px 26px;border-radius:999px;font-size:14.5px}
      `}</style>
      <div className="box">
        <div className="big">🧭</div>
        <div className="h">Halaman tidak ditemukan</div>
        <p>Username ini belum punya halaman Pautin, atau sudah dihapus.</p>
        <a href="/">Buat halamanmu sendiri →</a>
      </div>
    </>
  );
}
