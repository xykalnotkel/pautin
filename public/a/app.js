/* PAUTIN — dashboard & halaman autentikasi (client-side) */
"use strict";
const $ = (s, el) => (el || document).querySelector(s);
const rootEl = () => document.getElementById("rootEl");
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const ICONS = {
  logo: '<svg viewBox="0 0 64 64" width="17" height="17" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><path d="M24 42 40 26M27 27h9v9"/></svg>',
  eye:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7.5 11-7.5S23 12 23 12s-4 7.5-11 7.5S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  off:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 2l20 20M6.7 6.7C4 8.5 2.4 11 2.4 11s4 7.5 9.6 7.5c1.2 0 2.3-.2 3.3-.6M9.9 4.2A9.7 9.7 0 0 1 12 4c7 0 11 7.5 11 7.5s-1.5 2.8-4.2 4.9M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ============================================================ state */
const S = { u: null, links: [], themes: {}, radii: {}, showAdd: false, showBanner: true, dragging: null };

function api(path, opt) {
  opt = opt || {};
  opt.headers = Object.assign({}, opt.headers || {});
  if (window.__ptok) opt.headers["X-Auth-Token"] = window.__ptok;
  if (opt.body && typeof opt.body === "string") opt.headers["Content-Type"] = "application/json";
  return fetch("/api/" + path, opt).then(async (r) => {
    let d = {}; try { d = await r.json(); } catch (e) {}
    if (!r.ok) { const e = new Error(d.error || "Terjadi kesalahan"); e.status = r.status; throw e; }
    return d;
  });
}
const get = (p) => api(p);
const send = (p, m, b) => api(p, { method: m || "POST", body: JSON.stringify(b || {}) });
const toast = (msg, bad) => {
  let t = $("#toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.id = "toast"; document.body.appendChild(t); }
  t.className = "toast" + (bad ? " bad" : "") + " show";
  t.innerHTML = msg;
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2300);
};
const initials = (n) => {
  const w = String(n || "?").trim().split(/\s+/).filter(Boolean);
  return (w.length ? w.map((x) => x[0]).join("").slice(0, 2) : "?").toUpperCase();
};
const fmtNum = (n) => new Intl.NumberFormat("id-ID").format(n || 0);
const fmtDate = (t) => new Date(t * 1000).toLocaleDateString("id-ID", { year: "numeric", month: "short" });
const loc = () => location.origin + "/u/" + S.u.username;

/* ============================================================ boot */
window.__pautinBoot = async function () {
  if (window.__pautinBooted) return;
  window.__pautinBooted = true;
  await initThemes();
  const qs = new URLSearchParams(location.search);
  try {
    const d = await get("me");
    window.__ptok = window.__ptok || null;
    S.u = d.user; S.links = d.links; S.totalClicks = d.total_clicks;
    renderDashboard(qs.get("signup") === "1");
    document.title = "Dashboard — " + S.u.username + " | Pautin";
  } catch (e) {
    await ensureCfg();
    renderAuth(qs.get("signup") === "1" ? "signup" : "login");
  }
  history.replaceState(null, "", "/app");
};
// Masuk langsung tanpa reload (aman untuk environment tanpa cookie, mis. preview iframe)
window.__pautinEnter = async function (welcome) {
  const d = await get("me");
  S.u = d.user; S.links = d.links; S.totalClicks = d.total_clicks;
  renderDashboard(!!welcome);
  document.title = "Dashboard — " + S.u.username + " | Pautin";
};

async function initThemes() {
  S.themes = {
    galaxy:  { label: "Galaksi",  base: "#0c0a1e", deco: "radial-gradient(200px 130px at 82% -8%, rgba(139,92,246,.55), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(236,72,153,.3), transparent 70%)" },
    midnight: { label: "Malam",   base: "#05070f", deco: "radial-gradient(200px 130px at 85% -8%, rgba(56,189,248,.26), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(99,102,241,.35), transparent 70%)" },
    laut:    { label: "Laut",     base: "#031d24", deco: "radial-gradient(200px 130px at 85% -8%, rgba(34,211,238,.33), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(21,128,61,.4), transparent 70%)" },
    hutan:   { label: "Hutan",    base: "#061109", deco: "radial-gradient(200px 130px at 85% -8%, rgba(52,211,153,.3), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(101,163,13,.26), transparent 70%)" },
    kopi:    { label: "Kopi",     base: "#120b08", deco: "radial-gradient(200px 130px at 85% -8%, rgba(217,119,6,.33), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(180,83,9,.3), transparent 70%)" },
    mentari: { label: "Mentari",  base: "#fff3e4", deco: "radial-gradient(200px 130px at 85% -8%, rgba(251,146,60,.32), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(244,63,94,.2), transparent 70%)" },
    mawar:   { label: "Mawar",    base: "#fdeef3", deco: "radial-gradient(200px 130px at 85% -8%, rgba(244,114,182,.33), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(190,24,93,.16), transparent 70%)" },
    kertas:  { label: "Kertas",   base: "#f4f6fb", deco: "radial-gradient(200px 130px at 85% -8%, rgba(99,102,241,.2), transparent 70%), radial-gradient(190px 130px at -8% 108%, rgba(14,165,233,.16), transparent 70%)" },
  };
  S.radii = { full: "Lingkaran", soft: "Membulat", sharp: "Persegi" };
}

/* ============================================================ auth */
let __cfgPromise = null;
function ensureCfg() {
  if (window.__cfg) return Promise.resolve(window.__cfg);
  if (__cfgPromise) return __cfgPromise;
  __cfgPromise = get("config").then((c) => (window.__cfg = c)).catch(() => (window.__cfg = { turnstileSiteKey: null }));
  return __cfgPromise;
}
function destroyTurnstile() {
  if (window.__tsWidget !== undefined && window.turnstile) {
    try { window.turnstile.remove(window.__tsWidget); } catch (e) {}
    window.__tsWidget = undefined;
  }
  window.__tsToken = null;
}
function mountTurnstile() {
  destroyTurnstile();
  const key = window.__cfg && window.__cfg.turnstileSiteKey;
  const wrap = $("#tstWrap");
  if (!key || !wrap) return;
  wrap.innerHTML = "";
  const render = () => {
    if (!window.turnstile || !$("#tstWrap")) return;
    window.__tsWidget = window.turnstile.render($("#tstWrap"), {
      sitekey: key,
      callback: (t) => { window.__tsToken = t; },
      "expired-callback": () => { window.__tsToken = null; },
      "error-callback": () => { window.__tsToken = null; },
      theme: "light",
    });
  };
  if (window.turnstile) render();
  else {
    window.__tsOnload = () => { render(); };
    if (!document.getElementById("ts-script")) {
      const s = document.createElement("script");
      s.id = "ts-script";
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsOnload";
      s.async = true; s.defer = true;
      document.body.appendChild(s);
    }
  }
}
window.__tsOnload = window.__tsOnload || null;

const SHARE_COLORS = { WA: "#25D366", IG: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", X: "#000", FB: "#1877F2", TG: "#229ED9", LK: "#0A66C2", CP: "linear-gradient(135deg,#7c3aed,#db2777)", QR: "#191428" };

function svgLogo(sz) { return '<span class="lg"><svg viewBox="0 0 64 64" width="' + sz + '" height="' + sz + '" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><path d="M24 42 40 26M27 27h9v9"/></svg></span>'; }

function renderAuth(mode) {
  const m = mode === "signup" ? "signup" : "login";
  rootEl().innerHTML = `
  <div class="auth"><div class="abox">
    <div class="alogo">${svgLogo(20)}Pautin</div>
    <div class="ahead">
      <h1>${m === "signup" ? "Buat halaman gratis ✨" : "Selamat datang kembali 👋"}</h1>
      <p>${m === "signup" ? "Pilih username, tambah link, langsung bagikan." : "Masuk untuk mengelola semua tautanmu."}</p>
    </div>
    <div id="demoC" class="demoalert"><div class="banner" style="margin:0">💡 <span>Akun contoh: <b>rizky</b> / <b>demo123</b> — klik untuk mengisi otomatis.</span><button class="x" type="button" onclick="fillDemo()">⚡</button></div></div>
    <div class="aerr" id="aerr"></div>
    ${m === "signup" ? signupFields() : loginFields()}
    <button class="abtn act" id="aGo" style="margin-top:18px">${m === "signup" ? "Daftar & Buat Halaman →" : "Masuk →"}</button>
    <div id="tstWrap" style="margin-top:14px;display:flex;justify-content:center;min-height:0"></div>
    <p class="asub">${m === "signup" ? "Sudah punya akun?" : "Belum punya akun?"} <a href="#" id="aSwap">${m === "signup" ? "Masuk" : "Daftar gratis"}</a></p>
  </div></div>`;
  $("#demoC").hidden = m !== "login";
  bindAuth(m);
  mountTurnstile();
}
function loginFields() {
  return `<div class="af">
    <div class="fld"><label>Username</label><input id="aU" autocomplete="username" placeholder="username-mu"></div>
    <div class="fld"><label>Kata sandi</label><div class="pwrow"><input id="aP" type="password" autocomplete="current-password" placeholder="••••••••"><button class="eye" type="button" onclick="togPw(this)" aria-label="lihat">${ICONS.eye}</button></div></div>
  </div>`;
}
function signupFields() {
  return `<div class="af">
    <div class="fld"><label>Username <span style="color:var(--mute);text-transform:none">3–20 huruf/angka, huruf kecil</span></label>
      <input id="aU" autocomplete="off" maxlength="20" placeholder="mis. rizky" oninput="checkU(this)">
      <div class="hint" id="uHint" style="font-weight:700">&nbsp;</div>
    </div>
    <div class="fld"><label>Nama tampilan (opsional)</label><input id="aN" maxlength="60" placeholder="mis. Rizky Pratama"></div>
    <div class="fld"><label>Kata sandi <span style="color:var(--mute);text-transform:none">min. 6 karakter</span></label>
      <div class="pwrow"><input id="aP" type="password" autocomplete="new-password" placeholder="••••••••"><button class="eye" type="button" onclick="togPw(this)" aria-label="lihat">${ICONS.eye}</button></div>
    </div>
  </div>`;
}
function togPw(btn) { const i = btn.parentElement.querySelector("input"); const sh = i.type === "password"; i.type = sh ? "text" : "password"; btn.innerHTML = sh ? ICONS.off : ICONS.eye; }
window.togPw = togPw;
let uTimer = null;
function checkU(input) {
  clearTimeout(uTimer);
  const v = input.value.trim().toLowerCase();
  const h = $("#uHint"); const go = $("#aGo");
  if (!v) { h.innerHTML = "&nbsp;"; go.disabled = false; return; }
  if (!/^[a-z0-9]{3,20}$/.test(v)) { h.innerHTML = '<span style="color:var(--bad)">✕ pakai 3–20 huruf kecil / angka, tanpa spasi</span>'; go.disabled = true; return; }
  h.innerHTML = '<span style="color:var(--mute)">Memeriksa…</span>';
  uTimer = setTimeout(() => {
    api("check?u=" + encodeURIComponent(v)).then((d) => {
      const url = location.origin + "/u/" + v;
      if (d.ok) { h.innerHTML = '<span style="color:var(--ok)">✓ Tersedia → <span style="font-family:var(--mono)">' + url.replace("https://", "") + "</span></span>"; go.disabled = false; }
      else h.innerHTML = '<span style="color:var(--bad)">✕ "' + esc(v) + '" sudah dipakai</span>';
    }).catch(() => { h.innerHTML = ""; go.disabled = false; });
  }, 320);
}
window.checkU = checkU;
window.fillDemo = () => { $("#aU").value = "rizky"; $("#aP").value = "demo123"; };
function bindAuth(mode) {
  const doGo = () => {
    const go = $("#aGo");
    if (go.disabled) return;
    go.disabled = true;
    const u = $("#aU").value.trim().toLowerCase(), p = $("#aP").value;
    const err = $("#aerr");
    const fail = (m) => { go.disabled = false; err.textContent = m; err.classList.add("show"); };
    const refreshTs = () => { if (window.__tsWidget !== undefined && window.turnstile) { try { window.turnstile.reset(window.__tsWidget); } catch (e) {} } window.__tsToken = null; };
    if (window.__cfg && window.__cfg.turnstileSiteKey && !window.__tsToken) {
      err.textContent = "Selesaikan verifikasi keamanan (centang kotak) dulu ya.";
      err.classList.add("show");
      go.disabled = false;
      return;
    }
    if (mode === "signup") {
      const n = $("#aN").value.trim();
      if (!/^[a-z0-9]{3,20}$/.test(u)) return fail("Username 3–20 huruf/angka kecil, tanpa spasi.");
      if (p.length < 6) return fail("Kata sandi minimal 6 karakter.");
      send("register", "POST", { username: u, name: n, password: p, turnstileToken: window.__tsToken || "" })
        .then(async (d) => { window.__ptok = d.token; try { await window.__pautinEnter(true); } catch (e2) { location.href = "/app"; } })
        .catch((e) => { fail(e.message); refreshTs(); });
    } else {
      send("login", "POST", { username: u, password: p, turnstileToken: window.__tsToken || "" })
        .then(async (d) => { window.__ptok = d.token; try { await window.__pautinEnter(false); } catch (e2) { location.reload(); } })
        .catch((e) => { fail(e.message); refreshTs(); });
    }
  };
  $("#aGo").onclick = doGo;
  ["aU", "aP"].forEach((id) => $(id).addEventListener("keydown", (ev) => { if (ev.key === "Enter") doGo(); }));
  $("#aSwap").onclick = (ev) => { ev.preventDefault(); renderAuth(mode === "signup" ? "login" : "signup"); };
}

/* ============================================================ dashboard */
function renderDashboard(isNew) {
  const u = S.u;
  rootEl().innerHTML = `
  <div class="tb"><div class="tbi">
    <a class="br" href="/"><span class="lg">${ICONS.logo}</span><span class="hide-sm">Pautin</span></a>
    <div class="grow"></div>
    ${u.avatar ? "" : ""}
    <div class="menu" id="menu">
      <button class="mbtn" id="mBtn"><span class="ava" id="mava">${esc(initials(u.name))}</span><span class="hide-sm">${esc(u.name)}</span><svg class="a" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></button>
      <div class="mdrop">
        <a class="mi" href="/u/${esc(u.username)}" target="_blank"><span class="av">${esc(initials(u.name))}</span><span><b>@${esc(u.username)}</b><span class="s">Halaman publikmu</span></span></a>
        <div class="msep"></div>
        <a class="mi" href="#" onclick="copyLink();return false"><span class="ic">${ICONS.logo}</span><span>Salin link halaman</span></a>
        <button class="mi" style="width:100%;background:none;border:none;text-align:left" onclick="openShare()"><span class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg></span><span>Bagikan halaman</span></button>
        <button class="mi" style="width:100%;background:none;border:none;text-align:left" onclick="logout()"><span class="ic" style="color:var(--bad);background:#fef2f2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg></span><span>Keluar</span></button>
      </div>
    </div>
    <a class="act hide-sm" href="/u/${esc(u.username)}" target="_blank" rel="noopener">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      Lihat Halaman
    </a>
  </div></div>

  <div class="lay">
    <aside class="side">
      <div class="card" id="pv">
        <div class="cardh"><div class="t"><span class="dot"></span>Pratinjau & Tema</div></div>
        <div class="pvban">
          <div class="t" style="display:none"></div>
          <a id="pvLink" href="/u/${esc(u.username)}" target="_blank" style="text-decoration:none;color:inherit;flex:1">
            <div class="pvb" id="pvb"><div class="av2" id="pvAva">${esc(initials(u.name))}</div><div class="nm" id="pvName">${esc(u.name)}</div><div class="bi" id="pvBio">${esc(u.bio || "Halaman ini masih kosong — tambahkan bio singkat!")}</div><div class="ln"><i></i><i></i><i></i></div></div>
          </a>
          <button class="ob" style="border-radius:10px" title="Buka halaman" onclick="window.open('/u/${esc(u.username)}','_blank')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg></button>
        </div>
        <div class="themes" id="thRow"></div>
        <div style="padding:0 18px 6px"><div class="t" style="font-size:10.5px;margin-bottom:7px">Bentuk tombol</div></div>
        <div class="themes" style="padding-top:0" id="radRow"></div>
      </div>
      <div class="card"><div class="cardh"><div class="t"><span class="dot"></span>Statistik</div></div>
        <div class="stat-grid">
          <div class="stat"><div class="v" id="stViews">0</div><div class="k">Kunjungan</div></div>
          <div class="stat"><div class="v" id="stClicks">0</div><div class="k">Klik link</div></div>
          <div class="stat"><div class="v" id="stLinks">0</div><div class="k">Tautan</div></div>
          <div class="stat"><div class="v" id="stJoin">—</div><div class="k">Sejak</div></div>
        </div>
      </div>
      <div class="card" style="overflow:hidden">
        <div style="padding:14px 18px;border-bottom:1px solid var(--line)">
          <div class="t" style="font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--mute);display:flex;gap:8px;align-items:center"><span class="dot"></span>Halaman publikmu</div>
        </div>
        <div style="padding:14px 16px;font-size:13px;color:var(--mute);line-height:1.6;display:flex;flex-direction:column;gap:10px;align-items:stretch">
          <div style="display:flex;align-items:center;gap:8px;background:#faf9fd;border:1px solid var(--line);border-radius:10px;padding:9px 12px"><span style="flex:1;font-family:var(--mono);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink)" id="miniUrl">${esc(loc())}</span></div>
          <button class="tbtn" style="justify-content:center" onclick="copyLink()">📋 Salin Link</button>
          <button class="tbtn" style="justify-content:center" onclick="openShare()">📣 Bagikan</button>
        </div>
      </div>
    </aside>

    <main class="main">
      ${isNew ? '<div class="banner" id="wb">🎉 <span><b>Halamanmu jadi!</b> Ini link pribadimu yang bisa kamu share ke mana saja. Yuk tambahkan link pertamamu di bawah 👇</span><button class="x" onclick="this.parentElement.remove()">✕</button></div>' : ""}
      ${!S.showBanner ? "" : '<div class="banner" id="linkTip">💡 <span><b>Tips:</b> link media sosial (IG, YouTube, TikTok, dll.) otomatis tampil sebagai ikon bulat di halamanmu, dan tetap bisa dilihat semua orang tanpa login.</span><button class="x" onclick="dismissTip()">✕</button></div>'}
      <div class="hrow">
        <h2>🔗 Tautanmu</h2><span class="sub2" id="listSub"></span>
        <div class="grow2"></div>
        <button class="act" id="addBtn">＋ Tambah Link</button>
      </div>

      <div class="card" id="addCard" hidden>
        <div class="frm">
          <div class="fld full"><label>Judul</label><input id="lT" maxlength="90" placeholder="mis. Channel YouTube-ku"></div>
          <div class="fld full"><label>URL</label><input id="lU" maxlength="500" placeholder="mis. https://youtube.com/@namamu">
            <div class="hint">Emoji + tipe (youtube, instagram, wa.me, tokopedia, dll.) dideteksi otomatis.</div>
          </div>
          <div class="fld"><label>Emoji (opsional)</label><input id="lE" maxlength="8" placeholder="mis. 🎬"></div>
          <div class="er" id="lErr"></div>
          <div style="display:flex;gap:10px;grid-column:1/-1">
            <button class="act" id="lSave" style="flex:1">💾 Simpan Link</button>
            <button class="tbtn" id="lCancel">Batal</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div id="listHead"><div class="t">📋 Daftar Link <span class="cnt" id="lCnt">0</span></div>
          <div class="grow"></div>
          <span class="hint hide-sm" style="font-weight:600">⠿ seret untuk mengurutkan · ↗ klik = buka</span>
        </div>
        <div id="linkList"></div>
      </div>
    </main>
  </div>

  <div class="mv" id="mv"></div>
  <a id="fb" href="/">${svgLogo(15)}Pautin</a>`;
  $("#mBtn").onclick = () => $("#menu").classList.toggle("open");
  document.addEventListener("click", (ev) => { const m = $("#menu"); if (m && !m.contains(ev.target)) m.classList.remove("open"); });
  if (u.avatar) {
    const im = new Image(); im.src = u.avatar; im.onload = () => { $("#mava").innerHTML = ""; $("#mava").appendChild(im); };
  }
  renderThemes();
  $("#addBtn").onclick = toggleAdd;
  $("#lCancel").onclick = closeAdd;
  $("#lSave").onclick = saveLink;
  renderLinks();
  updateStats();
  paintPreview();
}

function updateStats() {
  $("#stViews").textContent = fmtNum(S.u.views);
  $("#stClicks").textContent = fmtNum(S.totalClicks || 0);
  $("#stLinks").textContent = S.links.length;
  $("#stJoin").textContent = fmtDate(S.u.created_at);
}
window.logout = async () => {
  window.__ptok = null;
  try { await send("logout", "POST"); } catch (e) {}
  await ensureCfg();
  renderAuth("login");
};
window.dismissTip = () => { S.showBanner = false; $("#linkTip").remove(); };
function copyLink() {
  const url = loc();
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
    .then(() => toast("✅ Link disalin ke clipboard!"))
    .catch(() => { toast("📋 Salin manual: " + url); });
}
window.copyLink = copyLink;

/* ============================================================ themes & preview */
function renderThemes() {
  const wrap = $("#thRow"), pvb = $("#pvb");
  Object.keys(S.themes).forEach((k) => {
    const t = S.themes[k];
    const b = document.createElement("button");
    b.className = "th" + (k === S.u.theme ? " on" : "");
    b.title = t.label; b.dataset.k = k;
    b.style.background = t.base;
    b.innerHTML = "<i style=\"background:" + t.deco.replace(/"/g, "&quot;") + "\"></i>";
    b.onclick = () => setTheme(k, b);
    wrap.appendChild(b);
  });
  const rw = $("#radRow");
  Object.keys(S.radii).forEach((k) => {
    const b = document.createElement("button");
    b.className = "sh" + (k === S.u.radius ? " on" : "");
    b.textContent = { full: "●", soft: "◖◗", sharp: "▢" }[k] || k;
    b.dataset.k = k; b.title = S.radii[k];
    b.onclick = () => setRadius(k, b);
    rw.appendChild(b);
  });
  pvb.style.setProperty("--pbtn", "");
  paintPreview();
}
function setTheme(k, btn) {
  $$("#thRow .th").forEach((x) => x.classList.remove("on"));
  btn.classList.add("on");
  S.u.theme = k;
  send("settings", "PUT", { theme: k }).then(() => { toast("🎨 Tema: " + S.themes[k].label); paintPreview(); }).catch((e) => toast("⚠ " + e.message, 1));
}
function setRadius(k, btn) {
  $$("#radRow .sh").forEach((x) => x.classList.remove("on"));
  btn.classList.add("on");
  S.u.radius = k;
  send("settings", "PUT", { radius: k }).then(() => { toast("Bentuk tombol: " + S.radii[k]); paintPreview(); }).catch((e) => toast("⚠ " + e.message, 1));
}
function paintPreview() {
  const pvb = $("#pvb"); if (!pvb) return;
  const t = S.themes[S.u.theme] || S.themes.galaxy;
  const style = pvb.style;
  style.background = t.base;
  style.backgroundImage = t.deco;
  const isDark = !["mentari", "mawar", "kertas"].includes(S.u.theme);
  const fg = isDark ? "#f6f4ff" : "#3a2338";
  const btnC = isDark ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.85)";
  style.color = fg;
  pvb.style.setProperty("--pbtn", btnC);
  $$("#pvName,#pvBio", pvb).forEach((el) => { el.style.color = fg; });
  $("#pvBio").style.opacity = isDark ? ".72" : ".66";
}

/* ============================================================ links CRUD */
function toggleAdd() {
  S.showAdd = !S.showAdd;
  const c = $("#addCard"); c.hidden = !S.showAdd;
  $("#addBtn").textContent = S.showAdd ? "✕ Tutup" : "＋ Tambah Link";
  if (S.showAdd) { $("#lT").focus(); }
}
function closeAdd() { if (S.showAdd) toggleAdd(); resetForm(); }
function resetForm() { $("#lT").value = ""; $("#lU").value = ""; $("#lE").value = ""; $("#lErr").classList.remove("show"); }
function saveLink() {
  const title = $("#lT").value.trim(), url = $("#lU").value.trim(), emoji = $("#lE").value.trim();
  if (!url) return showErr("URL wajib diisi.");
  if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) return showErr("URL harus diawali https:// (atau mailto: untuk email).");
  send("links", "POST", { title, url, emoji })
    .then(async (d) => {
      const me = await get("me"); S.links = me.links; S.totalClicks = me.total_clicks;
      closeAdd(); renderLinks(); updateStats(); paintPreview(); toast("✅ Link berhasil ditambahkan!");
    })
    .catch((e) => showErr(e.message));
}
function showErr(m) { const e = $("#lErr"); e.textContent = m; e.classList.add("show"); }
function renderLinks() {
  const wrap = $("#linkList"); const listSub = $("#listSub");
  $("#lCnt").textContent = S.links.length;
  if (S.links.length === 0) {
    listSub.textContent = "belum ada tautan — tambahkan yang pertama!";
    wrap.innerHTML = '<div class="empty"><span class="e">🪄</span>Belum ada link di halamanmu.<br>Tambahkan link pertamamu dan halamanmu langsung aktif!<br><button class="emptya" onclick="document.getElementById(\'addBtn\').click()">＋ Tambah Link Pertama</button></div>';
    return;
  }
  listSub.textContent = "total " + S.links.length + " tautan";
  wrap.innerHTML = "";
  S.links.forEach((l) => wrap.appendChild(rowEl(l)));
  wireDnD(wrap);
}
function rowEl(l) {
  const d = document.createElement("div");
  d.className = "ll"; d.draggable = true; d.dataset.id = l.id;
  const em = l.emoji ? '<span class="e">' + esc(l.emoji) + "</span>" : '<span class="e"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9d94ba" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>';
  d.innerHTML = `
    <span class="h" title="Seret untuk urutkan"><svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2"/><circle cx="17" cy="5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="12" r="2"/><circle cx="9" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg><svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="7" cy="19" r="2"/><circle cx="15" cy="19" r="2"/></svg></span>
    ${em}
    <div class="inf"><div class="ti">${esc(l.title)}<span class="kind">${esc(l.kind)}</span></div><div class="ur">${esc(l.url)}</div></div>
    <span class="cl">👆 ${fmtNum(l.clicks)}</span>
    <span class="ops">
      <button class="ob" title="Buka" onclick="window.open('${esc(l.url)}','_blank')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg></button>
      <button class="ob" title="Salin URL" onclick="copyUrl('${esc(l.url)}')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
      <button class="ob" title="Edit" onclick="editRow(${l.id})"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg></button>
      <button class="ob del" title="Hapus" onclick="delRow(${l.id})"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
    </span>`;
  return d;
}
window.copyUrl = (u) => {
  (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject())
    .then(() => toast("✅ URL disalin!"))
    .catch(() => toast("📋 " + u));
};
function editRow(id) {
  const l = S.links.find((x) => x.id === id); if (!l) return;
  openEdit(l);
}
window.editRow = editRow;
function delRow(id) {
  const l = S.links.find((x) => x.id === id);
  const ok = confirm('Hapus link "' + (l ? l.title : "") + '"?');
  if (!ok) return;
  send("links/" + id, "DELETE").then(async () => {
    const me = await get("me"); S.links = me.links;
    renderLinks(); updateStats(); toast("🗑 Link dihapus.");
  }).catch((e) => toast("⚠ " + e.message, 1));
}
window.delRow = delRow;

/* ---------- edit (pakai ulang form tambah) ---------- */
function openEdit(l) {
  if (!S.showAdd) toggleAdd();
  $("#addBtn").textContent = "✕ Tutup";
  $("#lT").value = l.title; $("#lU").value = l.url; $("#lE").value = l.emoji;
  $("#lErr").classList.remove("show");
  $("#lSave").textContent = "💾 Simpan Perubahan";
  S.editing = l.id;
  $("#lSave").onclick = () => saveEdit();
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("#lT").focus();
}
function saveEdit() {
  const title = $("#lT").value.trim(), url = $("#lU").value.trim(), emoji = $("#lE").value.trim();
  if (!url) return showErr("URL wajib diisi.");
  if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) return showErr("URL harus diawali https:// (atau mailto: untuk email).");
  send("links/" + S.editing, "PUT", { title, url, emoji }).then(async () => {
    const me = await get("me"); S.links = me.links;
    closeAdd(); resetForm(); $("#lSave").textContent = "💾 Simpan Link"; S.editing = null;
    renderLinks(); updateStats(); paintPreview(); toast("✅ Perubahan disimpan.");
  }).catch((e) => showErr(e.message));
}

