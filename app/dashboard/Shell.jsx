"use client";

import { useEffect } from "react";

export default function Shell() {
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
    const V = "20260907g";
    add("link", { rel: "stylesheet", href: `/a/app.css?v=${V}` });
    add("script", { src: `/a/icons.js?v=${V}` });
    add("script", { src: `/a/app.js?v=${V}` }, () => window.__pautinBoot && window.__pautinBoot());
  }, []);

  return (
    <div id="rootEl" style={{ minHeight: "100vh" }}>
      <noscript style={{ display: "block", padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
        Dashboard Pautin butuh JavaScript. Aktifkan JavaScript lalu muat ulang halaman.
      </noscript>
    </div>
  );
}
