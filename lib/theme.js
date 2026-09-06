import { esc, fmtNum, initials } from "./db";
import { optimized } from "./cloudinary";
import { GENERIC } from "./icons";

export const THEMES = {
  galaxy:  { label: "Galaksi",  bg: "#0c0a1e", deco: "radial-gradient(1000px 620px at 85% -15%, rgba(139,92,246,.5), transparent 62%), radial-gradient(900px 620px at -12% 108%, rgba(236,72,153,.28), transparent 60%)",
    btn: "rgba(255,255,255,.075)", line: "rgba(255,255,255,.17)", fg: "#f6f4ff", mute: "rgba(246,244,255,.62)", chip: "rgba(167,139,250,.24)", acc: "#c4b5fd", glow: "rgba(139,92,246,.45)" },
  midnight: { label: "Tengah Malam", bg: "#05070f", deco: "radial-gradient(900px 520px at 88% -10%, rgba(56,189,248,.22), transparent 60%), radial-gradient(800px 600px at -10% 110%, rgba(99,102,241,.30), transparent 62%)",
    btn: "rgba(255,255,255,.065)", line: "rgba(255,255,255,.14)", fg: "#eaf1fb", mute: "rgba(234,241,251,.58)", chip: "rgba(56,189,248,.20)", acc: "#7dd3fc", glow: "rgba(56,189,248,.35)" },
  laut:    { label: "Laut Dalam", bg: "#031d24", deco: "radial-gradient(950px 560px at 90% -12%, rgba(34,211,238,.30), transparent 60%), radial-gradient(850px 620px at -10% 110%, rgba(21,128,61,.35), transparent 62%)",
    btn: "rgba(255,255,255,.075)", line: "rgba(255,255,255,.15)", fg: "#e9fbf7", mute: "rgba(233,251,247,.60)", chip: "rgba(45,212,191,.22)", acc: "#5eead4", glow: "rgba(45,212,191,.35)" },
  hutan:   { label: "Hutan Pinus", bg: "#061109", deco: "radial-gradient(950px 560px at 85% -10%, rgba(52,211,153,.28), transparent 60%), radial-gradient(800px 560px at -10% 110%, rgba(101,163,13,.22), transparent 62%)",
    btn: "rgba(255,255,255,.07)", line: "rgba(255,255,255,.15)", fg: "#edfdf3", mute: "rgba(237,253,243,.60)", chip: "rgba(74,222,128,.20)", acc: "#86efac", glow: "rgba(74,222,128,.35)" },
  kopi:    { label: "Kopi Susu", bg: "#120b08", deco: "radial-gradient(950px 560px at 88% -10%, rgba(217,119,6,.30), transparent 60%), radial-gradient(800px 560px at -8% 110%, rgba(180,83,9,.25), transparent 62%)",
    btn: "rgba(255,255,255,.07)", line: "rgba(255,255,255,.15)", fg: "#fdf3e7", mute: "rgba(253,243,231,.62)", chip: "rgba(245,158,11,.22)", acc: "#fcd34d", glow: "rgba(245,158,11,.35)" },
  mentari: { label: "Mentari", bg: "#fff3e4", deco: "radial-gradient(950px 560px at 88% -12%, rgba(251,146,60,.28), transparent 60%), radial-gradient(800px 600px at -10% 112%, rgba(244,63,94,.16), transparent 60%)",
    btn: "rgba(255,255,255,.82)", line: "rgba(120,53,15,.14)", fg: "#3d1c02", mute: "rgba(61,28,2,.60)", chip: "rgba(251,146,60,.25)", acc: "#ea580c", glow: "rgba(251,146,60,.30)" },
  mawar:   { label: "Mawar", bg: "#fdeef3", deco: "radial-gradient(950px 560px at 90% -12%, rgba(244,114,182,.30), transparent 60%), radial-gradient(800px 560px at -10% 112%, rgba(190,24,93,.12), transparent 62%)",
    btn: "rgba(255,255,255,.85)", line: "rgba(190,24,93,.13)", fg: "#4c0519", mute: "rgba(76,5,25,.58)", chip: "rgba(244,114,182,.28)", acc: "#db2777", glow: "rgba(219,39,119,.28)" },
  kertas:  { label: "Kertas Putih", bg: "#f4f6fb", deco: "radial-gradient(1000px 600px at 88% -12%, rgba(99,102,241,.16), transparent 62%), radial-gradient(800px 560px at -10% 112%, rgba(14,165,233,.12), transparent 60%)",
    btn: "rgba(255,255,255,.95)", line: "rgba(15,23,42,.13)", fg: "#0f172a", mute: "rgba(15,23,42,.58)", chip: "rgba(99,102,241,.14)", acc: "#4f46e5", glow: "rgba(99,102,241,.28)" },
};
export const RADII = { full: "999px", soft: "16px", sharp: "8px" };

