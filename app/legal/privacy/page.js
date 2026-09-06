import Shell from "@/components/Shell";

export const metadata = { title: "Kebijakan Privasi", description: "Bagaimana Pautin mengumpulkan, menggunakan, dan melindungi data Anda." };

export default function PrivacyPage() {
  return (
    <Shell kicker="Legal" title="Kebijakan Privasi" lastUpdate="6 September 2026">
      <h2>1. Data yang kami simpan</h2>
      <ul>
        <li><strong>Data akun:</strong> username, nama tampilan, bio, foto profil, preferensi tema.</li>
        <li><strong>Konten Halaman:</strong> daftar tautan beserta judul dan ikon yang Anda atur.</li>
        <li><strong>Teknis:</strong> alamat IP dan stempel waktu dikumpulkan sementara untuk keamanan (rate limit, anti-penyalahgunaan).</li>
      </ul>
      <h2>2. Kata sandi</h2>
      <p>
        Kami tidak pernah menyimpan kata sandi dalam bentuk teks. Kata sandi diproses dengan fungsi turunan
        <strong> PBKDF2-SHA256</strong> (120.000 iterasi) plus garam acak per akun, sehingga tidak dapat dibaca
        balik — bahkan oleh kami.
      </p>
      <h2>3. Sesion</h2>
      <p>
        Saat masuk, kami menerbitkan sesi berupa token acak yang disimpan di peramban Anda sebagai cookie aman
        (HttpOnly) atau dikirim lewat header saat cookie tidak tersedia. Token berlaku 30 hari dan dapat dihapus
        sewaktu-waktu lewat tombol Keluar.
      </p>
      <h2>4. Media profil</h2>
      <p>
        Foto profil diproses oleh <strong>Cloudinary</strong> dan otomatis dikonversi serta dioptimalkan ke format
        <strong> WebP</strong> dengan kualitas adaptif (q_auto). Gambar yang Anda unggah hanya digunakan untuk
        menampilkan foto profil pada Halaman Anda.
      </p>
      <h2>5. Pelacakan kunjungan dan klik</h2>
      <p>
        Kami menghitung jumlah kunjungan Halaman dan klik tiap tautan sebagai angka agregat untuk statistik Anda.
        Angka ini tidak mengidentifikasi pengunjung secara pribadi. Kami tidak memasang iklan dan tidak berbagi data
        dengan jaringan periklanan.
      </p>
      <h2>6. Perlindungan anti-bot dan anti-DDoS</h2>
      <p>
        Formulir pendaftaran dan masuk dilindungi oleh <strong>Cloudflare Turnstile</strong>, serta pembatasan laju
        permintaan berbasis alamat IP untuk mencegah serangan berulang. Halaman publik juga dapat dilayani lewat
        jaringan Cloudflare yang memfilter serangan DDoS secara otomatis.
      </p>
      <h2>7. Tautan pihak ketiga</h2>
      <p>
        Halaman Anda menautkan ke situs luar. Kebijakan ini hanya berlaku untuk Pautin; kami tidak bertanggung jawab
        atas praktik privasi situs tujuan.
      </p>
      <h2>8. Hak Anda</h2>
      <p>
        Anda dapat meminta salinan data, perbaikan, atau penghapusan akun dan seluruh datanya kapan saja melalui
        halaman isu GitHub atau email kontak. Permintaan penghapusan diproses dalam 14 hari kerja.
      </p>
      <h2>9. Penyimpanan data</h2>
      <p>
        Data disimpan pada infrastruktur <strong>Cloudflare D1</strong> (sistem penyimpanan terdistribusi) dan
        database lokal saat pengembangan. Kami menerapkan enkripsi dalam perjalanan (TLS) untuk seluruh komunikasi.
      </p>
      <h2>10. Perubahan kebijakan</h2>
      <p>
        Perubahan kebijakan akan dicantumkan di halaman ini beserta tanggal versi. Perubahan materiil akan kami
        umumkan melalui kanal resmi.
      </p>
    </Shell>
  );
}