/* ============================================================ drag & drop */
function wireDnD(wrap) {
  $$(".ll", wrap).forEach((row) => {
    row.addEventListener("dragstart", (ev) => {
      S.dragging = row; row.classList.add("drag");
      ev.dataTransfer.effectAllowed = "move";
      try { ev.dataTransfer.setData("text/plain", row.dataset.id); } catch (e) {}
    });
    row.addEventListener("dragend", async () => {
      row.classList.remove("drag");
      $$(".ll.over", wrap).forEach((r) => r.classList.remove("over"));
      if (!S.dragging) return;
      const from = S.dragging; S.dragging = null;
      const to = wrap.querySelector(".over"); if (!to || to === from) return;
      const arr = Array.from(wrap.querySelectorAll(".ll"));
      const a = arr.indexOf(from), b = arr.indexOf(to);
      if (a < 0 || b < 0) return;
      arr.splice(a, 1); arr.splice(b, 0, from);
      arr.forEach((r) => wrap.appendChild(r));
      await send("reorder", "POST", { ids: arr.map((r) => +r.dataset.id) }).then(async () => {
        const me = await get("me"); S.links = me.links;
        toast("↕️ Urutan disimpan.");
      }).catch((e) => toast("⚠ " + e.message, 1));
    });
    row.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      if (S.dragging && S.dragging !== row) row.classList.add("over");
    });
    row.addEventListener("dragleave", () => row.classList.remove("over"));
    row.addEventListener("drop", (ev) => ev.preventDefault());
  });
}

