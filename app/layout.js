import { Sora, Manrope } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-sora" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata = {
  title: { default: "Pautin — Satu Link untuk Semua Tautanmu", template: "%s — Pautin" },
  description:
    "Buat halaman profil berisi semua tautanmu dalam satu link singkat. Gratis, cepat, siap dibagikan ke mana saja.",
  applicationName: "Pautin",
  authors: [{ name: "XykalNotKel", url: "https://github.com/xykalnotkel" }],
  creator: "XykalNotKel",
  icons: { icon: "/icon.svg", apple: "/brand/icon-180.png" },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pautin.xyc.my.id"),
  openGraph: {
    title: "Pautin — Satu Link untuk Semua Tautanmu",
    description: "Buat halaman profil berisi semua tautanmu dalam satu link singkat. Gratis dan cepat.",
    type: "website",
    locale: "id_ID",
    siteName: "Pautin",
  },
  twitter: { card: "summary_large_image", site: "@pautin", creator: "@pautin" },
  robots: { index: true, follow: true },
  category: "web",
  keywords: ["link in bio", "pautin", "satu link", "tautan", "linktree alternatif"],
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0F5B4D" };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${sora.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
