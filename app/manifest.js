export default function manifest() {
  return {
    name: "Pautin — Satu Link untuk Semua Tautanmu",
    short_name: "Pautin",
    description: "Buat halaman profil berisi semua tautanmu dalam satu link singkat. Gratis dan cepat.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F3EA",
    theme_color: "#0F5B4D",
    lang: "id",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
