import Shell from "../Shell";

// Semua sub-halaman dashboard (/dashboard/tautan, /dashboard/statistik, dll)
// ditangani shell yang sama; router halaman ada di sisi klien (public/a/app.js).
export default function DashboardSubPage() {
  return <Shell />;
}
