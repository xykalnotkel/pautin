import { migrate } from "../lib/db.js";

async function main() {
  await migrate();
  console.log("[OK] Database siap: skema (dan kolom upgrade) dipastikan ada. Registrasi baru wajib verifikasi email.");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
