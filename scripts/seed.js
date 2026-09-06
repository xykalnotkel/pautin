import { migrate, seedIfEmpty } from "../lib/db.js";

async function main() {
  await migrate();
  await seedIfEmpty(true);
  console.log("✅ Database siap: skema dibuat & 3 akun demo (rizky/nadia/kopikita, password: demo123) dipastikan ada.");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
