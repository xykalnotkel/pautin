/* Pautin — dashboard (client). Ikon SVG asli via /a/icons.js (window.PTIcons). */
"use strict";
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const rootEl = () => document.getElementById("rootEl");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ================= state ================= */
const S = { u: null, links: [], totalClicks: 0, showAdd: false, editing: null, iconKey: "" };
const ic = (k) => (window.PTIcons && PTIcons.ui[k]) || "";
const gn = (k) => (window.PTIcons && PTIcons.gen[k]) || ic("globe");
const svgWrap = (p, color) => `<svg viewBox="0 0 24 24" fill="${color || "currentColor"}" width="20" height="20" aria-hidden="true">${p}</svg>`;

function linkIcon(l) {
  if (l.emoji) {
    const g = window.PTIcons && PTIcons.gen[l.emoji];
    if (g) return g;
    if (l.emoji.startsWith("b:")) { const k = l.emoji.slice(2); const p = window.PTIcons && PTIcons.brand[k]; if (p) return svgWrap(p, PTIcons.colors && PTIcons.colors[k]); }
  }
  const b = window.PTIcons && PTIcons.brand[l.kind];
  if (b) return svgWrap(b, PTIcons.colors && PTIcons.colors[l.kind]);
  return gn("globe");
}
function brandChip(k) { const p = window.PTIcons && PTIcons.brand[k]; return p ? svgWrap(p, PTIcons.colors && PTIcons.colors[k]) : ""; }

/* ================= net ================= */
function api(path, opt) {
  opt = opt || {};
  opt.headers = Object.assign({}, opt.headers || {});
  if (window.__ptok) opt.headers["X-Auth-Token"] = window.__ptok;
  if (opt.body && typeof opt.body === "string") opt.headers["Content-Type"] = "application/json";
  return fetch("/api/" + path, opt).then(async (r) => {
    let d = {}; try { d = await r.json(); } catch {}
    if (!r.ok) { const e = new Error(d.error || "Terjadi kesalahan"); e.status = r.status; e.data = d; throw e; }
    return d;
  });
}
const get = (p) => api(p);
const send = (p, m, b) => api(p, { method: m || "POST", body: JSON.stringify(b || {}) });

let toastT;
function toast(msg, bad) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.className = "toast" + (bad ? " bad" : "") + " show";
  t.innerHTML = `${bad ? "" : ic("check")}<span>${esc(msg)}</span>`;
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400);
}
const initials = (n) => { const w = String(n || "?").trim().split(/\s+/).filter(Boolean); return (w.length ? w.map((x) => x[0]).join("").slice(0, 2) : "?").toUpperCase(); };
const fmtNum = (n) => new Intl.NumberFormat("id-ID").format(n || 0);
const fmtDate = (t) => new Date(t * 1000).toLocaleDateString("id-ID", { year: "numeric", month: "short" });
const loc = () => location.origin + "/u/" + S.u.username;
const siteUrl = () => location.origin;
function cloudOpt(url, w = 300, fill = true) {
  if (!url || !url.includes("/image/upload/")) return url;
  const t = fill ? `c_fill,w_${w},h_${w}` : `w_${w}`;
  return url.replace("/image/upload/", `/image/upload/${t},q_auto:good,f_webp/`);
}

/* ================= konfig ================= */
let __cfgP = null;
function ensureCfg() {
  if (window.__cfg) return Promise.resolve(window.__cfg);
  if (__cfgP) return __cfgP;
  __cfgP = get("config").then((c) => (window.__cfg = c)).catch(() => (window.__cfg = {}));
  return __cfgP;
}

/* ================= boot ================= */
window.__pautinBoot = async function () {
  if (window.__pautinBooted) return;
  window.__pautinBooted = true;
  const qs = new URLSearchParams(location.search);
  try {
    const d = await get("me");
    S.u = d.user; S.links = d.links; S.totalClicks = d.total_clicks;
    renderDashboard(qs.get("signup") === "1");
  } catch (e) {
    await ensureCfg();
    renderAuth(qs.get("signup") === "1" ? "signup" : "login");
  }
  normDashUrl();
};
function normDashUrl() {
  const m = location.pathname.match(/^\/dashboard\/([a-z]+)$/);
  if (m && m[1] && PAGE_T[m[1]]) return; // rute sub-halaman valid: pertahankan
  history.replaceState(null, "", "/dashboard");
}
window.__pautinEnter = async function (welcome) {
  const d = await get("me");
  S.u = d.user; S.links = d.links; S.totalClicks = d.total_clicks;
  renderDashboard(!!welcome);
  normDashUrl();
};

/* ================= AUTH ================= */
const cfg = () => window.__cfg || {};
const socialBtn = (id, label, inner) =>
  `<a class="socbtn ${id}" href="/api/auth/${id}" rel="noopener">${inner}<span>${label}</span></a>`;
const socRow = () => {
  const list = (cfg().social || []).filter((x) => x === "google" || x === "discord");
  if (!list.length) return "";
  const btns = {
    google: socialBtn("google", "Google", '<img src="https://www.gstatic.com/images/branding/googleg/2x/googleg_standard_color_48dp.png" width="18" height="18" alt="" aria-hidden="true">'),
    discord: socialBtn("discord", "Discord", '<svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden="true"><path d="M20.317 4.3698a19.79 19.79 0 0 0-4.885-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>'),
  };
  return `<div class="odiv">atau lanjutkan dengan</div><div class="socrow">${list.map((x) => btns[x]).join("")}</div>`;
};
const maskM = (e) => { const [a, b] = String(e || "").split("@"); if (!b) return e; return a.slice(0, Math.max(1, a.length - 2)) + "•••" + a.slice(-1) + "@" + b; };

function renderAuth(mode) {
  const m = mode === "signup" ? "signup" : "login";
  rootEl().innerHTML = `
  <div class="auth"><div class="abox">
    <div class="alogo">${ic("logo")}<span>Pautin</span></div>
    <div class="ahead">
      <h1>${m === "signup" ? "Buat halaman gratis" : "Selamat datang kembali"}</h1>
      <p>${m === "signup" ? "Satu email untuk mengaktifkan akun, lalu bagikan semua tautanmu." : "Masuk dengan username/email untuk mengelola halamanmu."}</p>
    </div>
    <div class="aerr" id="aerr"></div>
    ${socRow()}
    <div class="af">
      <div class="fld"><label>Username ${m === "login" ? "atau email" : ""}</label>
        <input id="aU" autocomplete="username" ${m === "signup" ? 'maxlength="20"' : ""} placeholder="${m === "signup" ? "mis. rizky" : "mis. rizky atau emailmu"}" value="">
        ${m === "signup" ? '<div class="hint" id="uHint" style="font-weight:800">&nbsp;</div>' : ""}
      </div>
      ${m === "signup" ? `<div class="fld"><label>Email <span class="req">wajib — untuk verifikasi</span></label><input id="aE" type="email" autocomplete="email" maxlength="120" placeholder="kamu@contoh.com"></div>` : ""}
      ${m === "signup" ? '<div class="fld"><label>Nama tampilan <span class="opt">opsional</span></label><input id="aN" maxlength="60" placeholder="mis. Rizky Pratama"></div>' : ""}
      <div class="fld"><label>Kata sandi ${m === "signup" ? '<span class="req">min. 8 karakter + angka</span>' : ""}</label>
        <div class="pwrow"><input id="aP" type="password" autocomplete="${m === "signup" ? "new-password" : "current-password"}" placeholder="••••••••"><button class="eye" data-act="eyetoggle" aria-label="Lihat kata sandi">${ic("eye")}</button></div>
        ${m === "login" ? '<div class="flrow"><a href="#" class="flnk" data-act="forgot">Lupa kata sandi?</a></div>' : ""}
        ${m === "signup" ? `<div class="pwstr" id="pwStr"><i></i><i></i><i></i><i></i><span id="pwLbl">Kekuatan kata sandi</span></div>
        <div class="pwchk" id="pwChk"><span data-k="len">8+ karakter</span><span data-k="num">angka</span><span data-k="mix">huruf kecil & besar</span></div>` : ""}
      </div>
      ${m === "signup" ? `<div class="fld"><label>Ulangi kata sandi</label>
        <div class="pwrow"><input id="aP2" type="password" autocomplete="new-password" placeholder="••••••••"><button class="eye" data-act="eyetoggle2" aria-label="Lihat kata sandi">${ic("eye")}</button></div>
        <div class="hint" id="p2Hint" style="font-weight:800">&nbsp;</div>
      </div>` : ""}
    </div>
    <button class="act abtn" id="aGo" data-act="submit">${m === "signup" ? "Daftar dan kirim verifikasi" : "Masuk"} ${ic("arrowR")}</button>
    <p class="asub">${m === "signup" ? "Sudah punya akun? " : "Belum punya akun? "}<a href="#" data-act="swap">${m === "signup" ? "Masuk" : "Daftar gratis"}</a></p>
  </div></div>`;
  bindAuthActions(m);
  if (new URLSearchParams(location.search).get("authfail")) authErr("Masuk dengan akun sosial gagal. Coba lagi atau gunakan username/email.");
}

function renderForgot() {
  window.__authMode = "forgot";
  window.__authOnResend = null;
  rootEl().innerHTML = `
  <div class="auth"><div class="abox">
    <div class="alogo">${ic("logo")}<span>Pautin</span></div>
    <div class="ahead"><h1>Atur ulang kata sandi</h1>
      <p>Masukkan username atau email yang terdaftar. Kami kirim tautan untuk membuat kata sandi baru.</p></div>
    <div class="aerr" id="aerr"></div>
    <div class="af">
      <div class="fld"><label>Username atau email</label>
        <input id="aF" autocomplete="username" placeholder="mis. rizky atau kamu@contoh.com" value="">
      </div>
    </div>
    <button class="act abtn" id="aGo" data-act="submit">Kirim tautan atur ulang ${ic("arrowR")}</button>
    <p class="asub"><a href="#" data-act="swap">Kembali ke masuk</a></p>
  </div></div>`;
  const aF = $("#aF");
  window.__authOnSubmit = () => {
    const id = aF.value.trim().toLowerCase();
    const err = $("#aerr"); if (err) err.classList.remove("show");
    if (!id) return authErr("Masukkan username atau email yang terdaftar.");
    const go = $("#aGo"); if (go) go.disabled = true;
    send("forgot", "POST", { id })
      .then((d) => {
        if (!d.ok) throw new Error(d.error || "Gagal mengirim.");
        renderForgotSent(d.email || id, d.devLink, id);
      })
      .catch((e) => { authErr(e.message); const b = $("#aGo"); if (b) b.disabled = false; });
  };
  aF.addEventListener("keydown", (e) => { if (e.key === "Enter") window.__authOnSubmit(); });
  aF.focus();
}

