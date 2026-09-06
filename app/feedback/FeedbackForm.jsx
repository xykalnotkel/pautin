"use client";

import { useState } from "react";

const CATS = [
  ["saran", "💡", "Saran"],
  ["kritik", "🗣️", "Kritik"],
  ["masalah", "⚠️", "Laporan masalah"],
  ["lainnya", "💬", "Lainnya"],
];

const L = {
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1.5px solid #E0D7C2",
    borderRadius: 13,
    background: "#FFFCF5",
    padding: "11px 13px",
    font: "inherit",
    fontSize: 14,
    color: "#14231E",
    outline: "none",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: ".4px",
    textTransform: "uppercase",
    color: "#5F6F68",
    margin: "0 0 7px",
  },
};

export default function FeedbackForm() {
  const [cat, setCat] = useState("saran");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  async function send(ev) {
    ev.preventDefault();
    if (busy) return;
    const clean = msg.trim();
    if (clean.length < 10) {
      setErr("Tulis pesan minimal 10 karakter agar kami bisa memahaminya.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: cat,
          name: name.trim(),
          email: email.trim(),
          message: clean,
          url: location.pathname + location.search,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Gagal mengirim. Coba lagi sebentar.");
      setDone(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div
        style={{
          marginTop: 28, background: "#E7EFEA", border: "1.5px solid #C9DED2",
          borderRadius: 18, padding: "30px 26px", textAlign: "center",
        }}
      >
        <div style={{ fontSize: 34, marginBottom: 8 }}>✅</div>
        <div style={{ fontWeight: 800, fontSize: 17 }}>Terima kasih, pesanmu terkirim!</div>
        <p style={{ color: "#22463A", fontSize: 13.5, lineHeight: 1.7, margin: "10px 0 18px" }}>
          Feedback-mu sudah kami catat dan dibaca. Kiriman yang membutuhkan balasan akan
          dijawab lewat email.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { setDone(false); setMsg(""); setName(""); setEmail(""); }}
            style={{
              cursor: "pointer", border: "1.5px solid #0F5B4D", color: "#0F5B4D",
              background: "transparent", borderRadius: 999, padding: "9px 20px",
              fontWeight: 800, fontSize: 13.5,
            }}
          >
            Kirim lagi
          </button>
          <a
            href="/dashboard"
            style={{
              textDecoration: "none", background: "#0F5B4D", color: "#fff",
              borderRadius: 999, padding: "9px 20px", fontWeight: 800, fontSize: 13.5,
            }}
          >
            Ke dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={send}
      style={{
        marginTop: 28, background: "#FFFCF5", border: "1.5px solid #E0D7C2",
        borderRadius: 18, padding: "24px 26px 26px", boxShadow: "0 24px 50px -34px rgba(27,43,36,.4)",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <span style={L.label}>Jenis pesan</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATS.map(([k, emo, lab]) => (
            <button
              type="button"
              key={k}
              onClick={() => setCat(k)}
              aria-pressed={cat === k}
              style={{
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                border: cat === k ? "1.5px solid #0F5B4D" : "1.5px solid #E0D7C2",
                background: cat === k ? "#E7EFEA" : "#FFFCF5",
                color: cat === k ? "#0F5B4D" : "#5F6F68",
                borderRadius: 999, padding: "7px 15px", fontWeight: 800, fontSize: 13,
                transition: ".12s",
              }}
            >
              <span style={{ fontSize: 14 }}>{emo}</span>
              {lab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={L.label} htmlFor="fbName">Nama <span style={{ textTransform: "none", opacity: 0.7 }}>(opsional)</span></label>
          <input
            id="fbName" style={L.input} maxLength={60} value={name} autoComplete="name"
            onChange={(e) => setName(e.target.value)} placeholder="mis. Rizky"
          />
        </div>
        <div>
          <label style={L.label} htmlFor="fbEmail">Email <span style={{ textTransform: "none", opacity: 0.7 }}>(opsional, jika ingin dijawab)</span></label>
          <input
            id="fbEmail" type="email" style={L.input} maxLength={120} value={email}
            autoComplete="email" onChange={(e) => setEmail(e.target.value)} placeholder="kamu@contoh.com"
          />
        </div>
      </div>

      <div>
        <label style={L.label} htmlFor="fbMsg">Pesan</label>
        <textarea
          id="fbMsg" required style={{ ...L.input, minHeight: 130, resize: "vertical", lineHeight: 1.6 }}
          maxLength={2000} value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ceritakan apa yang kamu rasakan: fitur yang membantu, yang membingungkan, error yang kamu temui, atau ide yang kamu ingin ada…"
        />
        <div style={{ textAlign: "right", fontSize: 11.5, color: "#8B8575", fontWeight: 700, marginTop: 4 }}>
          {msg.length}/2000
        </div>
      </div>

      {err && (
        <div
          role="alert"
          style={{
            background: "#FBEDEA", border: "1.5px solid #F2CFC6", color: "#B3402A",
            borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 700, marginTop: 8,
          }}
        >
          {err}
        </div>
      )}

      <button
        type="submit" disabled={busy}
        style={{
          width: "100%", cursor: busy ? "wait" : "pointer", border: "0",
          background: "#E4572E", color: "#fff", borderRadius: 13, padding: "13px",
          fontWeight: 800, fontSize: 14.5, marginTop: 14,
        }}
      >
        {busy ? "Mengirim…" : "Kirim feedback"}
      </button>
    </form>
  );
}
