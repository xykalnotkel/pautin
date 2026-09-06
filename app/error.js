"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    try { console.error("Page error:", error); } catch {}
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#0B241D", color: "#F7F0E3", fontFamily: "system-ui,sans-serif", padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <svg viewBox="0 0 64 64" width="66" height="66" style={{ borderRadius: 18, overflow: "hidden" }} aria-hidden="true">
          <rect width="64" height="64" fill="#0F5B4D" />
          <g fill="none" stroke="#F7F0E3" strokeWidth="6" strokeLinecap="round">
            <rect x="17" y="17" width="21" height="21" rx="8" transform="rotate(45 27.5 27.5)" />
            <rect x="28" y="28" width="21" height="21" rx="8" transform="rotate(-45 38.5 38.5)" />
          </g>
          <circle cx="44.5" cy="19.5" r="4.6" fill="#E4572E" />
        </svg>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -.5, margin: "18px 0 8px" }}>Ups, terjadi kendala</h1>
        <p style={{ color: "rgba(247,240,227,.68)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 26 }}>
          Server tidak dapat menyelesaikan permintaan ini (kode 500). Silakan muat ulang — data kamu tetap aman.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "#E4572E", color: "#fff", border: 0, borderRadius: 999, padding: "12px 24px",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
          <a
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,.1)", color: "#F7F0E3",
              borderRadius: 999, padding: "12px 24px", fontWeight: 800, fontSize: 14, textDecoration: "none",
            }}
          >
            Ke beranda
          </a>
        </div>
      </div>
    </div>
  );
}