function renderForgotSent(masked, devLink, id) {
  window.__authMode = "forgotdone";
  window.__authOnSubmit = null;
  window.__pendForgot = id;
  rootEl().innerHTML = `
  <div class="auth"><div class="abox">
    <div class="mailic"><span class="maili">${ic("check")}</span></div>
    <div class="ahead"><h1>Cek emailmu</h1>
      <p>Kalau akun ${esc(masked)} terdaftar, kami kirim tautan atur ulang kata sandi ke email itu. Tautan berlaku 1 jam.</p></div>
    <div class="aerr" id="aerr"></div>
    ${devLink ? `<div class="devlink">Mode pengembangan (email belum disetel): <a href="${esc(devLink)}">buka tautan atur ulang</a></div>` : ""}
    <div class="vacts">
      <button class="act" id="aRs" data-act="resend">${ic("arrowR")} Kirim ulang email</button>
      <button class="tbtn" data-act="swap">Kembali ke masuk</button>
    </div>
    <p class="asub" style="margin-top:14px">Tidak sampai? Cek folder spam, lalu coba lagi beberapa saat.</p>
  </div></div>`;
  window.__authOnResend = () => {
    const btn = $("#aRs");
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    send("forgot", "POST", { id: window.__pendForgot || "" })
      .then(() => { btn.disabled = false; toast("Email atur ulang terkirim ulang."); })
      .catch((e) => { btn.disabled = false; authErr(e.message); });
  };
}

function renderMailCheck(email, devLink) {
  rootEl().innerHTML = `
  <div class="auth"><div class="abox">
    <div class="mailic"><span class="maili">${ic("check")}</span></div>
    <div class="ahead"><h1>Cek emailmu</h1>
      <p>Kami kirim tautan verifikasi ke <b class="mailto">${esc(maskM(email))}</b>. Klik tautan itu untuk mengaktifkan akunmu, lalu kembali ke sini untuk masuk.</p></div>
    <div class="aerr" id="aerr"></div>
    ${devLink ? `<div class="devlink">Mode pengembangan (email belum disetel): <a href="${esc(devLink)}">buka tautan verifikasi</a></div>` : ""}
    <div class="vacts">
      <button class="act" id="aRs" data-act="resend">${ic("arrowR")} Kirim ulang tautan</button>
      <button class="tbtn" data-act="swap">Kembali ke masuk</button>
    </div>
    <p class="asub" style="margin-top:14px">Tidak sampai? Cek folder spam, atau tunggu 60 detik sebelum kirim ulang.</p>
  </div></div>`;
  window.__pendEmail = email;
  window.__authMode = "mail";
  window.__authOnSubmit = null;
  window.__authOnResend = () => {
    const btn = $("#aRs");
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    send("verify/resend", "POST", { email: window.__pendEmail || "" })
      .then(() => { btn.disabled = false; toast("Tautan verifikasi terkirim ulang."); })
      .catch((e) => { btn.disabled = false; authErr(e.message); });
  };
}

const authErr = (m) => { const e = $("#aerr"); if (!e) return; e.textContent = m; e.classList.add("show"); };

function ensureAuthDelegation() {
  if (window.__authDelegate) return;
  window.__authDelegate = (ev) => {
    const t = ev.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;
    if (act === "swap") { ev.preventDefault(); renderAuth(window.__authMode === "login" || !window.__authMode ? "signup" : "login"); }
    else if (act === "forgot") { renderForgot(); }
    else if (act === "eyetoggle" || act === "eyetoggle2") { const row = t.closest(".pwrow"); const i = row && row.querySelector("input"); if (i) { i.type = i.type === "password" ? "text" : "password"; t.innerHTML = i.type === "password" ? ic("eye") : ic("eyeOff"); } }
    else if (act === "submit" && window.__authOnSubmit) window.__authOnSubmit();
    else if (act === "resend" && window.__authOnResend) window.__authOnResend();
  };
  rootEl().addEventListener("click", window.__authDelegate);
}

