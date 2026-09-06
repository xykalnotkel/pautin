import Shell from "@/components/Shell";

export const metadata = { title: "Tentang Pautin", description: "Cerita di balik Pautin: satu link untuk semua tautanmu." };

export default function AboutPage() {
  return (
    <Shell kicker="Tentang" title="Kenapa Pautin?" lastUpdate="6 September 2026">
      <h2>Visi</h2>
      <p>
        Setiap orang hanya butuh <strong>satu alamat</strong> untuk seluruh kehadiran digitalnya. Bio Instagram,
        kartu nama, atau pesan singkat — tempatnya sempit, tapi tautannya banyak. Pautin lahir untuk menjawab itu:
        sebuah halaman pribadi yang merangkum semua tautan pentingmu, cepat dibuka, dan mudah dibagikan.
      </p>
      <h2>Nilai yang kami pegang</h2>
      <ul>
        <li><strong>Ringan dan cepat.</strong> Halaman publik dirender langsung di server, tanpa jejak iklan atau pelacak pihak ketiga.</li>
        <li><strong>Privasi sejak awal.</strong> Data profil hanya dipakai untuk menjalankan layanan. Kami tidak menjual data ke siapa pun.</li>
        <li><strong>Gratis untuk semua.</strong> Fitur inti — halaman, tautan tanpa batas, tema, dan statistik — terbuka tanpa biaya.</li>
        <li><strong>Keamanan yang serius.</strong> Kata sandi di-hash dengan PBKDF2, form dilindungi Turnstile dan pembatasan laju permintaan (rate limit).</li>
      </ul>
      <h2>Teknologi</h2>
      <p>
        Pautin dibangun dengan <strong>Next.js</strong> (React) dan dikembangkan serta diuji secara terbuka di GitHub.
        Database menggunakan <strong>Cloudflare D1</strong> — penyimpanan SQL terdistribusi di tepi jaringan — sementara
        perlindungan anti-bot dan anti-DDoS memanfaatkan infrastruktur <strong>Cloudflare</strong>. Media profil
        diproses dan dioptimalkan otomatis ke format <strong>WebP</strong> agar tetap tajam namun ringan diunduh.
      </p>
      <h2>Peta jalan</h2>
      <ul>
        <li>Tema kustom dan penataan halaman tingkat lanjut</li>
        <li>Statistik rinci: lokasi pengunjung, perangkat, dan sumber kunjungan</li>
        <li>Alias tautan pendek kustom untuk tiap baris</li>
        <li>Timelink (jadwal tautan) dan e-commerce terpadu</li>
      </ul>
      <h2>Kontak</h2>
      <p>
        Masukan, laporan bug, atau pertanyaan? Buka <a href="https://github.com/xykalnotkel/pautin/issues" target="_blank" rel="noopener">halaman isu GitHub kami</a> — kami baca satu per satu.
      </p>
    </Shell>
  );
}