/* ============================================================ share modal */
function openShare() {
  const url = loc(); const t = encodeURIComponent(document.title || "Cek halaman-ku di Pautin!");
  const enc = encodeURIComponent(url);
  $("#menu") && $("#menu").classList.remove("open");
  const mv = $("#mv");
  mv.className = "mv show";
  mv.innerHTML = `<div class="box">
    <h3>📣 Bagikan halamanmu</h3>
    <div class="sub">Sebarkan <b>@${esc(S.u.username)}</b> — satu link untuk semua tautanmu.</div>
    <div class="shareurl"><input id="su" readonly value="${esc(url)}"><button onclick="copyField()">Salin</button></div>
    <div class="sharegrid">
      <a class="shs" href="https://wa.me/?text=${t}%20${enc}" target="_blank" rel="noopener"><span class="c" style="background:${SHARE_COLORS.WA}">${svgWa()}</span>WhatsApp</a>
      <a class="shs" href="https://www.facebook.com/sharer/sharer.php?u=${enc}" target="_blank" rel="noopener"><span class="c" style="background:${SHARE_COLORS.FB}">${svgFb()}</span>Facebook</a>
      <a class="shs" href="https://twitter.com/intent/tweet?text=${t}&url=${enc}" target="_blank" rel="noopener"><span class="c" style="background:${SHARE_COLORS.X}">${svgX()}</span>X / Twitter</a>
      <a class="shs" href="https://t.me/share/url?url=${enc}&text=${t}" target="_blank" rel="noopener"><span class="c" style="background:${SHARE_COLORS.TG}">${svgTg()}</span>Telegram</a>
      <button class="shs" style="border:none" onclick="shareNative()"><span class="c" style="background:${SHARE_COLORS.LK}">${svgLi()}</span>Lainnya</button>
    </div>
    <div class="sub" style="margin-top:20px;margin-bottom:10px;font-weight:800;color:var(--ink)">QR Code — scan langsung dari HP 📱</div>
    <div id="qr"></div>
    <button class="tbtn" style="width:100%;justify-content:center;margin-top:12px" onclick="downQr()">⬇ Unduh QR (PNG)</button>
  </div>`;
  makeQr($("#qr"), url, 190);
  mv.onclick = (ev) => { if (ev.target === mv) closeShare(); };
}
window.openShare = openShare;
function closeShare() { const mv = $("#mv"); mv.className = "mv"; mv.innerHTML = ""; }
window.closeShare = closeShare;
function copyField() {
  const i = $("#su");
  i.select();
  (navigator.clipboard ? navigator.clipboard.writeText(i.value) : Promise.reject())
    .then(() => toast("✅ Link disalin!"))
    .catch(() => toast("📋 Salin manual dari kolom di atas."));
}
window.copyField = copyField;
async function shareNative() {
  try {
    if (navigator.share) { await navigator.share({ title: document.title, url: loc() }); return; }
    throw 0;
  } catch (e) { toast("Di perangkat ini, gunakan tombol Salin."); }
}
window.shareNative = shareNative;