function bindAuthActions(mode) {
  window.__authMode = mode;
  window.__authOnResend = null;
  ensureAuthDelegation();
  const aU = $("#aU"), aP = $("#aP");
  let uT;
  if (mode === "signup") {
    aU.addEventListener("input", () => {
      clearTimeout(uT);
      const v = aU.value.trim().toLowerCase(), h = $("#uHint");
      if (!v) { h.innerHTML = "&nbsp;"; return; }
      if (!/^[a-z0-9]{3,20}$/.test(v)) { h.innerHTML = '<span style="color:var(--bad)">Pakai 3-20 huruf kecil / angka, tanpa spasi.</span>'; return; }
      h.innerHTML = '<span style="color:var(--mute)">Memeriksa…</span>';
      uT = setTimeout(() => {
        get("check?u=" + encodeURIComponent(v)).then((d) => {
          h.innerHTML = d.ok
            ? `<span style="color:var(--ok)"><b>${esc(v)}</b> tersedia: <span style="font-family:var(--mono)">${esc(siteUrl().replace(/^https?:\/\//, ""))}/u/${esc(v)}</span></span>`
            : `<span style="color:var(--bad)">${esc(v)} sudah dipakai.</span>`;
        }).catch(() => { h.innerHTML = ""; });
      }, 300);
    });
    const aP2 = $("#aP2");
    const strength = () => {
      const v = aP.value, has = { len: v.length >= 8, num: /\d/.test(v), mix: /[a-z]/.test(v) && /[A-Z]/.test(v) };
      const score = (has.len ? 1 : 0) + (has.num ? 1 : 0) + (has.mix ? 1 : 0);
      const w = $("#pwStr"), lbl = $("#pwLbl");
      if (w) { [...w.querySelectorAll("i")].forEach((b, i) => b.classList.toggle("f", i < score)); w.classList.toggle("s1", score === 1); w.classList.toggle("s2", score === 2); w.classList.toggle("s3", score === 3); }
      if (lbl) { lbl.textContent = !v ? "Kekuatan kata sandi" : score <= 1 ? "Lemah" : score === 2 ? "Sedang" : "Kuat"; lbl.className = score === 3 ? "good" : score === 2 ? "mid" : !v ? "" : "bad"; }
      if ($("#pwChk")) ["len", "num", "mix"].forEach((k) => { const c = $("#pwChk").querySelector(`[data-k="${k}"]`); if (c) c.classList.toggle("on", !!has[k]); });
      match();
    };
    const match = () => {
      const h = $("#p2Hint"); if (!h || !aP2) return;
      if (!aP2.value) { h.innerHTML = "&nbsp;"; return; }
      h.innerHTML = aP2.value === aP.value ? '<span style="color:var(--ok)">Sama. Bagus.</span>' : '<span style="color:var(--bad)">Belum sama dengan kata sandi di atas.</span>';
    };
    aP.addEventListener("input", strength);
    if (aP2) { aP2.addEventListener("input", match); aP2.addEventListener("keydown", (e) => { if (e.key === "Enter") window.__authOnSubmit(); }); }
  }
  window.__authOnSubmit = () => {
    const go = $("#aGo");
    if (!go || go.disabled) return;
    const err = $("#aerr"); if (err) err.classList.remove("show");
    const u = aU.value.trim().toLowerCase(), p = aP.value;
    go.disabled = true;
    const done = (m) => { go.disabled = false; authErr(m); };
    if (mode === "signup") {
      const em = ($("#aE") ? $("#aE").value : "").trim().toLowerCase();
      const n = ($("#aN") ? $("#aN").value : "").trim();
      if (!/^[a-z0-9]{3,20}$/.test(u)) return done("Username 3-20 huruf/angka kecil, tanpa spasi.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return done("Alamat email tidak valid.");
      const p2v = $("#aP2") ? $("#aP2").value : p;
      if (p.length < 8) return done("Kata sandi minimal 8 karakter.");
      if (!/\d/.test(p)) return done("Kata sandi harus mengandung minimal satu angka.");
      if (p !== p2v) return done("Ulangi kata sandi tidak sama dengan kata sandi.");
      send("register", "POST", { username: u, name: n, email: em, password: p })
        .then((d) => {
          if (!d.ok) return done(d.error || "Gagal mendaftar.");
          renderMailCheck(d.email || em, d.devLink);
          if (d.mailErr) setTimeout(() => authErr("Email belum terkirim (" + d.mailErr + "). Pakai tombol kirim ulang."), 500);
        })
        .catch((e) => done(e.message));
    } else {
      send("login", "POST", { username: u, password: p })
        .then(async (d) => { window.__ptok = d.token; try { await window.__pautinEnter(false); } catch { location.reload(); } })
        .catch((e) => {
          if (e.status === 403 && e.data && e.data.code === "unverified") renderMailCheck(e.data.email || u, null);
          else done(e.message);
        });
    }
  };
  aP.addEventListener("keydown", (e) => { if (e.key === "Enter") window.__authOnSubmit(); });
  aU.addEventListener("keydown", (e) => { if (e.key === "Enter") window.__authOnSubmit(); });
}

/* ================= navigasi sidebar & router halaman ================= */
const PG = {
  home: ["Beranda", "/dashboard", ""],
  statistik: ["Statistik 30 hari", "/dashboard/statistik", "nViewCnt"],
  tautan: ["Tautan saya", "/dashboard/tautan", "nLinkCnt"],
  tambah: ["Tambah tautan", "/dashboard/tautan?add=1", ""],
  grup: ["Grup & folder", "/dashboard/grup", ""],
  bagikan: ["Bagikan halaman", "/dashboard/bagikan", ""],
  qr: ["QR code", "/dashboard/qr", ""],
  halaman: ["Halaman publik", "/dashboard/halaman", ""],
  profil: ["Edit nama & bio", "/dashboard/profil", ""],
  foto: ["Foto profil", "/dashboard/profil?bag=foto", ""],
  keamanan: ["Verifikasi email", "/dashboard/keamanan?bag=verif", ""],
  pass: ["Ganti kata sandi", "/dashboard/keamanan?bag=sandi", ""],
  tampilan: ["Pratinjau & tema", "/dashboard/tampilan", ""],
  pilih: ["Pilih tema", "/dashboard/tampilan?bag=tema", ""],
  tombol: ["Bentuk tombol", "/dashboard/tampilan?bag=tombol", ""],
  daftar: ["Gaya daftar", "/dashboard/tampilan?bag=daftar", ""],
  bentukFoto: ["Bentuk foto", "/dashboard/tampilan?bag=bentukfoto", ""],
  huruf: ["Gaya huruf", "/dashboard/tampilan?bag=huruf", ""],
  aksen: ["Warna aksen", "/dashboard/tampilan?bag=aksen", ""],
  panduan: ["Panduan cepat", "/dashboard/panduan", ""],
};
const PAGE_T = { home: "Beranda", tautan: "Tautan saya", grup: "Grup & folder", statistik: "Statistik", profil: "Profil", keamanan: "Keamanan", bagikan: "Bagikan", qr: "QR code", halaman: "Halaman publik", tampilan: "Tampilan & tema", panduan: "Panduan" };
const pageNav = (k) => { const [l, p, b] = PG[k] || PG.home; return `<a class="ni" href="${p}" data-p="${k}"><span>${l}</span>${b ? `<i class="nb" id="${b}">0</i>` : ""}</a>`; };
const actNav = (k, l, badge) => `<button type="button" class="ni" data-nav="${k}"><span>${l}</span>${badge ? `<i class="nb" id="${badge}">0</i>` : ""}</button>`;
const extNav = (href, l) => `<a class="ni" href="${href}"><span>${l}</span></a>`;
function navGroup(gid, title, inner) {
  return `<button type="button" class="ngt" data-ngt="${gid}" aria-expanded="true">${title}${ic("chevD")}</button>
  <div class="ng" data-ng="${gid}">${inner}</div>`;
}
function navHtmlDash() {
  return `<div class="card" id="navCard">
    <div class="cardh"><div class="t">${ic("menu")} Menu</div></div>
    ${navGroup("ng1", "Ringkasan",
      pageNav("home") + actNav("refresh", "Segarkan data") + pageNav("statistik") + pageNav("tautan") + pageNav("tambah") + pageNav("grup"))}
    ${navGroup("ng2", "Bagikan",
      pageNav("bagikan") + pageNav("qr") + pageNav("halaman") + actNav("copyurl", "Salin link halaman") + actNav("copyuser", "Salin username"))}
    ${navGroup("ng3", "Akun",
      pageNav("profil") + pageNav("foto") + pageNav("keamanan") + pageNav("pass") + actNav("logout", "Keluar"))}
    ${navGroup("ng4", "Tampilan & tema",
      pageNav("tampilan") + pageNav("pilih") + pageNav("tombol") + pageNav("daftar") + pageNav("bentukFoto") + pageNav("huruf") + pageNav("aksen") + actNav("defaults", "Reset tampilan"))}
    ${navGroup("ng5", "Bantuan & info",
      pageNav("panduan") + extNav("/feedback", "Feedback, saran & kritik") + extNav("/about", "Tentang Pautin") + extNav("/legal/terms", "Syarat & ketentuan") + extNav("/legal/privacy", "Kebijakan privasi") + extNav("/legal/license", "Lisensi & kredit"))}
    ${navGroup("ng6", "Lainnya",
      actNav("navtoggle", "Sembunyikan panel menu"))}
  </div>`;
}

/* ================= shell dashboard + router ================= */
const qObj = () => { const o = {}; new URLSearchParams(location.search).forEach((v, k) => (o[k] = v)); return o; };
function curView() {
  const m = location.pathname.match(/^\/dashboard\/([a-z]+)/);
  return m && PAGE_T[m[1]] ? m[1] : "home";
}
function goPath(u, replace) {
  if (u === location.pathname + location.search) { routeView(); window.scrollTo({ top: 0 }); return; }
  if (replace) history.replaceState(null, "", u); else history.pushState(null, "", u);
  routeView();
  window.scrollTo({ top: 0 });
}
function renderDashboard(welcome) {
  const u = S.u;
  S.welcome = !!welcome;
  rootEl().innerHTML = `
  <div class="tb"><div class="tbi">
    <a class="br" href="/">${ic("logoSm")}<span class="hide-sm">Pautin</span></a>
    <div class="grow"></div>
    <div class="menu" id="menu">
      <button class="mbtn" data-act="menu"><span class="ava" id="mava">${esc(initials(u.name))}</span><span class="hide-sm">${esc(u.name)}</span>${ic("chevD").replace('<svg', '<svg class="ch"')}</button>
      <div class="mdrop">
        <a class="mi" href="/u/${esc(u.username)}" target="_blank" rel="noopener"><span class="ava">${esc(initials(u.name))}</span><span><b>@${esc(u.username)}</b><span class="s">Halaman publikmu</span></span></a>
        <div class="msep"></div>
        <a class="mi" href="/dashboard"><span class="ic">${ic("menu")}</span><span>Beranda dashboard</span></a>
        <a class="mi" href="/dashboard/profil"><span class="ic">${ic("users")}</span><span>Edit profil dan foto</span></a>
        <a class="mi" href="/dashboard/bagikan"><span class="ic">${ic("share")}</span><span>Bagikan halaman</span></a>
        <div class="msep"></div>
        <button class="mi" data-act="logout"><span class="ic" style="color:var(--bad);background:#FBEDEA">${ic("logout")}</span><span>Keluar</span></button>
      </div>
    </div>
    <a class="act hide-sm" href="/u/${esc(u.username)}" target="_blank" rel="noopener">${ic("eyeUp")} Lihat Halaman</a>
  </div></div>

  <div class="lay">
    <aside class="side">
      ${navHtmlDash()}
      <div class="card sidecard" style="margin-top:2px">
        <div class="cardbody">
          <div class="sectag">${ic("heart")} Kamu sudah hebat!</div>
          <p class="mini" style="line-height:1.6">Ada ide, saran, atau kritik? Kabari kami lewat halaman Feedback — dibaca sungguhan.</p>
          <a class="tbtn" href="/feedback" style="width:100%;justify-content:center;display:flex">Kirim feedback</a>
        </div>
      </div>
    </aside>
    <main class="main" id="pgMain"></main>
  </div>
  <div class="mv" id="mv"></div>
  <a id="fb" href="/">${ic("logoSm")}Pautin</a>`;
  bindRootEvents();
  routeView();
}
function routeView() {
  const v = curView(), q = qObj();
  const main = $("#pgMain"); if (!main) return;
  const build = { home: viewHome, tautan: viewLinks, grup: viewGroups, statistik: viewStats, profil: viewProfile, keamanan: viewSecurity, bagikan: viewShare, qr: viewQr, halaman: viewPage, tampilan: viewTheme, panduan: viewGuide }[v] || viewHome;
  main.innerHTML = build(q);
  const tt = { home: "Beranda", tautan: "Tautan saya", grup: "Grup & folder", statistik: "Statistik", profil: "Profil", keamanan: "Keamanan", bagikan: "Bagikan", qr: "QR code", halaman: "Halaman publik", tampilan: "Tampilan & tema", panduan: "Panduan" };
  document.title = (tt[v] || "Dashboard") + " — " + S.u.username + " | Pautin";
  $$("#navCard a[data-p]").forEach((a) => {
    let hp = ""; try { hp = new URL(a.getAttribute("href"), location.href).pathname; } catch {}
    const hq = a.getAttribute("href") || "";
    const q = hq.indexOf("?") >= 0 ? hq.slice(hq.indexOf("?")) : "";
    a.classList.toggle("on", hp === location.pathname && (!q || q === location.search));
  });
  paintAvatar();
  afterView(v, q);
}
function afterView(v, q) {
  if (v === "tautan") {
    S.showAdd = false; S.editing = null; S.iconKey = "";
    renderIconPicker();
    renderLinks();
    if (q.add === "1") { toggleAdd(true); setTimeout(() => scrollToEl($("#addCard")), 120); }
    if (q.edit) { const id = Number(q.edit); if (S.links.some((l) => l.id === id)) openEdit(id); }
  } else if (v === "tampilan") {
    renderThemes();
    const bag = { tema: "#thRow", tombol: "#radRow", daftar: "#gridRow", bentukfoto: "#avRow", huruf: "#fontRow", aksen: "#accRow" }[q.bag || "tema"];
    if (bag) setTimeout(() => scrollToEl($(bag)), 150);
  } else if (v === "profil") {
    if (q.bag === "foto") setTimeout(() => scrollToEl($("#avaPrev")), 150);
  } else if (v === "keamanan") {
    if (q.bag === "sandi") setTimeout(() => scrollToEl($("#psForm")), 150);
    else setTimeout(() => scrollToEl($("#pvCard")), 120);
  } else if (v === "statistik") { loadPageStats(); }
  else if (v === "qr") { const e = $("#qr"); if (e) makeQr(e, loc()); }
  bindViewHooks(v);
}

/* ================= konten halaman ================= */
function pageHead(title, sub, right) {
  return `<div class="phead"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${right || ""}</div>`;
}
function linkRowMini(l, opts) {
  opts = opts || {};
  return `<div class="ll mini">
    <span class="e">${linkIcon(l)}</span>
    <div class="inf"><div class="ti">${esc(l.title)}<span class="kind">${esc(l.kind)}</span></div>
      <div class="ur">${esc(l.url)}${l.grp ? `<span class="grtag">${esc(l.grp)}</span>` : ""}</div></div>
    ${opts.grouped ? "" : `<a class="ob oj" href="/dashboard/tautan?edit=${l.id}" title="Edit">${ic("pencil")}</a>`}
    <span class="cl">${ic("eye")} ${fmtNum(l.clicks)}</span>
  </div>`;
}
function viewHome() {
  const u = S.u, links = S.links, recent = links.slice(0, 4);
  const hello = (u.name || u.username).trim().split(/\s+/)[0];
  return `
  ${S.welcome ? `<div class="notebar" id="welcome">${ic("check")} <span><b>Halamanmu jadi.</b> Ini link pribadimu yang bisa kamu bagikan ke mana saja. Tambahkan tautan pertamamu di bawah.</span><button class="x" data-act="closenote" aria-label="Tutup">${ic("x")}</button></div>` : ""}
  ${pageHead(`Halo, ${esc(hello)}!`, `Ringkasan halaman <b>@${esc(u.username)}</b> — satu alamat untuk semua tautanmu.`)}
  <div class="stat-grid big">
    <a class="stat" href="/dashboard/statistik"><div class="v" id="stViews">${fmtNum(u.views)}</div><div class="k">Kunjungan</div></a>
    <a class="stat" href="/dashboard/statistik"><div class="v" id="stClicks">${fmtNum(S.totalClicks)}</div><div class="k">Klik tautan</div></a>
    <a class="stat" href="/dashboard/tautan"><div class="v" id="stLinks">${links.length}</div><div class="k">Tautan</div></a>
    <a class="stat" href="/dashboard/profil"><div class="v" id="stJoin">${fmtDate(u.created_at)}</div><div class="k">Sejak</div></a>
  </div>
  <div class="qgrid">
    <a class="qcard" href="/dashboard/tautan?add=1"><span class="qi" style="background:#E4EFEA;color:var(--green)">${ic("plus")}</span><div><b>Tambah tautan</b><span>Isi judul, URL, dan grup</span></div></a>
    <a class="qcard" href="/dashboard/statistik"><span class="qi" style="background:#FBE9E4;color:var(--orange)">${ic("chart")}</span><div><b>Lihat statistik</b><span>Grafik 30 hari & terpopuler</span></div></a>
    <a class="qcard" href="/dashboard/tampilan"><span class="qi" style="background:#EFEAF9;color:#7C3AED">${gn("palette")}</span><div><b>Atur tampilan</b><span>Tema, aksen, dan bentuk</span></div></a>
    <a class="qcard" href="/dashboard/halaman"><span class="qi" style="background:#FFF3DF;color:#B45309">${ic("eyeUp")}</span><div><b>Cek halaman publik</b><span>Lihat hasilnya langsung</span></div></a>
  </div>
  <div class="card">
    <div class="cardh"><div class="t">${ic("linkUI")} Tautan terbaru</div><div class="grow"></div><a class="ob oj" href="/dashboard/tautan" title="Kelola semua">${ic("arrowR")}</a></div>
    <div class="lst" id="homeLinks">${links.length ? recent.map((l) => linkRowMini(l)).join("") : `<div class="empty"><div class="e">${ic("linkUI")}</div><div style="font-weight:800;margin-bottom:6px">Belum ada tautan</div><div class="bt"><a class="emptya" href="/dashboard/tautan?add=1">${ic("plus")} Tambah Tautan Pertama</a></div></div>`}</div>
  </div>
  <div class="tipband">${ic("heart")} <span><b>Beri masukan?</b> Halaman feedback menerima saran, kritik, hingga laporan masalah.</span><a href="/feedback" class="tbtn" style="flex:0 0 auto">Feedback</a></div>`;
}
function viewLinks() {
  return `
  ${pageHead(`${ic("linkUI")} Tautanmu`, `Kelola semua tautan di halaman <b>@${esc(S.u.username)}</b>. Seret baris untuk mengurutkan.`,
    `<a class="tbtn" href="/dashboard/grup">${ic("arrowR")} Grup & folder</a>`)}
  <div class="card" id="addCard" hidden>
    <div style="padding:18px">
      <div class="frm">
        <div class="fld full"><label>Judul</label><input id="lT" maxlength="90" placeholder="mis. Channel YouTube-ku"></div>
        <div class="fld full"><label>Tautan (URL)</label><input id="lU" maxlength="500" placeholder="mis. https://youtube.com/@namamu">
          <div class="hint">Media sosial terdeteksi otomatis. Awalan https:// ditambahkan bila tidak ada.</div>
        </div>
        <div class="fld full"><label>Grup <span class="opt">opsional</span></label><input id="lG" maxlength="40" placeholder="mis. Sosmed, Toko, Artikel" autocomplete="off">
          <div class="hint">Tautan dengan grup sama tampil di bawah judul yang sama di halaman publikmu.</div>
        </div>
        <div class="fld full"><label>Ikon <span class="opt">pilih salah satu</span></label>
          <div style="display:flex;gap:12px;align-items:center"><span class="pickprev" id="pickPrev">${gn("globe")}</span><div class="icon-grid" id="iconGrid"></div></div>
        </div>
        <div class="er" id="lErr"></div>
        <div class="frow">
          <button class="act" data-act="savelink" style="flex:1">${ic("check")} <span id="saveLbl">Simpan Tautan</span></button>
          <button class="tbtn" data-act="canceladd">Batal</button>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div id="listHead"><div class="t">Daftar tautan <span class="cnt" id="lCnt">0</span></div>
      <div class="grow"></div>
      <button class="act" data-act="addtoggle">${ic("plus")} <span id="addLbl">Tambah Tautan</span></button>
    </div>
    <div id="linkList"></div>
  </div>`;
}
function viewGroups() {
  const groups = [];
  const seen = new Set();
  S.links.forEach((l) => {
    const g = String(l.grp || "").trim() || "Tanpa grup";
    if (!seen.has(g)) { seen.add(g); groups.push({ name: g, items: [] }); }
    groups[groups.length - 1].items.push(l);
  });
  const total = S.links.length;
  return `
  ${pageHead(`${ic("folderUI") || ic("linkUI")} Grup & folder`, `Tautan dikelompokkan lewat kolom <b>Grup</b> saat menambah/mengedit. Grup muncul sebagai judul seksi di halaman publikmu.`, `<a class="tbtn" href="/dashboard/tautan">${ic("plus")} Kelola tautan</a>`)}
  <div class="gstats">${groups.length ? groups.map((g) => `<span class="gstat"><b>${esc(g.name)}</b><i>${g.items.length} tautan</i></span>`).join("") : `<span class="gstat none"><b>Belum ada grup</b></span>`} <span class="gstat muted"><b>${total}</b><i>total tautan</i></span></div>
  ${!total ? `<div class="card"><div class="empty"><div class="e">${ic("linkUI")}</div><div style="font-weight:800;margin-bottom:6px">Belum ada tautan</div><div class="bt"><a class="emptya" href="/dashboard/tautan?add=1">${ic("plus")} Tambah Tautan Pertama</a></div></div></div>` : groups.map((g) => `
    <div class="card grpcard">
      <div class="cardh"><div class="t">${g.name === "Tanpa grup" ? "Tanpa grup" : esc(g.name)}</div>
        <span class="cnt">${g.items.length}</span>
        <div class="grow"></div>
        ${g.name === "Tanpa grup" ? "" : `<a class="ob oj" href="/dashboard/tautan?edit=${g.items[0].id}" title="Ubah nama lewat edit tautan">${ic("pencil")}</a>`}
      </div>
      <div class="lst">${g.items.map((l) => linkRowMini(l, { grouped: true })).join("")}</div>
    </div>`).join("")}
  <div class="tipband">${ic("doc")} <span><b>Urutan grup</b> mengikuti urutan tautan pertamanya. Ganti nama grup cukup dengan mengedit salah satu tautan anggotanya.</span></div>`;
}
async function loadPageStats() {
  const wrap = $("#stWrap"); if (!wrap) return;
  try { const d = await get("stats"); wrap.innerHTML = statChartHtml(d); }
  catch (x) { wrap.innerHTML = `<div class="sterr">${esc(x.message || "Gagal memuat statistik.")}</div>`; }
}
function viewStats() {
  return `
  ${pageHead(`${ic("chart")} Statistik`, `Kunjungan halaman publik & klik tautan — 30 hari terakhir.`,
    `<button class="act" data-act="stats">${ic("arrowR")} Muat ulang</button>`)}
  <div class="stat-grid big">
    <div class="stat"><div class="v" id="stViews">${fmtNum(S.u.views)}</div><div class="k">Kunjungan</div></div>
    <div class="stat"><div class="v" id="stClicks">${fmtNum(S.totalClicks)}</div><div class="k">Klik tautan</div></div>
    <div class="stat"><div class="v" id="stLinks">${S.links.length}</div><div class="k">Tautan</div></div>
    <div class="stat"><div class="v" id="stJoin">${fmtDate(S.u.created_at)}</div><div class="k">Sejak</div></div>
  </div>
  <div class="card"><div id="stWrap" class="stwrap"><div class="stload">Memuat grafik…</div></div></div>`;
}
function viewProfile() {
  const u = S.u;
  return `
  ${pageHead(`${ic("users")} Profil`, `Nama, bio, dan foto tampil di halaman publik <b>@${esc(u.username)}</b>.`)}
  <div class="card">
    <div class="er" id="pErr"></div>
    <div class="avatbox big">
      <div class="big" id="avaPrev">${u.avatar ? `<img src="${esc(cloudOpt(u.avatar, 160))}" alt="">` : ic("users")}</div>
      <div class="acts">
        <button class="tbtn upbtn" id="pfUp">${ic("upload")} Unggah foto
          <input id="avaFile" type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden>
        </button>
        ${u.avatar ? '<button class="tbtn" id="pfRemove2">Hapus foto</button>' : ""}
        <span class="mini">WebP otomatis, kualitas adaptif. Maks 6 MB.</span>
      </div>
    </div>
    <div class="frm">
      <div class="fld full"><label>Nama tampilan</label><input id="pfName" maxlength="60" value="${esc(u.name)}"></div>
      <div class="fld full"><label>Bio</label><textarea id="pfBio" maxlength="200" placeholder="Tulis bio singkat…">${esc(u.bio)}</textarea>
        <div class="hint">Maksimal 200 karakter. Baris baru diperbolehkan.</div>
      </div>
      <div class="fld full"><label>Tautan foto (opsional, pengganti unggah)</label>
        <input id="pfUrl" maxlength="300" value="${esc(u.avatar)}" placeholder="https://…">
      </div>
      <div class="frow"><button class="act" id="pfSave" style="flex:1">${ic("check")} Simpan profil</button></div>
    </div>
  </div>`;
}
function viewSecurity() {
  const u = S.u, ver = !!u.email_verified, hasMail = !!u.email;
  const mIc = window.PTIcons && window.PTIcons.brand.mail ? svgWrap(window.PTIcons.brand.mail) : ic("shield");
  return `
  ${pageHead(`${ic("shield")} Keamanan akun`, `Email & kata sandi untuk masuk ke <b>@${esc(u.username)}</b>.`)}
  <div class="card" id="pvCard">
    <div class="cardh"><div class="t">${mIc} Verifikasi email</div></div>
    <div class="cardbody">
      <div class="secrow">
        <div class="seinfo"><b>Email</b><span class="sem">${hasMail ? esc(u.email) : "Belum ada email"}</span>
          ${ver ? '<span class="pill ok">Terverifikasi</span>' : '<span class="pill no">Belum diverifikasi</span>'}</div>
        ${!ver && hasMail ? '<button class="tbtn" id="pResend">Kirim ulang verifikasi</button>' : ""}
      </div>
      <p class="mini" style="line-height:1.7;margin-top:12px">${ver ? "Email ini dipakai untuk pemulihan akun dan pemberitahuan penting." : "Klik tautan pada email verifikasi untuk mengaktifkan akun sepenuhnya."}</p>
    </div>
  </div>
  <div class="card">
    <div class="cardh"><div class="t">${ic("shield")} Ganti kata sandi</div></div>
    <div class="cardbody">
      <form id="psForm" class="frm" autocomplete="off">
        <div class="fld full"><label>Kata sandi lama</label>
          <div class="pwrow"><input id="psOld" type="password" autocomplete="current-password" placeholder="••••••••"></div>
          <div class="hint">${u.hasPassword ? "Wajib diisi dengan kata sandi saat ini." : "Akun dari Google/Discord — kosongkan bila belum pernah membuat kata sandi."}</div>
        </div>
        <div class="fld full"><label>Kata sandi baru</label>
          <div class="pwrow"><input id="psNew" type="password" autocomplete="new-password" placeholder="••••••••"></div>
          <div class="pwchk" id="psChk"><span data-k="len">8+ karakter</span><span data-k="num">angka</span><span data-k="mix">huruf kecil & besar</span></div>
        </div>
        <div class="fld full"><label>Ulangi kata sandi baru</label>
          <div class="pwrow"><input id="psNew2" type="password" autocomplete="new-password" placeholder="••••••••"></div>
        </div>
        <div class="er" id="psErr"></div>
        <div class="frow"><button class="act" id="psSave" style="flex:1">${ic("shield")} Simpan kata sandi baru</button></div>
      </form>
    </div>
  </div>`;
}
function viewShare() {
  const u = S.u, url = loc(), enc = encodeURIComponent(url), t = encodeURIComponent("Cek halaman " + u.name + " di Pautin");
  const cells = [
    ["whatsapp", "WhatsApp", "#25D366", "https://wa.me/?text={{T}}%20{{U}}"],
    ["x", "X", "#000", "https://twitter.com/intent/tweet?text={{T}}&url={{U}}"],
    ["telegram", "Telegram", "#229ED9", "https://t.me/share/url?url={{U}}&text={{T}}"],
    ["facebook", "Facebook", "#1877F2", "https://www.facebook.com/sharer/sharer.php?u={{U}}"],
  ].map(([k, label, color, href]) => {
    const pp = window.PTIcons.brand[k];
    return `<a class="shs" href="${href.replace("{{T}}", t).replace("{{U}}", enc)}" target="_blank" rel="noopener"><span class="c" style="background:${color}">${svgWrap(pp)}</span>${label}</a>`;
  }).join("");
  return `
  ${pageHead(`${ic("share")} Bagikan halamanmu`, `Sebarkan <b>@${esc(u.username)}</b> — satu alamat untuk semua tautanmu.`)}
  <div class="card">
    <div class="cardbody">
      <div class="shareurl big"><input id="su" readonly value="${esc(url)}"><button data-act="copyshare">Salin</button></div>
      <div class="sharegrid big">${cells}
        <button class="shs" data-act="nativeshare"><span class="c" style="background:#0F5B4D">${ic("share")}</span>Lainnya</button>
        <a class="shs" href="/dashboard/qr"><span class="c" style="background:#1B2B24">${ic("eyeUp")}</span>QR code</a>
      </div>
      <div class="tipband">${ic("doc")} <span>Pasang link ini di bio Instagram/TikTok, kartu nama digital, atau profil komunitas.</span></div>
    </div>
  </div>`;
}
function viewQr() {
  return `
  ${pageHead(`${ic("eyeUp")} QR code`, `Scan dari HP atau unduh PNG untuk kartu nama, poster, dan kemasan.`)}
  <div class="qpage">
    <div class="card qrcard">
      <div id="qr"><div style="color:var(--mute);font-size:12px;padding:12px">Menyiapkan QR…</div></div>
      <button class="act" data-act="downqr" style="width:100%;margin-top:16px">${ic("download")} Unduh PNG</button>
      <p class="mini" style="margin-top:10px;text-align:center">Berisi link halaman <b>@${esc(S.u.username)}</b> yang selalu terbaru.</p>
    </div>
    <div class="card" style="flex:1">
      <div class="cardh"><div class="t">${ic("copy")} Link halamanmu</div></div>
      <div class="cardbody">
        <div class="shareurl"><input id="su2" readonly value="${esc(loc())}"><button data-act="copyshare2">Salin</button></div>
        <a class="act" href="/u/${esc(S.u.username)}" target="_blank" rel="noopener" style="display:flex;justify-content:center;margin-top:14px;text-decoration:none">${ic("external")} Buka halaman publik</a>
      </div>
    </div>
  </div>`;
}
function viewPage() {
  const u = S.u;
  return `
  ${pageHead(`${ic("eyeUp")} Halaman publikmu`, `Inilah yang dilihat orang saat membuka <b>@${esc(u.username)}</b>. Perubahan langsung tampil di sini.`,
    `<a class="act" href="/u/${esc(u.username)}" target="_blank" rel="noopener">${ic("external")} Buka tab baru</a>`)}
  <div class="card pvframe"><iframe src="/u/${esc(u.username)}" title="Pratinjau halaman publik" loading="eager"></iframe></div>
  <div class="qgrid" style="margin-top:14px">
    <a class="qcard" href="/dashboard/tautan"><span class="qi" style="background:#E4EFEA;color:var(--green)">${ic("plus")}</span><div><b>Atur isi</b><span>Tambah/edit tautan & grup</span></div></a>
    <a class="qcard" href="/dashboard/tampilan"><span class="qi" style="background:#EFEAF9;color:#7C3AED">${gn("palette")}</span><div><b>Atur tampilan</b><span>Tema, aksen, foto, huruf</span></div></a>
    <a class="qcard" href="/dashboard/profil"><span class="qi" style="background:#FFF3DF;color:#B45309">${ic("users")}</span><div><b>Edit profil</b><span>Nama, bio, foto</span></div></a>
    <a class="qcard" href="/dashboard/bagikan"><span class="qi" style="background:#FBE9E4;color:var(--orange)">${ic("share")}</span><div><b>Bagikan</b><span>Salin link atau QR code</span></div></a>
  </div>`;
}
function viewTheme() {
  return `
  ${pageHead(`${gn("palette")} Tampilan & tema`, `Semua pengaturan tampilan halaman publik <b>@${esc(S.u.username)}</b> — langsung terlihat di pratinjau.`)}
  <div class="tset">
    <div class="card tpre">
      <div class="cardh"><div class="t">Pratinjau langsung</div></div>
      <div class="pvb bigpvb" id="pvb">
        <div class="av2" id="pvAva">${S.u.avatar ? `<img src="${esc(cloudOpt(S.u.avatar, 140))}" alt="">` : esc(initials(S.u.name))}</div>
        <div class="nm" id="pvName">${esc(S.u.name)}</div>
        <div class="bi" id="pvBio">${esc(S.u.bio || "Tambahkan bio singkat dari menu Edit profil.")}</div>
        <div class="ln" id="pvRows"><i>${ic("linkUI")}</i><i>${ic("linkUI")}</i><i>${ic("linkUI")}</i></div>
      </div>
      <p class="mini" style="text-align:center;margin-top:12px">Persis seperti yang dilihat pengunjung halamanmu.</p>
    </div>
    <div class="card tctl">
      <div class="cardh"><div class="t">Pilih tema</div></div>
      <div class="themes" id="thRow"></div>
      <div class="sectag">Bentuk tombol</div>
      <div class="shape-row" id="radRow"></div>
      <div class="sectag">Gaya daftar tautan</div>
      <div class="shape-row" id="gridRow"></div>
      <div class="sectag">Bentuk foto profil</div>
      <div class="shape-row" id="avRow"></div>
      <div class="sectag">Gaya huruf</div>
      <div class="shape-row" id="fontRow"></div>
      <div class="sectag">Warna aksen <span class="opt">opsional</span></div>
      <div class="accrow pageacc" id="accRow"></div>
      <div class="sepline"></div>
      <button class="tbtn" data-nav="defaults" style="width:100%;justify-content:center">Kembalikan semua ke bawaan</button>
    </div>
  </div>`;
}
function viewGuide() {
  const tips = [
    ["linkUI", "Tambah tautan", "Buka halaman Tautan lalu klik Tambah Tautan. Tautan media sosial otomatis jadi ikon bulat.", "/dashboard/tautan?add=1"],
    ["palette", "Atur tampilan", "Pilih tema, bentuk tombol, gaya daftar, dan warna aksen di halaman Tampilan.", "/dashboard/tampilan"],
    ["chart", "Pantau statistik", "Halaman Statistik menampilkan grafik 30 hari serta tautan terpopuler.", "/dashboard/statistik"],
    ["share", "Bagikan", "Salin link, bagikan ke WhatsApp/media sosial, atau unduh QR code di halaman Bagikan & QR.", "/dashboard/bagikan"],
    ["shield", "Keamanan", "Verifikasi email dan ganti kata sandi ada di halaman Keamanan. Lupa sandi? Gunakan tautan di halaman masuk.", "/dashboard/keamanan"],
    ["doc", "Grup & folder", "Isi kolom Grup saat menambah/mengedit tautan agar tampil berkelompok dengan judul seksi.", "/dashboard/grup"],
    ["heart", "Feedback", "Punya saran, kritik, atau menemukan kendala? Sampaikan lewat halaman Feedback.", "/feedback"],
  ];
  return `
  ${pageHead(`${ic("doc")} Panduan cepat`, `Cara memanfaatkan Pautin untuk halaman yang rapi dan mudah dibagikan.`)}
  <div class="card"><div class="gtips page">
    ${tips.map(([icn, h, tx, url]) => `<div class="gtip"><span class="gti">${ic(icn)}</span><div><b>${h}</b><p>${tx}</p></div><a class="ob oj" href="${url}" title="Buka">${ic("arrowR")}</a></div>`).join("")}
  </div></div>`;
}

/* ================= binding ================= */
let __rootBinds = false;
function bindRootEvents() {
  if (__rootBinds) return; __rootBinds = true;
  window.addEventListener("popstate", () => { routeView(); window.scrollTo({ top: 0 }); });
  document.addEventListener("click", (ev) => {
    const m = $("#menu");
    if (m && m.classList.contains("open") && !ev.target.closest(".menu")) m.classList.remove("open");
  });
  rootEl().addEventListener("click", async (ev) => {
    const p = ev.target.closest("[data-p]");
    if (p) { ev.preventDefault(); goPath(p.getAttribute("href")); return; }
    const t = ev.target.closest("[data-act],[data-nav],[data-ngt]");
    if (!t) return;
    const act = t.dataset.act || "";
    const closeMenu = () => { const m = $("#menu"); if (m) m.classList.remove("open"); };
    if (act === "menu") { $("#menu").classList.toggle("open"); }
    else if (act === "logout") { dashLogout(); }
    else if (act === "copyurl") copyText(loc(), "Link halaman disalin.");
    else if (act === "copylink") copyText(t.dataset.url, "URL disalin.");
    else if (act === "copyshare" || act === "copyshare2") { const i = act === "copyshare" ? $("#su") : $("#su2"); if (i) { i.select(); copyText(i.value, "Link disalin."); } }
    else if (act === "share" || act === "profile" || act === "stats") { closeMenu(); if (act === "share") goPath("/dashboard/bagikan"); else if (act === "profile") goPath("/dashboard/profil"); else goPath("/dashboard/statistik"); }
    else if (act === "addtoggle") { if (S.editing) resetForm(); toggleAdd(); if (!S.showAdd) resetForm(); }
    else if (act === "canceladd") { toggleAdd(false); resetForm(); }
    else if (act === "savelink") saveLink();
    else if (act === "openlink") { const l = S.links.find((x) => x.id === Number(t.dataset.id)); if (l) window.open(l.url, "_blank"); }
    else if (act === "editlink") goPath("/dashboard/tautan?edit=" + t.dataset.id);
    else if (act === "dellink") delLink(Number(t.dataset.id));
    else if (act === "closenote") { const n = $("#welcome"); if (n) n.remove(); }
    else if (act === "nativeshare") shareNative();
    else if (act === "downqr") downQr();
    else if (act === "closeModal") closeModal();
    else if (t.dataset.ngt) {
      const sec = rootEl().querySelector(`.ng[data-ng="${t.dataset.ngt}"]`);
      if (sec) { const closed = sec.classList.toggle("closed"); t.classList.toggle("closed", closed); t.setAttribute("aria-expanded", String(!closed)); }
    }
    else if (t.dataset.nav) dashNav(t.dataset.nav);
  });
  const mv = $("#mv");
  if (mv) mv.addEventListener("click", (ev) => { if (ev.target.id === "mv") closeModal(); });
}
function bindViewHooks(view) {
  const grid = $("#iconGrid");
  if (grid) grid.addEventListener("click", (ev) => { const b = ev.target.closest("[data-ic]"); if (b) pickIcon(b.dataset.ic); });
  const th = $("#thRow"); if (th) th.addEventListener("click", (ev) => { const b = ev.target.closest("[data-theme]"); if (b) setTheme(b.dataset.theme); });
  const rr = $("#radRow"); if (rr) rr.addEventListener("click", (ev) => { const b = ev.target.closest("[data-radius]"); if (b) setRadius(b.dataset.radius); });
  [["gridRow", "grid", GRID_OPT], ["avRow", "av", AV_OPT], ["fontRow", "font", FONT_OPT]].forEach(([rid, attr, map]) => {
    const r = $("#" + rid);
    if (r) r.addEventListener("click", (ev) => { const b = ev.target.closest("[data-" + attr + "]"); if (b) setOpt(attr, b.dataset[attr], map); });
  });
  const af = $("#avaFile");
  if (af) af.addEventListener("change", () => uploadAvatar(af));
  const up = $("#pfUp"); if (up) up.addEventListener("click", () => $("#avaFile").click());

  const sv = $("#pfSave");
  if (sv) sv.addEventListener("click", saveProfilePage);
  const rm2 = $("#pfRemove2");
  if (rm2) rm2.addEventListener("click", () => { S.u.avatar = ""; const avf = $("#pfUrl"); if (avf) avf.value = ""; const ap = $("#avaPrev"); if (ap) ap.innerHTML = ic("users"); });
  const rs = $("#pResend");
  if (rs) rs.addEventListener("click", () => {
    rs.disabled = true;
    send("verify/resend", "POST", { email: S.u.email })
      .then(() => { rs.disabled = false; toast("Tautan verifikasi terkirim ulang."); })
      .catch((e) => { rs.disabled = false; toast(e.message, 1); });
  });
  const pn = $("#psNew");
  if (pn) pn.addEventListener("input", () => {
    const v = pn.value, has = { len: v.length >= 8, num: /\d/.test(v), mix: /[a-z]/.test(v) && /[A-Z]/.test(v) };
    ["len", "num", "mix"].forEach((k) => { const c = $("#psChk") && $("#psChk").querySelector(`[data-k="${k}"]`); if (c) c.classList.toggle("on", !!has[k]); });
  });
  const ps = $("#psSave");
  if (ps) ps.addEventListener("click", async () => {
    const err = $("#psErr"); if (err) err.classList.remove("show");
    const p1 = $("#psNew").value, p2 = $("#psNew2").value;
    if (p1.length < 8) return pageErr("psErr", "Kata sandi baru minimal 8 karakter.");
    if (!/\d/.test(p1)) return pageErr("psErr", "Kata sandi baru harus mengandung angka.");
    if (!/[a-z]/.test(p1) || !/[A-Z]/.test(p1)) return pageErr("psErr", "Kata sandi baru harus punya huruf kecil dan besar.");
    if (p1 !== p2) return pageErr("psErr", "Ulangi kata sandi tidak sama.");
    ps.disabled = true;
    try {
      await send("password", "POST", { old: $("#psOld").value, password: p1 });
      $("#psOld").value = $("#psNew").value = $("#psNew2").value = "";
      S.u.hasPassword = true;
      toast("Kata sandi baru disimpan.");
    } catch (x) { ps.disabled = false; pageErr("psErr", x.message); }
  });
  if (view === "home") updateStats();
}
function pageErr(id, m) { const e = $("#" + id); if (!e) return; e.textContent = m; e.classList.add("show"); }
async function saveProfilePage() {
  const name = $("#pfName").value.trim();
  const bio = $("#pfBio").value.trim().slice(0, 200);
  const av = ($("#pfUrl").value || "").trim();
  const err = $("#pErr"); if (err) err.classList.remove("show");
  if (!name) return pageErr("pErr", "Nama tampilan wajib diisi.");
  try {
    await send("profile", "PUT", { name, bio, avatar: av });
    S.u.name = name; S.u.bio = bio; S.u.avatar = av;
    paintAvatar();
    const ap = $("#avaPrev");
    if (ap) ap.innerHTML = S.u.avatar ? `<img src="${esc(cloudOpt(S.u.avatar, 160))}" alt="">` : ic("users");
    toast("Profil diperbarui.");
  } catch (e) { pageErr("pErr", e.message); }
}


function paintAvatar() {
  const u = S.u;
  const mava = $("#mava");
  if (mava) mava.innerHTML = u.avatar ? `<img src="${esc(cloudOpt(u.avatar, 90))}" alt="">` : esc(initials(u.name));
  const pa = $("#pvAva");
  if (pa) pa.innerHTML = u.avatar ? `<img src="${esc(cloudOpt(u.avatar, 140))}" alt="">` : esc(initials(u.name));
  $("#pvName") && ($("#pvName").textContent = u.name);
  $("#pvBio") && ($("#pvBio").textContent = u.bio || "Tambahkan bio singkat dari menu Edit profil.");
}

const THEME_INFO = {
  galaxy: { t: "Galaksi", b: "#0c0a1e", d: "radial-gradient(160px 120px at 80% -10%, rgba(139,92,246,.5), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(236,72,153,.3), transparent 70%)", dark: 1 },
  midnight: { t: "Tengah Malam", b: "#05070f", d: "radial-gradient(160px 120px at 82% -10%, rgba(56,189,248,.3), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(99,102,241,.4), transparent 70%)", dark: 1 },
  laut: { t: "Laut Dalam", b: "#031d24", d: "radial-gradient(160px 120px at 82% -10%, rgba(34,211,238,.4), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(21,128,61,.45), transparent 70%)", dark: 1 },
  hutan: { t: "Hutan Pinus", b: "#061109", d: "radial-gradient(160px 120px at 82% -10%, rgba(52,211,153,.35), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(101,163,13,.3), transparent 70%)", dark: 1 },
  kopi: { t: "Kopi Susu", b: "#120b08", d: "radial-gradient(160px 120px at 82% -10%, rgba(217,119,6,.38), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(180,83,9,.35), transparent 70%)", dark: 1 },
  mentari: { t: "Mentari", b: "#fff3e4", d: "radial-gradient(160px 120px at 82% -10%, rgba(251,146,60,.35), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(244,63,94,.18), transparent 70%)", dark: 0 },
  mawar: { t: "Mawar", b: "#fdeef3", d: "radial-gradient(160px 120px at 82% -10%, rgba(244,114,182,.35), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(190,24,93,.18), transparent 70%)", dark: 0 },
  kertas: { t: "Kertas Putih", b: "#f4f6fb", d: "radial-gradient(160px 120px at 82% -10%, rgba(99,102,241,.22), transparent 70%), radial-gradient(150px 110px at -10% 110%, rgba(14,165,233,.18), transparent 70%)", dark: 0 },
};
const RADII_MAP = { full: "Lingkaran", soft: "Membulat", sharp: "Persegi" };
const R_SYM = { full: "●", soft: "◖◗", sharp: "▢" };
const GRID_OPT = { list: "Satu kolom", grid2: "Dua kolom" };
const AV_OPT = { circle: "Bulat", round: "Lembut", square: "Kotak" };
const FONT_OPT = { sans: "Sans", serif: "Serif", mono: "Mono" };
function segInto(row, map, cur, attr) {
  if (!row) return;
  row.innerHTML = "";
  Object.keys(map).forEach((k) => {
    const b = document.createElement("button");
    b.className = "sh" + (k === cur ? " on" : "");
    b.dataset[attr] = k; b.textContent = map[k]; b.title = map[k];
    row.appendChild(b);
  });
}

function renderThemes() {
  const th = $("#thRow"); th.innerHTML = "";
  Object.keys(THEME_INFO).forEach((k) => {
    const b = document.createElement("button");
    b.className = "th" + (k === S.u.theme ? " on" : "");
    b.dataset.theme = k; b.title = THEME_INFO[k].t;
    b.style.background = THEME_INFO[k].b;
    b.style.backgroundImage = THEME_INFO[k].d;
    th.appendChild(b);
  });
  const rr = $("#radRow"); rr.innerHTML = "";
  Object.keys(RADII_MAP).forEach((k) => {
    const b = document.createElement("button");
    b.className = "sh" + (k === S.u.radius ? " on" : "");
    b.dataset.radius = k; b.textContent = R_SYM[k]; b.title = RADII_MAP[k];
    rr.appendChild(b);
  });
  segInto($("#gridRow"), GRID_OPT, S.u.grid || "list", "grid");
  segInto($("#avRow"), AV_OPT, S.u.av || "circle", "av");
  segInto($("#fontRow"), FONT_OPT, S.u.font || "sans", "font");
  renderAccRow();
  paintPreview();
}

/* ================= aksen warna ================= */
const ACC_DEFAULT = ["", "#E4572E", "#0F5B4D", "#2563EB", "#7C3AED", "#BE185D", "#D97706", "#0E7490", "#334155"];
function renderAccRow() {
  const r = $("#accRow"); if (!r) return;
  const cur = (S.u.accent || "").toLowerCase();
  r.innerHTML = ACC_DEFAULT.map((hex) =>
    hex
      ? `<button type="button" class="acc" data-hex="${hex}" title="Aksen ${hex}" style="background:${hex}"></button>`
      : `<button type="button" class="acc def${cur ? "" : " on"}" data-hex="" title="Pakai warna bawaan tema">A</button>`
  ).join("") +
    `<label class="acc cust" title="Pilih warna sendiri"><input type="color" id="accPick" value="${/^#[0-9a-f]{6}$/.test(cur) ? cur : "#E4572E"}">${gn("palette")}</label>`;
  r.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-hex]");
    if (b) { setAccent(b.dataset.hex || ""); paintAccSel(); }
  });
  const ip = $("#accPick");
  if (ip) ip.addEventListener("input", () => setAccent(ip.value));
}
function paintAccSel() {
  const cur = (S.u.accent || "").toLowerCase();
  $$("#accRow [data-hex]").forEach((b) => b.classList.toggle("on", (b.dataset.hex || "") === cur));
}
function setAccent(hex) {
  hex = String(hex || "").toLowerCase();
  S.u.accent = /^#[0-9a-f]{6}$/.test(hex) ? hex : "";
  paintAccSel();
  paintPreview();
  const ip = $("#accPick"); if (ip) ip.value = S.u.accent || "#E4572E";
  send("settings", "PUT", { accent: S.u.accent })
    .then(() => toast(S.u.accent ? "Warna aksen disimpan." : "Aksen kembali ke bawaan tema."))
    .catch((e) => toast(e.message, 1));
}
function paintPreview() {
  const pvb = $("#pvb"); if (!pvb) return;
  const t = THEME_INFO[S.u.theme] || THEME_INFO.galaxy;
  pvb.style.background = t.b; pvb.style.backgroundImage = t.d;
  const fg = t.dark ? "#f4f1fb" : "#3a2338";
  const pbtn = t.dark ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.85)";
  pvb.style.setProperty("--pb", pbtn);
  if (S.u.accent) pvb.style.setProperty("--pvacc", S.u.accent + "3d");
  else pvb.style.removeProperty("--pvacc");
  pvb.style.color = fg;
  $$("#pvName,#pvBio", pvb).forEach((el) => { el.style.color = fg; });
  const pva = $("#pvAva");
  if (pva) pva.style.borderRadius = { circle: "50%", round: "28%", square: "14px" }[S.u.av] || "50%";
  const fam = S.u.font === "serif" ? "Georgia,'Times New Roman',serif" : S.u.font === "mono" ? "ui-monospace,Menlo,Consolas,monospace" : "";
  const pn = $("#pvName"), pb = $("#pvBio");
  if (pn) pn.style.fontFamily = fam || ""; if (pb) pb.style.fontFamily = fam || "";
  const rows = $("#pvRows");
  if (rows) {
    if (S.u.grid === "grid2") { rows.style.display = "grid"; rows.style.gridTemplateColumns = "1fr 1fr"; rows.style.gap = "7px"; }
    else { rows.style.display = ""; rows.style.gridTemplateColumns = ""; rows.style.gap = ""; }
  }
}
async function setTheme(k) { S.u.theme = k; paintPreview(); $$("#thRow .th").forEach((x) => x.classList.toggle("on", x.dataset.theme === k)); send("settings", "PUT", { theme: k }).then(() => toast("Tema: " + THEME_INFO[k].t)).catch((e) => toast(e.message, 1)); }
async function setRadius(k) { S.u.radius = k; $$("#radRow .sh").forEach((x) => x.classList.toggle("on", x.dataset.radius === k)); send("settings", "PUT", { radius: k }).then(() => toast("Bentuk tombol: " + RADII_MAP[k])).catch((e) => toast(e.message, 1)); }
const SEG_LBL = { grid: "Gaya daftar", av: "Bentuk foto", font: "Gaya huruf" };
async function setOpt(attr, k, map) {
  S.u[attr] = k;
  paintPreview();
  $$("#" + attr + "Row .sh").forEach((x) => x.classList.toggle("on", x.dataset[attr] === k));
  send("settings", "PUT", { [attr]: k }).then(() => toast(SEG_LBL[attr] + ": " + map[k])).catch((e) => toast(e.message, 1));
}

