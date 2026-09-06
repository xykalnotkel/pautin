import { db } from "@/lib/db";
import { hashVerifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Atur ulang kata sandi — Pautin",
  robots: { index: false, follow: false },
};

const css = `
.rfwrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:radial-gradient(700px 460px at 88% -10%,rgba(228,87,46,.10),transparent 60%),#F7F3EA}
.rfcard{background:#fff;border:1.5px solid #E5DCC7;border-radius:24px;max-width:430px;width:100%;padding:38px 32px;text-align:center;box-shadow:0 44px 100px -46px rgba(27,43,36,.5)}
.rfcard h1{font-family:var(--font-sora),sans-serif;font-size:21px;color:#16382F;margin-bottom:10px;font-weight:800}
.rfcard p{font-size:14px;color:#55635C;line-height:1.7;margin:0}
.rfin{width:100%;box-sizing:border-box;margin-top:20px;border:1.5px solid #E3D9C2;background:#FBF8F1;border-radius:14px;padding:13px 15px;font-size:15px;font-family:inherit;color:#16382F;outline:none;transition:.15s;text-align:left}
.rfin:focus{border-color:#0F5B4D;background:#fff;box-shadow:0 0 0 4px rgba(15,91,77,.12)}
.rfin ~ .rfhint{display:none}
.rfbtn{display:block;width:100%;margin-top:16px;background:#E4572E;color:#fff;font-weight:800;font-size:15px;padding:13px;border:0;border-radius:999px;cursor:pointer;font-family:inherit;transition:.15s}
.rfbtn:hover{background:#CE4A24}.rfbtn:disabled{opacity:.55;cursor:default}
.rferr{color:#C2410C;background:#FDF1EC;border:1px solid #F3D5C9;border-radius:12px;font-size:13px;margin-top:16px;padding:9px 13px;text-align:left;display:none;font-weight:600}
.rferr.show{display:block}
.rfmeta{font-size:12.5px;color:#8B8575;margin-top:14px;text-align:left;line-height:1.7}
.rfmeta b.on{color:#0F5B4D}
.rfcta{display:inline-block;margin-top:24px;background:#0F5B4D;color:#F7F0E3;font-weight:800;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:999px;transition:.15s}
.rfcta:hover{background:#0D4A3E}
.rflnk{color:#0F5B4D;font-weight:800;text-decoration:none;display:inline-block;margin-top:22px;font-size:14px}
`;

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

async function tokenState(rawToken) {
  const t = String(rawToken || "").trim();
  if (!t || t.length > 200) return "invalid";
  const hash = hashVerifyToken(t);
  const r = await db.execute({
    sql: "SELECT id FROM users WHERE rtok=? AND rexp>?",
    args: [hash, Math.floor(Date.now() / 1000)],
  });
  return r.rows[0] ? "valid" : "invalid";
}

export default async function ResetPage({ searchParams }) {
  const sp = await searchParams;
  const t = String(sp.t || "").trim();
  const state = await tokenState(t);

  if (state !== "valid") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="rfwrap">
          <div className="rfcard">
            {LogoIco}
            <h1>Tautan tidak valid atau kedaluwarsa.</h1>
            <p>Tautan atur ulang kata sandi berlaku 1 jam dan sekali pakai. Minta tautan baru dari halaman masuk.</p>
            <a className="rflnk" href="/app">Ke halaman masuk</a>
          </div>
        </div>
      </>
    );
  }

  const js = `(function(){
  var err=document.getElementById("rfErr"),okBox=document.getElementById("okBox"),card=document.getElementById("card");
  function show(m){err.textContent=m;err.classList.add("show");}
  function refresh(){var p=document.getElementById("p1").value,p2=document.getElementById("p2").value;
    document.getElementById("cLen").classList.toggle("on",p.length>=8);
    document.getElementById("cNum").classList.toggle("on",/\d/.test(p));
    document.getElementById("cMix").classList.toggle("on",/[a-z]/.test(p)&&/[A-Z]/.test(p));}
  document.getElementById("p1").addEventListener("input",refresh);
  document.getElementById("p2").addEventListener("input",refresh);
  document.getElementById("f").addEventListener("submit",async function(ev){
    ev.preventDefault();var btn=document.getElementById("go");if(btn.disabled)return;err.classList.remove("show");
    var p=document.getElementById("p1").value,p2=document.getElementById("p2").value;
    if(p.length<8)return show("Kata sandi minimal 8 karakter.");
    if(!/\d/.test(p))return show("Kata sandi harus mengandung minimal satu angka.");
    if(!/[a-z]/.test(p)||!/[A-Z]/.test(p))return show("Kata sandi harus punya huruf kecil dan besar.");
    if(p!==p2)return show("Ulangi kata sandi tidak sama.");
    btn.disabled=true;btn.textContent="Menyimpan…";
    try{
      var r=await fetch("/api/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({t:${JSON.stringify(t)},password:p})});
      var j=await r.json();
      if(!r.ok)throw new Error(j.error||"Gagal menyimpan.");
      card.style.display="none";okBox.style.display="block";
    }catch(x){show(x.message);btn.disabled=false;btn.textContent="Simpan kata sandi baru";}
  });
})();`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="rfwrap">
        <div className="rfcard" id="card">
          {LogoIco}
          <h1>Buat kata sandi baru</h1>
          <p>Pilih kata sandi baru untuk akunmu. Setelah disimpan, gunakan untuk masuk ke dashboard.</p>
          <div className="rferr" id="rfErr"></div>
          <form id="f" autoComplete="off">
            <input className="rfin" id="p1" type="password" autoComplete="new-password" placeholder="Kata sandi baru" style={{ marginTop: 20 }} />
            <input className="rfin" id="p2" type="password" autoComplete="new-password" placeholder="Ulangi kata sandi" style={{ marginTop: 10 }} />
            <div className="rfmeta" id="rfMeta">
              <span id="cLen">8+ karakter</span> • <span id="cNum">angka</span> • <span id="cMix">huruf kecil &amp; besar</span>
            </div>
            <button className="rfbtn" id="go" type="submit">Simpan kata sandi baru</button>
          </form>
        </div>
        <div className="rfcard" id="okBox" style={{ display: "none" }}>
          {LogoIco}
          <h1>Kata sandi disimpan.</h1>
          <p>Sekarang masuk dengan kata sandi barumu untuk mengelola halaman Pautin-mu.</p>
          <a className="rfcta" href="/app">Masuk ke dashboard</a>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: js }} />
    </>
  );
}