const svg = (path, url, view = "0 0 24 24") =>
  `<a class="si" href="${esc(url)}" target="_blank" rel="noopener nofollow" aria-label="media sosial"><svg viewBox="${view}" fill="currentColor" width="19" height="19">${path}</svg></a>`;

export const BRAND_PATHS = {
  instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.3.06-1.7.07-4.9.07s-3.6-.01-4.9-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.11 15.62 2.1 15.24 2.1 12s.01-3.58.08-4.86C2.33 3.9 3.84 2.36 7.1 2.2 8.4 2.15 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.52.01-4.76.07-2.2.1-3.27 1.14-3.37 3.37-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.1 2.22 1.15 3.27 3.37 3.37 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c2.22-.1 3.27-1.16 3.37-3.37.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.1-2.21-1.15-3.27-3.37-3.37C15.52 4.01 15.15 4 12 4zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-3.05a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32z"/>',
  youtube: '<path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>',
  tiktok: '<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .58.04.86.13V9.4a6.33 6.33 0 0 0-.86-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>',
  x: '<path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z"/>',
  facebook: '<path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/>',
  linkedin: '<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
  github: '<path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.23v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .3z"/>',
  whatsapp: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.08-.13-.28-.2-.58-.35zM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.9 9.88zm8.42-18.3A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.41z"/>',
  telegram: '<path d="M11.94 0A12 12 0 1 0 24 12 12 12 0 0 0 11.94 0zm5.87 8.16-1.97 9.3c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.6.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12l-6.87 4.33-2.96-.93c-.64-.2-.66-.64.14-.95l11.57-4.46c.53-.2 1 .12.83.91z"/>',
  spotify: '<path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 17.31a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.6-1.05 8.53-.6 11.66 1.34.36.22.47.68.25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.99-8.16-2.56-11.98-1.4a.94.94 0 1 1-.55-1.8c4.37-1.33 9.83-.7 13.51 1.6.44.27.58.85.31 1.29zm.13-3.4C15.24 8.33 8.84 8.1 5.15 9.2a1.12 1.12 0 1 1-.65-2.15c4.24-1.28 11.29-1 15.72 1.64a1.12 1.12 0 0 1-1.12 1.95z"/>',
  mail: '<path d="M1.5 4h21a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 22.5 20h-21A1.5 1.5 0 0 1 0 18.5v-13A1.5 1.5 0 0 1 1.5 4zm10.55 8.02L2.53 6.53v11.28l7.8-5.04 1.72 1.11 1.72-1.11 7.7 5.04V6.53l-9.42 5.49z"/>',
  web: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.93 9h-3.02a15.7 15.7 0 0 0-1.3-6.3A8.03 8.03 0 0 1 19.93 11zM12 4a13.6 13.6 0 0 1 2.38 7H9.62A13.6 13.6 0 0 1 12 4zM4.07 11h3.02a15.7 15.7 0 0 1 1.3-6.3A8.03 8.03 0 0 0 4.07 11zm0 2a8.03 8.03 0 0 0 4.32 6.3 15.7 15.7 0 0 1-1.3-6.3H4.07zM12 20a13.6 13.6 0 0 1-2.38-7h4.76A13.6 13.6 0 0 1 12 20zm2.61-.7a15.7 15.7 0 0 0 1.3-6.3h3.02a8.03 8.03 0 0 1-4.32 6.3z"/>',
  shopee: '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm4.5 12.6c0 1.4-.3 2.5-1 3.3-.6.8-1.6 1.2-2.9 1.2-1.2 0-2.2-.4-3-1.3-.7-.9-1.1-2-1.1-3.4v-.3c0-1.4.3-2.5 1-3.3.6-.8 1.5-1.2 2.7-1.2.5 0 .9.1 1.3.2v-.3l.1-1.2h1.9l-.3 4.7a7.4 7.4 0 0 1-.3 1.9l.1.1c.2.4.4.6.7.6.5 0 .9-.3 1.1-1 .2-.7.2-1.5.2-2.5 0-1.6-.4-2.9-1.2-3.9-.8-1-2-1.5-3.6-1.5h-.6c-1.9.1-3.3.6-4.3 1.6-1 1-1.5 2.5-1.5 4.5s.5 3.5 1.5 4.5c1 1 2.4 1.5 4.3 1.5 1.7 0 3.1-.5 4-1.6.9-1 1.4-2.5 1.4-4.4v-.8c-.5.5-1.1.7-1.9.7-1.1 0-1.9-.4-2.4-1.3-.3-.5-.4-1.3-.4-2.2l.1-3.6c.2-.9.6-1.6 1.2-2.1.6-.5 1.4-.7 2.4-.7 1.8 0 3.1.5 4 1.6.9 1 1.3 2.5 1.3 4.4v.6z"/>',
  tokopedia: '<path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 3.8 8.2 8.2v3.6l-8.2-8.2L3.8 15.6V12L12 3.8zM3.8 19.6v-1.4l8.2-8.2 8.2 8.2v1.4z"/>',
  saweria: '<path d="M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm7 4a6 6 0 0 0 0 12 6 6 0 0 0 0-12zm0 2.4c.1.2 1.2 3.4 1.2 3.6 0 .5-.4 1-1 1a.9.9 0 0 1-1-.9c0-.1.4-1.1.4-1.1l-1.2 2.6h1.6l.8-2.1.8 2.1h1.6l-1.4-2.9c1 .2 1.7.7 2.2 1.4v-2a6.2 6.2 0 0 0-4-1.7z"/>',
  pinterest: '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.17-.11-.95-.2-2.4.04-3.44.22-.93 1.4-5.94 1.4-5.94s-.36-.71-.36-1.76c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.76 1.51 1.68 0 1.02-.65 2.55-.99 3.97-.28 1.19.6 2.16 1.77 2.16 2.13 0 3.76-2.25 3.76-5.49 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.21 0 1.03.4 2.14.89 2.74.1.12.11.22.08.34-.09.38-.3 1.19-.34 1.36-.05.23-.18.28-.41.17-1.52-.71-2.47-2.93-2.47-4.72 0-3.84 2.79-7.37 8.05-7.37 4.23 0 7.51 3.01 7.51 7.04 0 4.2-2.65 7.58-6.33 7.58-1.24 0-2.4-.64-2.8-1.4l-.76 2.9c-.27 1.06-1.02 2.39-1.52 3.2 1.14.35 2.35.54 3.61.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>',
};