/* ================= ikon picker ================= */
function renderIconPicker() {
  const grid = $("#iconGrid"); if (!grid) return;
  const gk = Object.keys(window.PTIcons.gen || {});
  const bk = Object.keys(window.PTIcons.brand || {});
  const br = bk.map((k) => {
    const p = window.PTIcons.brand[k];
    return `<button class="ig igb" data-ic="b:${esc(k)}" title="${esc(k)}">${p ? svgWrap(p, PTIcons.colors && PTIcons.colors[k]) : ""}</button>`;
  }).join("");
  grid.innerHTML = `<button class="ig none on" data-ic="" title="Tanpa ikon">Tanpa</button>` +
    gk.map((k) => `<button class="ig" data-ic="${esc(k)}" title="${esc(k)}">${gn(k)}</button>`).join("") +
    (bk.length ? `<span class="igsep"></span>${br}` : "");
  syncPicker();
}
function syncPicker() {
  const cur = S.editing ? (S.links.find((l) => l.id === S.editing) || {}) : {};
  const key = S.iconKey;
  $$("#iconGrid .ig").forEach((b) => b.classList.toggle("on", b.dataset.ic === (key || "")));
  $("#pickPrev").innerHTML = key ? gn(key) : gn("globe");
  void cur;
}
function pickIcon(k) { S.iconKey = k; syncPicker(); }

