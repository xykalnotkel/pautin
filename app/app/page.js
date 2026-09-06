"use client";

import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    if (window.__pautinScripts) return;
    window.__pautinScripts = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/a/app.css";
    document.head.appendChild(link);

    const s = document.createElement("script");
    s.src = "/a/app.js";
    s.onload = () => window.__pautinBoot && window.__pautinBoot();
    document.body.appendChild(s);
  }, []);

  return (
    <div id="rootEl" style={{ minHeight: "100vh", background: "#f6f5fb" }}>
      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "60vh", gap: 14, color: "#6d6782", fontFamily: "system-ui,sans-serif",
        }}
      >
        <span style={{ fontSize: 40 }}>🔗</span>
        <span style={{ fontWeight: 700 }}>Memuat Pautin…</span>
      </div>
    </div>
  );
}