export function socIcon(kind, url) {
  const p = BRAND_PATHS[kind] || BRAND_PATHS.web;
  return svg(p, url);
}

export function publicPageData(u, links) {
  const t = THEMES[u.theme] || THEMES.galaxy;
  const radius = RADII[u.radius] || "16px";
  const main = [], soc = [];
  for (const l of links) {
    const d = { ...l, clicks: Number(l.clicks), id: Number(l.id) };
    if (d.kind === "mail" || BRAND_PATHS[d.kind]) soc.push(d);
    else main.push(d);
  }
  const socials = soc.slice(0, 8);
  return { t, radius, main, socials };
}

const MINI_LOGO =
  '<svg viewBox="0 0 64 64" width="15" height="15" style="vertical-align:-3px;border-radius:5px;overflow:hidden" aria-hidden="true"><rect width="64" height="64" fill="#0F5B4D"/><g fill="none" stroke="#F7F0E3" stroke-width="7" stroke-linecap="round"><rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)"/><rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)"/></g><circle cx="45" cy="19" r="5" fill="#E4572E"/></svg>';
const EYE_SVG =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>';
const SHARE_SVG =
  '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>';

function resolveChip(iconKey) {
  // ikon kategori SVG bila cocok; selain itu simbol ikon tautan bawaan
  const srcIcon = GENERIC[iconKey] || GENERIC.globe;
  return `<span class="ch" aria-hidden="true">${srcIcon}</span>`;
}