/* ================= tautan ================= */
function toggleAdd(force) {
  S.showAdd = force !== undefined ? force : !S.showAdd;
  const c = $("#addCard"); if (!c) return;
  c.hidden = !S.showAdd;
  $("#addLbl").textContent = S.showAdd ? "Tutup" : "Tambah Tautan";
  if (S.showAdd && !S.editing) { $("#lT").focus(); }
}
function resetForm() {
  $("#lT").value = ""; $("#lU").value = ""; $("#lG").value = ""; $("#lErr").classList.remove("show");
  $("#saveLbl").textContent = "Simpan Tautan"; S.editing = null; S.iconKey = "";
  syncPicker();
}
function openEdit(id) {
  const l = S.links.find((x) => x.id === id); if (!l) return;
  S.editing = id; S.iconKey = l.emoji || "";
  $("#lT").value = l.title; $("#lU").value = l.url; $("#lG").value = l.grp || "";
  $("#saveLbl").textContent = "Simpan Perubahan";
  if (!S.showAdd) toggleAdd(true);
  syncPicker();
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("#lT").focus();
}
function validateUrl(u) {
  if (!u) return "Tautan (URL) wajib diisi.";
  if (!/^https?:\/\//i.test(u) && !/^mailto:/i.test(u)) return "URL harus diawali https:// (atau mailto: untuk email).";
  return "";
}
async function persistLinks() {
  const me = await get("me"); S.links = me.links; S.totalClicks = me.total_clicks;
  updateStats(); renderLinks();
}
async function saveLink() {
  const title = $("#lT").value.trim(), url = $("#lU").value.trim();
  const e = validateUrl(url);
  if (e) return showFormErr(e);
  const body = { title, url, emoji: S.iconKey, grp: $("#lG").value.trim() };
  try {
    if (S.editing) await send("links/" + S.editing, "PUT", body);
    else await send("links", "POST", body);
    await persistLinks();
    const wasEdit = !!S.editing;
    toggleAdd(false); resetForm();
    toast(wasEdit ? "Perubahan disimpan." : "Tautan ditambahkan.");
  } catch (x) { showFormErr(x.message); }
}
function showFormErr(m) { const el = $("#lErr"); el.textContent = m; el.classList.add("show"); }
async function delLink(id) {
  const l = S.links.find((x) => x.id === id);
  if (!window.confirm(`Hapus tautan "${l ? l.title : ""}" dari halamanmu?`)) return;
  try { await send("links/" + id, "DELETE"); await persistLinks(); toast("Tautan dihapus."); } catch (x) { toast(x.message, 1); }
}
function renderLinks() {
  const wrap = $("#linkList"); if (!wrap) return;
  $("#lCnt").textContent = S.links.length;
  $("#nLinkCnt") && ($("#nLinkCnt").textContent = S.links.length);
  const ls = $("#listSub"); if (ls) ls.textContent = S.links.length ? `total ${S.links.length} tautan` : "";
  if (!S.links.length) {
    wrap.innerHTML = `<div class="empty"><div class="e">${ic("linkUI")}</div>
      <div style="font-weight:800;margin-bottom:6px">Belum ada tautan</div>
      <div style="font-size:13px;line-height:1.6">Tambahkan tautan pertamamu dan halamanmu langsung aktif.</div>
      <div class="bt"><button class="emptya" data-act="addtoggle">${ic("plus")} Tambah Tautan Pertama</button></div></div>`;
    return;
  }
  wrap.innerHTML = "";
  S.links.forEach((l) => {
    const row = document.createElement("div");
    row.className = "ll"; row.draggable = true; row.dataset.id = l.id;
    row.innerHTML = `
      <span class="h" title="Seret untuk mengurutkan">${ic("drag")}</span>
      <span class="e">${linkIcon(l)}</span>
      <div class="inf">
        <div class="ti">${esc(l.title)}<span class="kind">${esc(l.kind)}</span></div>
        <div class="ur">${esc(l.url)}${l.grp ? `<span class="grtag">${esc(l.grp)}</span>` : ""}</div>
      </div>
      <span class="cl">${ic("eye")} ${fmtNum(l.clicks)}</span>
      <span class="ops">
        <button class="ob" data-act="openlink" data-id="${l.id}" title="Buka">${ic("external")}</button>
        <button class="ob" data-act="copylink" data-url="${esc(l.url)}" title="Salin URL">${ic("copy")}</button>
        <button class="ob oj" data-act="editlink" data-id="${l.id}" title="Edit">${ic("pencil")}</button>
        <button class="ob del" data-act="dellink" data-id="${l.id}" title="Hapus">${ic("trash")}</button>
      </span>`;
    wrap.appendChild(row);
  });
  wireDnD(wrap);
}
function updateStats() {
  $("#stViews") && ($("#stViews").textContent = fmtNum(S.u.views));
  $("#stClicks") && ($("#stClicks").textContent = fmtNum(S.totalClicks));
  $("#stLinks") && ($("#stLinks").textContent = S.links.length);
  $("#stJoin") && ($("#stJoin").textContent = fmtDate(S.u.created_at));
  $("#nViewCnt") && ($("#nViewCnt").textContent = fmtNum(S.u.views));
}
function wireDnD(wrap) {
  let drag = null;
  $$(".ll", wrap).forEach((row) => {
    row.addEventListener("dragstart", (ev) => {
      drag = row; row.classList.add("dragging");
      try { ev.dataTransfer.setData("text/plain", row.dataset.id); } catch {}
    });
    row.addEventListener("dragend", async () => {
      row.classList.remove("dragging");
      if (!drag) { $$(".ll.over", wrap).forEach((r) => r.classList.remove("over")); return; }
      const to = wrap.querySelector(".over");
      $$(".ll.over", wrap).forEach((r) => r.classList.remove("over"));
      if (!to || to === drag) { drag = null; return; }
      const arr = Array.from(wrap.querySelectorAll(".ll"));
      const a = arr.indexOf(drag), b = arr.indexOf(to);
      drag = null;
      if (a < 0 || b < 0) return;
      arr.splice(a, 1); arr.splice(b, 0, arr[a]); // geser baris
      const ids = arr.map((r) => Number(r.dataset.id));
      const ordered = ids.map((id) => S.links.find((l) => l.id === id)).filter(Boolean);
      wrap.innerHTML = "";
      ordered.forEach((l) => wrap.appendChild(rowEl2(l)));
      wireDnD(wrap);
      try {
        await send("reorder", "POST", { ids });
        const me = await get("me"); S.links = me.links; updateStats();
        toast("Urutan disimpan.");
      } catch (e) { toast(e.message, 1); renderLinks(); }
    });
    row.addEventListener("dragover", (ev) => { ev.preventDefault(); if (drag && drag !== row) row.classList.add("over"); });
    row.addEventListener("dragleave", () => row.classList.remove("over"));
    row.addEventListener("drop", (ev) => ev.preventDefault());
  });
}
function rowEl2(l) {
  const el = document.createElement("div");
  el.className = "ll"; el.draggable = true; el.dataset.id = l.id;
  el.innerHTML = `
    <span class="h" title="Seret untuk mengurutkan">${ic("drag")}</span>
    <span class="e">${linkIcon(l)}</span>
    <div class="inf"><div class="ti">${esc(l.title)}<span class="kind">${esc(l.kind)}</span></div><div class="ur">${esc(l.url)}</div></div>
    <span class="cl">${ic("eye")} ${fmtNum(l.clicks)}</span>
    <span class="ops">
      <button class="ob" data-act="openlink" data-id="${l.id}">${ic("external")}</button>
      <button class="ob" data-act="copylink" data-url="${esc(l.url)}">${ic("copy")}</button>
      <button class="ob oj" data-act="editlink" data-id="${l.id}">${ic("pencil")}</button>
      <button class="ob del" data-act="dellink" data-id="${l.id}">${ic("trash")}</button>
    </span>`;
  return el;
}
function dragIdOf() { return 0; }

/* ================= aksi menu navigasi ================= */
function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }
async function dashLogout() {
  window.__ptok = null;
  try { await send("logout", "POST"); } catch {}
  await ensureCfg(); renderAuth("login");
}
async function resetLook() {
  if (!window.confirm("Kembalikan tema, aksen, dan bentuk tampilan ke bawaan?")) return;
  try {
    await send("settings", "PUT", { theme: "galaxy", accent: "", radius: "full", grid: "list", av: "circle", font: "sans" });
    location.reload();
  } catch (e) { toast(e.message, 1); }
}
function dashNav(k) {
  const u = S.u;
  switch (k) {
    case "refresh": persistLinks().then(() => { routeView(); toast("Data diperbarui."); }); break;
    case "copyurl": copyText(loc(), "Link halaman disalin."); break;
    case "copyuser": copyText("@" + u.username, "Username disalin."); break;
    case "logout": dashLogout(); break;
    case "defaults": resetLook(); break;
    case "navtoggle": { const c = $("#navCard"); if (c) { c.hidden = !c.hidden; toast(c.hidden ? "Panel menu disembunyikan." : "Panel menu ditampilkan kembali."); } } break;
  }
}

