"use client";

import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    if (window.__pautinScripts) return;
    window.__pautinScripts = true;

    const add = (tag, attrs, onload) => {
      const el = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      if (onload) el.onload = onload;
      document.body.appendChild(el);
      return el;
    };
    // naikkan V tiap rilis aset berubah agar cache browser/CF tidak menyajikan versi lama
    const V = "20260907d";
    add("link", { rel: "stylesheet", href: `/a/app.css?v=${V}` });
    add("script", { src: `/a/icons.js?v=${V}` });
    add("script", { src: `/a/app.js?v=${V}` }, () => window.__pautinBoot && window.__pautinBoot());
  }, []);

  return (
    <div id="rootEl" style={{ minHeight: "100vh" }}>
      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "60vh", gap: 16, color: "#66746C", fontFamily: "system-ui,sans-serif",
        }}
      >
        <svg viewBox="0 0 64 64" width="46" height="46" style={{ borderRadius: 14, overflow: "hidden", animation: "pl 1.2s ease-in-out infinite" }}>
          <rect width="64" height="64" fill="#0F5B4D" />
          <g fill="none" stroke="#F7F0E3" strokeWidth="7" strokeLinecap="round">
            <rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)" />
            <rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)" />
          </g>
          <circle cx="45" cy="19" r="5" fill="#E4572E" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Memuat Pautin…</span>
        <style>{`@keyframes pl{50%{opacity:.55;transform:translateY(-3px)}}`}</style>
      </div>
    </div>
  );
}
