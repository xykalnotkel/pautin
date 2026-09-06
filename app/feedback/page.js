import FeedbackForm from "./FeedbackForm";

export const metadata = {
  title: "Feedback, Saran & Kritik — Pautin",
  description: "Kirim saran, kritik, laporan masalah, atau ide untuk Pautin.",
};

export default function FeedbackPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F3EA",
        fontFamily: "Manrope, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
        color: "#14231E",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "34px 20px 70px" }}>
        <a
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            textDecoration: "none", color: "#14231E", fontWeight: 800, fontSize: 15,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 64 64" style={{ borderRadius: 8 }}>
            <rect width="64" height="64" rx="15" fill="#0F5B4D" />
            <g fill="none" stroke="#F7F0E3" strokeWidth="7" strokeLinecap="round">
              <rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)" />
              <rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)" />
            </g>
            <circle cx="45" cy="19" r="5" fill="#E4572E" />
          </svg>
          Pautin
        </a>

        <h1 style={{ margin: "38px 0 6px", fontSize: 30, letterSpacing: "-.7px", lineHeight: 1.2 }}>
          Feedback, saran &amp; kritik
        </h1>
        <p style={{ margin: 0, color: "#5F6F68", fontSize: 14.5, lineHeight: 1.7, fontWeight: 600 }}>
          Pautin dibuat untuk dipakai, dan kami ingin tahu bagaimana rasanya dipakai. Sampaikan
          ide, kritik membangun, laporan masalah, atau permintaan fitur — semuanya dibaca sungguhan.
        </p>

        <FeedbackForm />

        <a
          href="/dashboard"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22,
            color: "#0F5B4D", fontWeight: 800, fontSize: 13.5, textDecoration: "none",
          }}
        >
          ← Kembali ke dashboard
        </a>
      </div>
    </div>
  );
}