function copyText(txt, msg) {
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
    .then(() => toast(msg))
    .catch(() => toast(txt));
}
async function shareNative() {
  const loc = () => location.href.split("#")[0];
  try {
    if (navigator.share) { await navigator.share({ title: document.title, url: loc() }); return; }
    throw 0;
  } catch {}
  try { await navigator.clipboard.writeText(loc()); toast("Link disalin — tinggal tempel di mana saja."); }
  catch { const v = window.prompt("Salin link halamanmu:", loc()); if (v === null) closeModal(); }
}

/* ================= grafik statistik ================= */
function statChartHtml(d) {
  const days = d.days || [];
  const max = Math.max(1, ...days.map((x) => Math.max(x.views, x.clicks)));
  const W = 600, H = 210, pl = 40, pr = 6, pt = 14, pb = 26;
  const iw = W - pl - pr, ih = H - pt - pb;
  const n = Math.max(1, days.length);
  const step = iw / n;
  const bw = Math.min(9, Math.max(2, step / 2 - 3));
  const grid = [0, .25, .5, .75, 1].map((f) => {
    const y = pt + ih * (1 - f);
    return `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" stroke="#EFE7D8" stroke-width="1"/><text x="${pl - 7}" y="${y + 3}" font-size="9" fill="#A89F8C" text-anchor="end">${Math.round(max * f)}</text>`;
  }).join("");
  const cols = days.map((x, i) => {
    const vh = Math.round((x.views / max) * ih), ch = Math.round((x.clicks / max) * ih);
    const cx = pl + step * i + step / 2;
    const x0 = cx - bw - 1, x1 = cx + 1;
    const lab = dayLabel(x.day);
    return `<g>
      <rect x="${x0}" y="${H - pb - vh}" width="${bw}" height="${vh || 0}" rx="2" fill="#0F5B4D"><title>${lab}: ${x.views} kunjungan</title></rect>
      <rect x="${x1}" y="${H - pb - ch}" width="${bw}" height="${ch || 0}" rx="2" fill="#E4572E"><title>${lab}: ${x.clicks} klik</title></rect>
      ${i % 5 === 0 ? `<text x="${cx}" y="${H - 9}" font-size="9.5" fill="#8B8575" text-anchor="middle">${dayShort(x.day)}</text>` : ""}
    </g>`;
  }).join("");
  const top = (d.top || []);
  const topHtml = top.length
    ? top.map((l) => `<li><span class="stt">${esc(l.title || "Tautan")}</span><b>${l.clicks} klik</b></li>`).join("")
    : `<li class="stn">Belum ada klik tercatat. Bagikan halamanmu dan pantau di sini.</li>`;
  return `
  <div class="sthead">
    <span class="stk v">${d.totalViews}<i>kunjungan</i></span>
    <span class="stk c">${d.totalClicks}<i>klik</i></span>
  </div>
  <svg viewBox="0 0 ${W} ${H}" class="stchart" role="img" aria-label="Grafik kunjungan dan klik 30 hari">${grid}${cols}</svg>
  <div class="stleg"><span class="v"><i></i>Kunjungan</span><span class="c"><i></i>Klik</span></div>
  <div class="sttop"><div class="sttag">Paling sering diklik</div><ul>${topHtml}</ul></div>`;
}
function dayLabel(mmdd) {
  const m = parseInt(mmdd, 10), dd = parseInt(mmdd.slice(3), 10);
  return `${dd} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][(m - 1 + 12) % 12]}`;
}
function dayShort(mmdd) { return String(parseInt(mmdd.slice(3), 10)); }

