"use client";

import { useEffect } from "react";

export default function AppError({ error, reset }) {
  useEffect(() => {
    try { console.error("Dashboard error:", error); } catch {}
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F3EA", padding: 24, fontFamily: "system-ui,sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 440, background: "#FFFCF5", border: "1.5px solid #E3DAC6", borderRadius: 20, padding: "34px 28px" }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#E4572E" }}>500</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: "10px 0 8px", color: "#1B2B24" }}>Dashboard mengalami kendala</h1>
        <p style={{ color: "#66746C", fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
          Terjadi kesalahan tak terduga pada aplikasi. Muat ulang untuk kembali — perubahan tersimpan aman.
        </p>
        <button
          onClick={() => reset()}
          style={{ background: "#0F5B4D", color: "#F7F0E3", border: 0, borderRadius: 999, padding: "12px 26px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
        >
          Muat ulang dashboard
        </button>
      </div>
    </div>
  );
}
