import { ImageResponse } from "next/og";

export const alt = "Pautin — satu link untuk semua tautanmu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const Mark = () => (
  <div
    style={{
      display: "flex", width: 130, height: 130, borderRadius: 36, background: "#0F5B4D",
      alignItems: "center", justifyContent: "center", position: "relative",
    }}
  >
    <svg viewBox="0 0 64 64" width="92" height="92">
      <g fill="none" stroke="#F7F0E3" strokeWidth="7" strokeLinecap="round">
        <rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)" />
        <rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)" />
      </g>
      <circle cx="45" cy="19" r="5" fill="#E4572E" />
    </svg>
  </div>
);

export default function RootOgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F7F3EA", position: "relative" }}>
        <div style={{ position: "absolute", top: -140, right: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(15,91,77,.16), transparent)" }} />
        <div style={{ position: "absolute", bottom: -160, left: -140, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(228,87,46,.14), transparent)" }} />
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "72px 76px", gap: 44 }}>
          <Mark />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: -2, color: "#1B2B24", fontFamily: "sans-serif" }}>Pautin</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#E4572E", marginTop: 6 }}>Satu link untuk semua tautanmu</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 76px", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -3, color: "#1B2B24", fontFamily: "sans-serif" }}>Satu link.</div>
            <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -3, color: "#0F5B4D", fontFamily: "sans-serif" }}>Semua tautanmu.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 12, marginTop: 30 }}>
            {["Halaman pribadi", "Statistik kunjungan dan klik", "QR code", "Tanpa iklan"].map((x) => (
              <div key={x} style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFFCF5", border: "1.5px solid #E3DAC6", borderRadius: 999, padding: "12px 22px", fontSize: 22, fontWeight: 700, color: "#3A4A42" }}>
                <span style={{ width: 16, height: 16, borderRadius: 999, background: "#E4572E", display: "flex" }} />
                {x}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", padding: "36px 76px", fontSize: 21, color: "#5F6F68", fontWeight: 600, justifyContent: "space-between", borderTop: "1px solid #E3DAC6", margin: "0 76px", alignItems: "center" }}>
          <span>pautin/u/username-mu</span>
          <span>Gratis · Cloudflare · WebP</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