/* ---------- QR ---------- */
function makeQr(el, text, size) {
  el.innerHTML = '<div style="display:flex;justify-content:center;padding:8px;color:var(--mute);font-size:13px">Menyiapkan QR…</div>';
  let img = new Image();
  img.onload = () => { el.innerHTML = ""; el.appendChild(img); };
  img.onerror = () => { el.innerHTML = '<div style="text-align:center;padding:14px;color:var(--mute);font-size:13px">QR tidak bisa dimuat tanpa internet.<br>Gunakan tombol Salin ya 🙂</div>'; };
  img.src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&qzone=1&data=" + encodeURIComponent(text);
  img.alt = "QR code"; img.width = 190; img.height = 190;
  el.__img = img;
}
function downQr() {
  const img = $("#qr img");
  if (!img || !img.src || img.src.startsWith("data:")) { toast("QR belum siap / tidak ada koneksi.", 1); return; }
  const c = document.createElement("canvas"); c.width = 400; c.height = 400;
  const x = c.getContext("2d");
  x.fillStyle = "#fff"; x.fillRect(0, 0, 400, 400);
  const pad = 24;
  x.drawImage(img, pad, pad, 400 - pad * 2, 400 - pad * 2);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png"); a.download = "qr-" + S.u.username + ".png";
  a.click();
  toast("⬇ QR diunduh (folder Unduhan).");
}
window.downQr = downQr;

/* ---------- icon svg sosial untuk modal ---------- */
function svgWa() { return '<svg width="19" height="19" viewBox="0 0 24 24" fill="#fff"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.08-.13-.28-.2-.58-.35zM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.9 9.88zm8.42-18.3A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.41z"/></svg>'; }
function svgFb() { return '<svg width="19" height="19" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>'; }
function svgX() { return '<svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z"/></svg>'; }
function svgTg() { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M11.94 0A12 12 0 1 0 24 12 12 12 0 0 0 11.94 0zm5.87 8.16-1.97 9.3c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.6.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12l-6.87 4.33-2.96-.93c-.64-.2-.66-.64.14-.95l11.57-4.46c.53-.2 1 .12.83.91z"/></svg>'; }
function svgLi() { return '<svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>'; }
