import Shell from "@/components/Shell";

export const metadata = { title: "Lisensi", description: "Lisensi MIT untuk kode sumber Pautin dan kebijakan aset merek." };

export default function LicensePage() {
  return (
    <Shell kicker="Legal" title="Lisensi" lastUpdate="6 September 2026">
      <h2>Lisensi MIT (kode sumber)</h2>
      <p>
        Kode sumber Pautin dirilis di bawah <strong>Lisensi MIT</strong>. Salinan lengkap tersedia pada berkas
        <code> LICENSE </code> di repositori. Ringkasnya, Anda bebas menggunakan, menyalin, memodifikasi, menggabungkan,
        menerbitkan, dan menjual salinan perangkat lunak ini, dengan syarat pemberitahuan hak cipta berikut disertakan:
      </p>
      <p style={{ fontFamily: "monospace", fontSize: "13.5px", background: "#F1EBDD", border: "1px solid #E6DECB", borderRadius: 12, padding: 16 }}>
        Copyright (c) 2026 XykalNotKel
        <br /><br />
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED...
      </p>
      <h2>Aset merek</h2>
      <ul>
        <li><strong>Logo, nama "Pautin", dan ikon asli</strong> adalah aset merek. Penggunaan untuk mempromosikan
        layanan tiruan atau membingungkan publik tidak diizinkan.</li>
        <li>Konten visual generatif untuk logo dibuat khusus untuk Pautin; versi vektor utama dirancang sendiri.</li>
        <li>Ikon media sosial (Instagram, YouTube, dan lainnya) adalah merek dagang pemiliknya masing-masing; kami
        menggunakannya hanya sebagai penanda tautan ke platform tersebut.</li>
      </ul>
      <h2>Konten pengguna</h2>
      <p>
        Bio, tautan, dan foto profil yang dibuat pengguna adalah milik pengguna masing-masing. Pautin tidak mengklaim
        kepemilikan atas konten tersebut.
      </p>
      <h2>Attribution</h2>
      <ul>
        <li>Typeface: Sora &amp; Manrope (OFL License) oleh Google Fonts.</li>
        <li>Infrastruktur: Next.js (MIT), Cloudflare D1, Vercel.</li>
      </ul>
    </Shell>
  );
}
