import { db } from "@/lib/db";
import { hashVerifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Verifikasi email — Pautin",
  robots: { index: false, follow: false },
};

async function verify(rawToken) {
  const t = String(rawToken || "").trim();
  if (!t || t.length > 200) return "invalid";
  const hash = hashVerifyToken(t);
  const r = await db.execute({
    sql: "SELECT id FROM users WHERE vtoken=? AND vexp>?",
    args: [hash, Math.floor(Date.now() / 1000)],
  });
  const u = r.rows[0];
  if (!u) return "invalid";
  await db.execute({
    sql: "UPDATE users SET email_verified=1, vtoken='', vexp=0 WHERE id=? AND vtoken=?",
    args: [Number(u.id), hash],
  });
  const chk = await db.execute({ sql: "SELECT email_verified FROM users WHERE id=?", args: [Number(u.id)] });
  return Number(chk.rows[0]?.email_verified) === 1 ? "ok" : "invalid";
}

const css = `
.vfwrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:radial-gradient(700px 460px at 88% -10%,rgba(228,87,46,.10),transparent 60%),#F7F3EA}
.vfcard{background:#fff;border:1.5px solid #E5DCC7;border-radius:24px;max-width:430px;width:100%;padding:38px 32px;text-align:center;box-shadow:0 44px 100px -46px rgba(27,43,36,.5)}
.vfcard h1{font-family:var(--font-sora),sans-serif;font-size:21px;color:#16382F;margin-bottom:10px;font-weight:800}
.vfcard p{font-size:14px;color:#55635C;line-height:1.7}
.vfbadge{display:inline-flex;align-items:center;gap:8px;background:#E9F4EE;color:#0F5B4D;font-weight:800;font-size:12.5px;padding:7px 14px;border-radius:999px;margin-bottom:16px}
.vficon{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.vf-ok .vficon{background:#E9F4EE;color:#0F5B4D}
.vf-bad .vficon{background:#FBE8E3;color:#E4572E}
.vfcta{display:inline-block;margin-top:22px;background:#0F5B4D;color:#F7F0E3;font-weight:800;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:999px;transition:.15s}
.vfcta:hover{background:#0D4A3E}
.vflnk{color:#0F5B4D;font-weight:800;text-decoration:none;display:inline-block;margin-top:22px;font-size:14px}
`;

const CheckIco = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
const BadgeIco = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.4v.1" /></svg>
);
const LogoIco = (
  <svg viewBox="0 0 64 64" width="44" height="44" style={{ borderRadius: 13, overflow: "hidden", display: "block", margin: "0 auto 18px" }} aria-hidden="true">
    <rect width="64" height="64" fill="#0F5B4D" />
    <g fill="none" stroke="#F7F0E3" strokeWidth="6.5" strokeLinecap="round">
      <rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)" />
      <rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)" />
    </g>
    <circle cx="45" cy="19" r="4.8" fill="#E4572E" />
  </svg>
);

export default async function VerifyPage({ searchParams }) {
  const sp = await searchParams;
  const ok = (await verify(sp.t)) === "ok";
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className={"vfwrap"}>
        <div className={"vfcard" + (ok ? " vf-ok" : " vf-bad")}>
          {LogoIco}
          {ok ? (
            <>
              <div className="vfbadge">{CheckIco} Email terverifikasi</div>
              <h1>Akunmu aktif.</h1>
              <p>Email berhasil dikonfirmasi. Sekarang kamu bisa masuk dan mengelola halaman Pautin-mu.</p>
              <a className="vfcta" href="/dashboard">Masuk ke dashboard</a>
            </>
          ) : (
            <>
              <div className="vficon">{BadgeIco}</div>
              <h1>Tautan tidak valid atau kedaluwarsa.</h1>
              <p>Tautan verifikasi berlaku 24 jam dan sekali pakai. Minta tautan baru dari halaman masuk.</p>
              <a className="vflnk" href="/dashboard">Ke halaman masuk</a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
