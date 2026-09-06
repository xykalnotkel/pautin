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
const svgWrap = (p) => `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">${p}</svg>`;

function linkIcon(l) {
  if (l.emoji) {
    const g = window.PTIcons && PTIcons.gen[l.emoji];
    if (g) return g;
    if (l.emoji.startsWith("b:")) { const p = window.PTIcons && PTIcons.brand[l.emoji.slice(2)]; if (p) return svgWrap(p); }
  }
  const b = window.PTIcons && PTIcons.brand[l.kind];
  if (b) return svgWrap(b);
  return gn("globe");
}
function brandChip(k) { const p = window.PTIcons && PTIcons.brand[k]; return p ? svgWrap(p) : ""; }

/* ================= net ================= */
function api(path, opt) {
  opt = opt || {};
  opt.headers = Object.assign({}, opt.headers || {});
  if (window.__ptok) opt.headers["X-Auth-Token"] = window.__ptok;
  if (opt.body && typeof opt.body === "string") opt.headers["Content-Type"] = "application/json";
  return fetch("/api/" + path, opt).then(async (r) => {
    let d = {}; try { d = await r.json(); } catch {}
    if (!r.ok) { const e = new Error(d.error || "Terjadi kesalahan"); e.status = r.status; throw e; }
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

/* ================= konfig + turnstile ================= */
let __cfgP = null;
function ensureCfg() {
  if (window.__cfg) return Promise.resolve(window.__cfg);
  if (__cfgP) return __cfgP;
  __cfgP = get("config").then((c) => (window.__cfg = c)).catch(() => (window.__cfg = { turnstileSiteKey: null }));
  return __cfgP;
}
function mountTurnstile() {
  const key = window.__cfg && window.__cfg.turnstileSiteKey;
  const wrap = $("#tstWrap");
  if (!key || !wrap) return;
  wrap.innerHTML = "";
  const render = () => {
    if (!window.turnstile || !$("#tstWrap")) return;
    try { window.turnstile.render($("#tstWrap"), { sitekey: key, callback: (t) => { window.__tsToken = t; }, "expired-callback": () => { window.__tsToken = null; }, "error-callback": () => { window.__tsToken = null; } }); } catch {}
  };
  if (window.turnstile) render();
  else {
    window.__tsOnload = render;
    if (!document.getElementById("ts-script")) {
      const s = document.createElement("script");
      s.id = "ts-script";
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsOnload";
      s.async = true; s.defer = true;
      document.body.appendChild(s);
    }
  }
}
function tsToken() { return window.__tsToken || ""; }

/* ================= boot ================= */
window.__pautinBoot = async function () {
  if (window.__pautinBooted) return;
  window.__pautinBooted = true;
  const qs = new URLSearchParams(location.search);
  try {
    const d = await get("me");
    S.u = d.user; S.links = d.links; S.totalClicks = d.total_clicks;
    renderDashboard(qs.get("signup") === "1");
    document.title = "Dashboard — " + S.u.username + " | Pautin";
  } catch (e) {
    await ensureCfg();
    renderAuth(qs.get("signup") === "1" ? "signup" : "login");
  }
  history.replaceState(null, "", "/app");
};
window.__pautinEnter = async function (welcome) {
  const d = await get("me");
  S.u = d.user; S.links = d.links; S.totalClicks = d.total_clicks;
  renderDashboard(!!welcome);
  document.title = "Dashboard — " + S.u.username + " | Pautin";
};

/* ================= AUTH ================= */
function renderAuth(mode) {
  const m = mode === "signup" ? "signup" : "login";
  const swapMode = () => renderAuth(m === "signup" ? "login" : "signup");
  rootEl().innerHTML = `
  <div class="auth"><div class="abox">
    <div class="alogo">${ic("logo")}<span>Pautin</span></div>
    <div class="ahead">
      <h1>${m === "signup" ? "Buat halaman gratis" : "Selamat datang kembali"}</h1>
      <p>${m === "signup" ? "Pilih username, tambah tautan, langsung bagikan." : "Masuk untuk mengelola semua tautanmu."}</p>
    </div>
    <div class="aerr" id="aerr"></div>
    ${m === "login" ? '<div class="demoalert" id="demoC"><span>Punya akun demo? <b>rizky / demo123</b></span><button data-act="filldemo">Isi otomatis</button></div>' : ""}
    <div class="af">
      <div class="fld"><label>Username</label>
        <input id="aU" autocomplete="username" maxlength="20" placeholder="mis. rizky" value="">
        ${m === "signup" ? '<div class="hint" id="uHint" style="font-weight:800">&nbsp;</div>' : ""}
      </div>
      ${m === "signup" ? '<div class="fld"><label>Nama tampilan <span class="opt">opsional</span></label><input id="aN" maxlength="60" placeholder="mis. Rizky Pratama"></div>' : ""}
      <div class="fld"><label>Kata sandi ${m === "signup" ? '<span class="opt">min. 6 karakter</span>' : ""}</label>
        <div class="pwrow"><input id="aP" type="password" autocomplete="${m === "signup" ? "new-password" : "current-password"}" placeholder="••••••••"><button class="eye" data-act="eyetoggle" aria-label="Lihat kata sandi">${ic("eye")}</button></div>
      </div>
    </div>
    <button class="act abtn" id="aGo" data-act="submit">${m === "signup" ? "Daftar dan buat halaman" : "Masuk"} ${ic("arrowR")}</button>
    <div id="tstWrap" style="margin-top:14px;display:flex;justify-content:center"></div>
    <p class="asub">${m === "signup" ? "Sudah punya akun? " : "Belum punya akun? "}<a href="#" data-act="swap">${m === "signup" ? "Masuk" : "Daftar gratis"}</a></p>
  </div></div>`;
  if (m === "login") $("#demoC").hidden = false;
  bindAuthActions(m);
  mountTurnstile();
}

const authErr = (m) => { const e = $("#aerr"); if (!e) return; e.textContent = m; e.classList.add("show"); };

function bindAuthActions(mode) {
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
  }
  const submit = () => {
    const go = $("#aGo");
    if (go.disabled) return;
    const err = $("#aerr"); err.classList.remove("show");
    if (window.__cfg && window.__cfg.turnstileSiteKey && !window.__tsToken) {
      err.textContent = "Selesaikan verifikasi keamanan di bawah dulu ya."; err.classList.add("show"); return;
    }
    const u = aU.value.trim().toLowerCase(), p = aP.value;
    go.disabled = true;
    const done = (m) => { go.disabled = false; err.textContent = m; err.classList.add("show"); };
    if (mode === "signup") {
      const n = ($("#aN") ? $("#aN").value : "").trim();
      if (!/^[a-z0-9]{3,20}$/.test(u)) return done("Username 3-20 huruf/angka kecil, tanpa spasi.");
      if (p.length < 6) return done("Kata sandi minimal 6 karakter.");
      send("register", "POST", { username: u, name: n, password: p, turnstileToken: tsToken() })
        .then(async (d) => { window.__ptok = d.token; try { await window.__pautinEnter(true); } catch { location.href = "/app"; } })
        .catch((e) => done(e.message));
    } else {
      send("login", "POST", { username: u, password: p, turnstileToken: tsToken() })
        .then(async (d) => { window.__ptok = d.token; try { await window.__pautinEnter(false); } catch { location.reload(); } })
        .catch((e) => done(e.message));
    }
  };
  rootEl().addEventListener("click", (ev) => {
    const t = ev.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;
    if (act === "swap") { ev.preventDefault(); renderAuth(mode === "signup" ? "login" : "signup"); }
    else if (act === "eyetoggle") { const i = t.parentElement.querySelector("input"); i.type = i.type === "password" ? "text" : "password"; t.innerHTML = i.type === "password" ? ic("eye") : ic("eyeOff"); }
    else if (act === "filldemo") { aU.value = "rizky"; aP.value = "demo123"; }
    else if (act === "submit") submit();
  });
  aP.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  aU.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
}

/* ================= DASHBOARD ================= */
function renderDashboard(isNew) {
  const u = S.u;
  rootEl().innerHTML = `
  <div class="tb"><div class="tbi">
    <a class="br" href="/">${ic("logoSm")}<span class="hide-sm">Pautin</span></a>
    <div class="grow"></div>
    <div class="menu" id="menu">
      <button class="mbtn" data-act="menu"><span class="ava" id="mava">${esc(initials(u.name))}</span><span class="hide-sm">${esc(u.name)}</span>${ic("chevD").replace('<svg', '<svg class="ch"')}</button>
      <div class="mdrop">
        <a class="mi" href="/u/${esc(u.username)}" target="_blank" rel="noopener"><span class="ava">${esc(initials(u.name))}</span><span><b>@${esc(u.username)}</b><span class="s">Halaman publikmu</span></span></a>
        <div class="msep"></div>
        <button class="mi" data-act="copyurl"><span class="ic">${ic("copy")}</span><span>Salin link halaman</span></button>
        <button class="mi" data-act="share"><span class="ic">${ic("share")}</span><span>Bagikan halaman</span></button>
        <button class="mi" data-act="profile"><span class="ic">${ic("user")}</span><span>Edit profil dan foto</span></button>
        <div class="msep"></div>
        <button class="mi" data-act="logout"><span class="ic" style="color:var(--bad);background:#FBEDEA">${ic("logout")}</span><span>Keluar</span></button>
      </div>
    </div>
    <a class="act hide-sm" href="/u/${esc(u.username)}" target="_blank" rel="noopener">${ic("eyeUp")} Lihat Halaman</a>
  </div></div>

  <div class="lay">
    <aside class="side">
      <div class="card">
        <div class="cardh"><div class="t">${ic("palette")} Pratinjau dan tema</div></div>
        <div class="pvtop"><a href="/u/${esc(u.username)}" target="_blank" rel="noopener">@${esc(u.username)}</a>
          <button class="ob oj" data-act="profile" title="Edit profil">${ic("pencil")}</button>
          <button class="ob" data-act="view" title="Buka halaman">${ic("external")}</button>
        </div>
        <div class="pvb" id="pvb">
          <div class="av2" id="pvAva">${u.avatar ? `<img src="${esc(cloudOpt(u.avatar, 140))}" alt="">` : esc(initials(u.name))}</div>
          <div class="nm" id="pvName">${esc(u.name)}</div>
          <div class="bi" id="pvBio">${esc(u.bio || "Tambahkan bio singkat dari menu Edit profil.")}</div>
          <div class="ln" id="pvRows"><i>${ic("linkUI")}</i><i>${ic("linkUI")}</i><i>${ic("linkUI")}</i></div>
        </div>
        <div class="themes" id="thRow"></div>
        <div class="sectag" style="padding:0 18px">Bentuk tombol</div>
        <div class="shape-row" id="radRow"></div>
      </div>

      <div class="card">
        <div class="cardh"><div class="t">${ic("chart")} Statistik</div></div>
        <div class="stat-grid">
          <div class="stat"><div class="v" id="stViews">0</div><div class="k">Kunjungan</div></div>
          <div class="stat"><div class="v" id="stClicks">0</div><div class="k">Klik tautan</div></div>
          <div class="stat"><div class="v" id="stLinks">0</div><div class="k">Tautan</div></div>
          <div class="stat"><div class="v" id="stJoin">-</div><div class="k">Sejak</div></div>
        </div>
      </div>

      <div class="card">
        <div class="cardh"><div class="t">${ic("linkUI")} Halaman publikmu</div></div>
        <div class="cardbody">
          <div class="urlchip"><span id="miniUrl">${esc(loc())}</span><button class="ob" data-act="copyurl" title="Salin">${ic("copy")}</button></div>
          <button class="act" data-act="share" style="width:100%">${ic("share")} Bagikan halaman</button>
        </div>
      </div>
    </aside>

    <main class="main">
      ${isNew ? `<div class="notebar" id="welcome">${ic("check")} <span><b>Halamanmu jadi.</b> Ini link pribadimu yang bisa kamu bagikan ke mana saja. Tambahkan tautan pertamamu di bawah.</span><button class="x" data-act="closenote" aria-label="Tutup">${ic("x")}</button></div>` : ""}
      <div class="hrow">
        <h2>${ic("linkUI")} Tautanmu</h2><span class="sub2" id="listSub"></span>
        <div class="grow2"></div>
        <button class="act" data-act="addtoggle">${ic("plus")} <span id="addLbl">Tambah Tautan</span></button>
      </div>

      <div class="card" id="addCard" hidden>
        <div style="padding:18px">
          <div class="frm">
            <div class="fld full"><label>Judul</label><input id="lT" maxlength="90" placeholder="mis. Channel YouTube-ku"></div>
            <div class="fld full"><label>Tautan (URL)</label><input id="lU" maxlength="500" placeholder="mis. https://youtube.com/@namamu">
              <div class="hint">Media sosial terdeteksi otomatis. Awalan https:// ditambahkan bila tidak ada.</div>
            </div>
            <div class="fld full"><label>Ikon <span class="opt">pilih salah satu</span></label>
              <div style="display:flex;gap:12px;align-items:center">
                <span class="pickprev" id="pickPrev">${gn("globe")}</span>
                <div class="icon-grid" id="iconGrid"></div>
              </div>
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
          <span class="lhint hide-sm">${ic("drag")} seret untuk mengurutkan</span>
        </div>
        <div id="linkList"></div>
      </div>
    </main>
  </div>

  <div class="mv" id="mv"></div>
  <a id="fb" href="/">${ic("logoSm")}Pautin</a>`;

  paintAvatar();
  renderThemes();
  renderIconPicker();
  updateStats();
  renderLinks();
  bindDashEvents();
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
  paintPreview();
}
function paintPreview() {
  const pvb = $("#pvb"); if (!pvb) return;
  const t = THEME_INFO[S.u.theme] || THEME_INFO.galaxy;
  pvb.style.background = t.b; pvb.style.backgroundImage = t.d;
  const fg = t.dark ? "#f4f1fb" : "#3a2338";
  const pbtn = t.dark ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.85)";
  pvb.style.setProperty("--pb", pbtn);
  pvb.style.color = fg;
  $$("#pvName,#pvBio", pvb).forEach((el) => { el.style.color = fg; });
}
async function setTheme(k) { S.u.theme = k; paintPreview(); $$("#thRow .th").forEach((x) => x.classList.toggle("on", x.dataset.theme === k)); send("settings", "PUT", { theme: k }).then(() => toast("Tema: " + THEME_INFO[k].t)).catch((e) => toast(e.message, 1)); }
async function setRadius(k) { S.u.radius = k; $$("#radRow .sh").forEach((x) => x.classList.toggle("on", x.dataset.radius === k)); send("settings", "PUT", { radius: k }).then(() => toast("Bentuk tombol: " + RADII_MAP[k])).catch((e) => toast(e.message, 1)); }

/* ================= ikon picker ================= */
function renderIconPicker() {
  const grid = $("#iconGrid"); if (!grid) return;
  const keys = Object.keys(window.PTIcons.gen);
  grid.innerHTML = `<button class="ig none on" data-ic="" title="Tanpa ikon">Tanpa</button>` + keys.map((k) => `<button class="ig" data-ic="${k}" title="${k}">${gn(k)}</button>`).join("");
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
  $("#lT").value = ""; $("#lU").value = ""; $("#lErr").classList.remove("show");
  $("#saveLbl").textContent = "Simpan Tautan"; S.editing = null; S.iconKey = "";
  syncPicker();
}
function openEdit(id) {
  const l = S.links.find((x) => x.id === id); if (!l) return;
  S.editing = id; S.iconKey = l.emoji || "";
  $("#lT").value = l.title; $("#lU").value = l.url;
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
  const body = { title, url, emoji: S.iconKey };
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
  $("#listSub").textContent = S.links.length ? `total ${S.links.length} tautan` : "";
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
        <div class="ur">${esc(l.url)}</div>
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

/* ================= aksi global dashboard ================= */
function bindDashEvents() {
  rootEl().addEventListener("click", async (ev) => {
    const t = ev.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;
    const closeMenu = () => { const m = $("#menu"); if (m) m.classList.remove("open"); };
    if (act === "menu") { $("#menu").classList.toggle("open"); }
    else if (act === "logout") {
      window.__ptok = null;
      try { await send("logout", "POST"); } catch {}
      await ensureCfg(); renderAuth("login");
    }
    else if (act === "view") window.open("/u/" + S.u.username, "_blank");
    else if (act === "copyurl") copyText(loc(), "Link halaman disalin.");
    else if (act === "copylink") copyText(t.dataset.url, "URL disalin.");
    else if (act === "share") { closeMenu(); openShare(); }
    else if (act === "profile") { closeMenu(); openProfile(); }
    else if (act === "addtoggle") { if (S.editing) { resetForm(); } toggleAdd(); if (!S.showAdd) resetForm(); }
    else if (act === "canceladd") { toggleAdd(false); resetForm(); }
    else if (act === "savelink") saveLink();
    else if (act === "openlink") { const l = S.links.find((x) => x.id === Number(t.dataset.id)); if (l) window.open(l.url, "_blank"); }
    else if (act === "editlink") openEdit(Number(t.dataset.id));
    else if (act === "dellink") delLink(Number(t.dataset.id));
    else if (act === "closenote") { const n = $("#welcome"); if (n) n.remove(); }
    else if (act === "icpick") pickIcon(t.dataset.ic);
    else if (act === "theme") setTheme(t.dataset.theme);
    else if (act === "radius") setRadius(t.dataset.radius);
    else if (act === "copyshare") { const i = $("#su"); if (i) { i.select(); copyText(i.value, "Link disalin."); } }
    else if (act === "nativeshare") shareNative();
    else if (act === "downqr") downQr();
    else if (act === "closeModal") closeModal();
    else if (act === "saveprofile") saveProfile();
    else if (act === "ava") $("#avaFile").click();
  });
  // klik area gelap menutup modal
  $("#mv") && ($("#mv").addEventListener("click", (ev) => { if (ev.target.id === "mv") closeModal(); }));
  // delegasi khusus untuk ikon di grid (di-render dinamis via data-act di atas belum mencakup)
  const grid = $("#iconGrid");
  if (grid) grid.addEventListener("click", (ev) => { const b = ev.target.closest("[data-ic]"); if (b) pickIcon(b.dataset.ic); });
  const th = $("#thRow"); if (th) th.addEventListener("click", (ev) => { const b = ev.target.closest("[data-theme]"); if (b) setTheme(b.dataset.theme); });
  const rr = $("#radRow"); if (rr) rr.addEventListener("click", (ev) => { const b = ev.target.closest("[data-radius]"); if (b) setRadius(b.dataset.radius); });
  const af = $("#avaFile");
  if (af) af.addEventListener("change", () => uploadAvatar(af));
}
function copyText(txt, msg) {
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
    .then(() => toast(msg))
    .catch(() => toast(txt));
}
async function shareNative() {
  try {
    if (navigator.share) { await navigator.share({ title: document.title, url: loc() }); return; }
    throw 0;
  } catch { toast("Gunakan tombol Salin di perangkat ini."); }
}

/* ================= modal profil ================= */
function openProfile() {
  const u = S.u;
  const mv = $("#mv");
  mv.className = "mv show";
  mv.innerHTML = `
  <div class="box wide">
    <button class="x2" data-act="closeModal" aria-label="Tutup">${ic("x")}</button>
    <h3>${ic("user")} Edit profil</h3>
    <div class="sub">Nama, bio, dan foto tampil di halaman publikmu: <b>/${esc(u.username)}</b></div>
    <div class="er" id="pErr"></div>
    <div class="avatbox">
      <div class="big" id="avaPrev">${u.avatar ? `<img src="${esc(cloudOpt(u.avatar, 160))}" alt="">` : ic("user")}</div>
      <div class="acts">
        <button class="tbtn upbtn" data-act="ava">${ic("upload")} Unggah foto
          <input id="avaFile" type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden>
        </button>
        ${u.avatar ? '<button class="tbtn" data-act="removeava">Hapus foto</button>' : ""}
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
        <div class="hint">Diunggah ke Cloudinary dan dioptimasi otomatis bila memakai tombol unggah.</div>
      </div>
      <div class="frow">
        <button class="act" data-act="saveprofile" style="flex:1">${ic("check")} Simpan profil</button>
        <button class="tbtn" data-act="closeModal">Batal</button>
      </div>
    </div>
  </div>`;
  // ulang bind aksi khusus setelah modal dibuka
  mv.querySelector('[data-act="ava"]') && mv.querySelector('[data-act="ava"]').addEventListener("click", () => $("#avaFile").click());
  const af = $("#avaFile");
  if (af) af.addEventListener("change", () => uploadAvatar(af));
  mv.querySelector('[data-act="removeava"]') && mv.querySelector('[data-act="removeava"]').addEventListener("click", () => {
    S.u.avatar = ""; $("#pfUrl").value = ""; paintAvatar();
  });
  // tombol umum modal (closeModal/saveprofile) sudah didelegasikan global
}
let avaUploading = false;
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
async function saveProfile() {
  const name = $("#pfName").value.trim();
  const bio = $("#pfBio").value.trim().slice(0, 200);
  const av = ($("#pfUrl").value || "").trim();
  const err = $("#pErr"); if (err) err.classList.remove("show");
  if (!name) { if (err) { err.textContent = "Nama tampilan wajib diisi."; err.classList.add("show"); } return; }
  try {
    await send("profile", "PUT", { name, bio, avatar: av });
    S.u.name = name; S.u.bio = bio; S.u.avatar = av;
    paintAvatar();
    closeModal();
    toast("Profil diperbarui.");
  } catch (e) { if (err) { err.textContent = e.message; err.classList.add("show"); } }
}

/* ================= modal bagikan ================= */
function openShare() {
  const u = S.u, url = loc();
  const enc = encodeURIComponent(url);
  const t = encodeURIComponent("Cek halaman " + u.name + " di Pautin");
  const shareUrl = (base) => base.replace("{{U}}", enc).replace("{{T}}", t);
  const mv = $("#mv");
  mv.className = "mv show";
  const cells = [
    ["wa", "WhatsApp", "#25D366", "https://wa.me/?text={{T}}%20{{U}}"],
    ["x", "X", "#000", "https://twitter.com/intent/tweet?text={{T}}&url={{U}}"],
    ["tg", "Telegram", "#229ED9", "https://t.me/share/url?url={{U}}&text={{T}}"],
    ["fb", "Facebook", "#1877F2", "https://www.facebook.com/sharer/sharer.php?u={{U}}"],
  ].map(([k, label, color, href]) => {
    const p = window.PTIcons.brand[k];
    return `<a class="shs" href="${href.replace("{{T}}", t).replace("{{U}}", enc)}" target="_blank" rel="noopener"><span class="c" style="background:${color}">${svgWrap(p)}</span>${label}</a>`;
  }).join("");
  cells += `<button class="shs" data-act="nativeshare"><span class="c" style="background:#0F5B4D">${ic("share")}</span>Lainnya</button>`;
  cells += `<button class="shs" data-act="copyshare"><span class="c" style="background:#E4572E">${ic("copy")}</span>Salin</button>`;
  mv.innerHTML = `
  <div class="box">
    <button class="x2" data-act="closeModal" aria-label="Tutup">${ic("x")}</button>
    <h3>${ic("share")} Bagikan halamanmu</h3>
    <div class="sub">Sebarkan <b>@${esc(u.username)}</b> — satu alamat untuk semua tautanmu.</div>
    <div class="shareurl"><input id="su" readonly value="${esc(url)}"><button data-act="copyshare">Salin</button></div>
    <div class="sharegrid">${cells}</div>
    <div class="qrow" style="margin-top:18px">
      <div class="qleft">
        <div class="sectag" style="margin-bottom:8px">QR code</div>
        <p class="mini">Bisa discan dari HP dan diunduh untuk kartu nama atau poster.</p>
        <button class="tbtn" data-act="downqr" style="margin-top:10px">${ic("download")} Unduh PNG</button>
      </div>
      <div id="qr"><div style="color:var(--mute);font-size:12px;padding:12px">Menyiapkan QR…</div></div>
    </div>
  </div>`;
  makeQr($("#qr"), url);
}
function closeModal() { const mv = $("#mv"); mv.className = "mv"; mv.innerHTML = ""; }
function makeQr(el, text) {
  const img = new Image();
  img.alt = "QR code";
  img.onload = () => { el.innerHTML = ""; el.appendChild(img); };
  img.onerror = () => { el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--mute);font-size:12.5px">QR tidak dapat dimuat tanpa koneksi.<br>Gunakan tombol Salin.</div>'; };
  img.src = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&qzone=1&data=" + encodeURIComponent(text);
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