export function renderPublic(u, links, opts = {}) {
  const { t, radius, main, socials } = publicPageData(u, links);
  const preview = !!opts.preview;
  const month = new Date(Number(u.created_at) * 1000).toLocaleDateString("id-ID", { month: "short", year: "numeric" });

  const avatarSrc = u.avatar ? optimized(u.avatar, { w: 320, c_fill: true }) : "";
  const avatarHtml = avatarSrc
    ? `<div class="av"><img src="${esc(avatarSrc)}" alt="Foto profil ${esc(u.name)}" referrerpolicy="no-referrer" onerror="this.remove();this.parentNode.classList.add('bad');this.parentNode.querySelector('.init').hidden=false"><span class="init" hidden>${esc(initials(u.name))}</span></div>`
    : `<div class="av bad"><span class="init">${esc(initials(u.name))}</span></div>`;

  const bioHtml = (u.bio || "").split("\n").map((x) => esc(x)).join("<br>");
  const socRow = socials.length
    ? `<div class="soc">${socials.map((s) => socIcon(s.kind, esc(s.url))).join("")}</div>`
    : "";

  const rows = main
    .map((l) => {
      const chip = l.emoji ? resolveChip(l.emoji) : "";
      return `<a class="lnk" href="${esc(l.url)}" target="_blank" rel="noopener nofollow" data-id="${Number(l.id)}">
      ${chip}<span class="tt">${esc(l.title)}</span>
      <svg class="go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`;
    })
    .join("\n");

  const clickJs = `<script>document.querySelectorAll('.lnk').forEach(function(a){a.addEventListener('click',function(){fetch('/api/links/click/'+a.dataset.id,{method:'POST'}).catch(function(){})})})<\/script>`;
  const shareJs = `<script>(function(){var b=document.getElementById('sh'),t=document.getElementById('toast');
function pop(m){t.textContent=m;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},1800)}
b.addEventListener('click',function(){var u=location.href;
if(navigator.share){navigator.share({title:document.title,url:u}).catch(function(){})}
else if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){pop('Link disalin!')}).catch(function(){pop(u)})}else{pop(u)}});})();<\/script>`;

  const body = `<div class="wrap">
    ${avatarHtml}
    <h1 class="name">${esc(u.name)}</h1>
    <p class="user">@${esc(u.username)}</p>
    <p class="bio">${bioHtml}</p>
    ${socRow}
    <main>${rows}</main>
    <span class="hits">${EYE_SVG} ${fmtNum(u.views)} kunjungan</span>
    <div class="foot"><span>Dibuat dengan <b class="brandfoot">${MINI_LOGO} Pautin</b></span><span>Bergabung ${month}</span></div>
  </div>
  <div class="sharef"><button id="sh" aria-label="Bagikan halaman ini" title="Bagikan halaman ini">${SHARE_SVG}</button></div>
  <div class="toast" id="toast">Link disalin!</div>
  ${clickJs}${preview ? "" : shareJs}`;

  const css = PAGE_CSS.replaceAll("{{BG}}", t.bg).replaceAll("{{DECO}}", t.deco)
    .replaceAll("{{BTN}}", t.btn).replaceAll("{{LINE}}", t.line).replaceAll("{{FG}}", t.fg)
    .replaceAll("{{MUTE}}", t.mute).replaceAll("{{CHIP}}", t.chip).replaceAll("{{ACC}}", t.acc)
    .replaceAll("{{GLOW}}", t.glow).replaceAll("{{RAD}}", radius);

  return { body, css, month };
}