/* ================= foto profil ================= */
async function uploadAvatar(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  const ALLOW = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!ALLOW.includes(f.type)) { toast("Format gambar tidak didukung.", 1); input.value = ""; return; }
  if (f.size > 6 * 1024 * 1024) { toast("Ukuran maksimal 6 MB.", 1); input.value = ""; return; }
  if (avaUploading) return;
  avaUploading = true;
  // pratinjau lokal cepat
  const rd = new FileReader();
  rd.onload = () => { const p = $("#avaPrev"); if (p) p.innerHTML = `<img src="${rd.result}" alt="pratinjau">`; };
  rd.readAsDataURL(f);
  const fd = new FormData(); fd.append("file", f);
  try {
    const r = await fetch("/api/upload/avatar", { method: "POST", headers: window.__ptok ? { "X-Auth-Token": window.__ptok } : {}, body: fd });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || "Upload gagal.");
    $("#pfUrl").value = j.url;
    S.u.avatar = j.url;
    paintAvatar();
    toast("Foto terunggah. Simpan profil untuk menerapkan.");
  } catch (e) { toast(e.message, 1); paintAvatar(); }
  avaUploading = false; input.value = "";
}
/* ================= modal & QR ================= */
function closeModal() { const mv = $("#mv"); mv.className = "mv"; mv.innerHTML = ""; }
function makeQr(el, text) {
  const img = new Image();
  img.alt = "QR code";
  img.onload = () => { el.innerHTML = ""; el.appendChild(img); };
  img.onerror = () => { el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--mute);font-size:12.5px">QR tidak dapat dimuat tanpa koneksi.<br>Gunakan tombol Salin.</div>'; };
  img.src = "/api/qr?t=" + encodeURIComponent(text);
  el.__img = img;
}
function downQr() {
  const img = $("#qr img");
  if (!img || !img.src || img.src.startsWith("data:")) { toast("QR belum siap.", 1); return; }
  const c = document.createElement("canvas"); c.width = 420; c.height = 420;
  const x = c.getContext("2d");
  x.fillStyle = "#fff"; x.fillRect(0, 0, 420, 420);
  x.drawImage(img, 30, 30, 360, 360);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png"); a.download = "qr-" + S.u.username + ".png";
  a.click();
  toast("QR diunduh.");
}
