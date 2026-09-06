import "./globals.css";

export const metadata = {
  title: { default: "Pautin — Satu Link untuk Semua Tautanmu", template: "%s — Pautin" },
  description: "Buat halaman profil berisi semua tautanmu dalam satu link singkat. Gratis, cepat, siap dibagikan ke mana saja.",
  applicationName: "Pautin",
  icons: { icon: "/icon.svg" },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#7c3aed" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