const PAGE_CSS = `
:root{--bg:{{BG}};--deco:{{DECO}};--btn:{{BTN}};--line:{{LINE}};--fg:{{FG}};--mute:{{MUTE}};--chip:{{CHIP}};--acc:{{ACC}};--glow:{{GLOW}};--rad:{{RAD}}}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{font-family:var(--font-manrope),ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:var(--bg);background-image:var(--deco);background-attachment:fixed;color:var(--fg);min-height:100vh;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit;-webkit-tap-highlight-color:transparent}
::selection{background:var(--acc);color:var(--bg)}
button{cursor:pointer;font:inherit}
:focus-visible{outline:3px solid var(--acc);outline-offset:2px;border-radius:8px}
.wrap{max-width:560px;margin:0 auto;padding:52px 22px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;animation:in .45s ease both}
@keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1}}
.av{width:96px;height:96px;border-radius:50%;background:var(--btn);border:2px solid var(--line);box-shadow:0 0 0 6px color-mix(in srgb,var(--chip) 55%,transparent),0 14px 34px -14px var(--glow);overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.av img{width:100%;height:100%;object-fit:cover}
.av.bad{background:var(--chip)}
.av .init{font-size:34px;font-weight:800;letter-spacing:.5px;color:var(--fg);font-family:var(--font-sora),sans-serif}
h1.name{font-size:24px;font-weight:800;letter-spacing:-.4px;font-family:var(--font-sora),sans-serif}
p.user{font-size:13px;color:var(--mute);margin:5px 0 6px;font-weight:600}
p.bio{font-size:14.5px;color:var(--mute);max-width:430px;line-height:1.6;margin:6px auto 0}
.soc{display:flex;gap:13px;justify-content:center;margin:22px 0 4px;flex-wrap:wrap}
.si{width:41px;height:41px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--btn);border:1px solid var(--line);color:var(--fg);transition:.18s;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.si:hover{transform:translateY(-3px);color:var(--acc);border-color:var(--acc);box-shadow:0 10px 24px -10px var(--glow)}
main{width:100%;margin-top:22px;display:flex;flex-direction:column;gap:10px}
.lnk{display:flex;align-items:center;gap:12px;background:var(--btn);border:1px solid var(--line);border-radius:var(--rad);padding:10px 15px;color:var(--fg);text-decoration:none;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:transform .16s,box-shadow .16s,border-color .16s;text-align:left}
.lnk:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--acc) 70%,transparent);box-shadow:0 16px 34px -14px var(--glow)}
.lnk:active{transform:translateY(0) scale(.992)}
.lnk .ch{flex:0 0 38px;width:38px;height:38px;border-radius:50%;background:var(--chip);display:flex;align-items:center;justify-content:center;color:var(--fg)}
.lnk .ch svg{width:21px;height:21px}
.lnk .tt{flex:1;font-size:15px;font-weight:650;letter-spacing:-.1px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.lnk .go{flex:0 0 auto;width:17px;height:17px;opacity:.45;transition:.15s}
.lnk:hover .go{opacity:1;color:var(--acc)}
.foot{font-size:12px;color:var(--mute);margin-top:42px;display:flex;flex-direction:column;align-items:center;gap:5px;opacity:.95}
.brandfoot{display:inline-flex;align-items:center;gap:6px;color:var(--fg);font-weight:800;font-family:var(--font-sora),sans-serif}
.hits{font-size:12.5px;color:var(--mute);margin-top:16px;display:inline-flex;align-items:center;gap:6px;background:var(--btn);border:1px solid var(--line);padding:5px 12px;border-radius:999px}
.sharef{position:fixed;bottom:22px;right:22px;z-index:9}
.sharef button{width:52px;height:52px;border-radius:50%;border:1px solid var(--line);background:var(--btn);color:var(--fg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px -8px rgba(0,0,0,.45);transition:.2s}
.sharef button:hover{transform:translateY(-3px);border-color:var(--acc)}
.toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(90px);background:var(--fg);color:var(--bg);font-size:13.5px;font-weight:700;padding:10px 18px;border-radius:999px;transition:.3s;opacity:0;z-index:20;box-shadow:0 12px 30px rgba(0,0,0,.3);pointer-events:none}
.toast.show{transform:translateX(-50%);opacity:1}
@media(max-width:480px){.wrap{padding:42px 16px 32px}.sharef{right:16px;bottom:16px}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
