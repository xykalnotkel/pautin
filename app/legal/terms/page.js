import Shell from "@/components/Shell";

export const metadata = { title: "Ketentuan Layanan", description: "Syarat dan ketentuan penggunaan layanan Pautin." };

export default function TermsPage() {
  return (
    <Shell kicker="Legal" title="Ketentuan Layanan" lastUpdate="6 September 2026">
      <h2>1. Penerimaan ketentuan</h2>
      <p>
        Dengan mendaftar, mengakses, atau menggunakan Pautin ("Layanan"), Anda menyatakan telah membaca, memahami,
        dan menyetujui seluruh Ketentuan Layanan ini. Jika Anda tidak setuju, mohon jangan menggunakan Layanan.
      </p>
      <h2>2. Layanan</h2>
      <p>
        Pautin menyediakan halaman profil berisi kumpulan tautan ("Halaman") beserta perangkat pengelolaannya.
        Layanan diberikan "sebagaimana adanya" (as is) dan dapat berubah sewaktu-waktu demi perbaikan.
      </p>
      <h2>3. Akun dan tanggung jawab pengguna</h2>
      <ul>
        <li>Anda bertanggung jawab penuh atas keamanan kata sandi dan seluruh aktivitas pada akun Anda.</li>
        <li>Username dipilih sekali dan bersifat unik; penyalahgunaan username orang lain dapat berakibat penonaktifan.</li>
        <li>Anda menjamin konten yang Anda unggah — termasuk tautan, bio, dan foto profil — tidak melanggar hukum,
          hak cipta, atau hak pihak lain, serta bukan konten dewasa, kekerasan, penipuan, atau berbahaya.</li>
      </ul>
      <h2>4. Konten yang dilarang</h2>
      <ul>
        <li>Materi ilegal, menyesatkan, atau melanggar hak kekayaan intelektual.</li>
        <li>Phishing, malware, atau tautan yang menipu pengunjung.</li>
        <li>Konten yang mempromosikan kekerasan, kebencian, atau eksploitasi.</li>
      </ul>
      <p>Kami dapat menghapus konten atau menonaktifkan akun yang melanggar tanpa pemberitahuan sebelumnya.</p>
      <h2>5. Hak kekayaan intelektual</h2>
      <p>
        Nama, logo, ikon, dan antarmuka Pautin dilindungi hak cipta. Kode sumber Layanan dirilis di bawah lisensi
        <strong> MIT</strong> (lihat halaman Lisensi). Konten yang Anda buat tetap menjadi milik Anda.
      </p>
      <h2>6. Batasan tanggung jawab</h2>
      <p>
        Sepanjang diizinkan hukum, Pautin tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau
        konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan, termasuk tautan pihak
        ketiga yang Anda atau pengunjung Anda akses dari Halaman.
      </p>
      <h2>7. Penghentian</h2>
      <p>
        Anda dapat berhenti menggunakan Layanan kapan saja dengan menghubungi kami. Kami dapat menghentikan akses
        jika terjadi pelanggaran berarti atas ketentuan ini.
      </p>
      <h2>8. Perubahan ketentuan</h2>
      <p>
        Ketentuan ini dapat diperbarui; versi terbaru selalu tersedia di halaman ini dan berlaku sejak dipublikasikan.
        Penggunaan berkelanjutan berarti persetujuan atas perubahan tersebut.
      </p>
    </Shell>
  );
}
