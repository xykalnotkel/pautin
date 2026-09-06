import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { uploadImage, cloudinaryOn } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOW = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!cloudinaryOn())
    return NextResponse.json({ error: "Penyimpanan gambar belum dikonfigurasi." }, { status: 503 });

  let form;
  try { form = await req.formData(); } catch { form = null; }
  const file = form && form.get("file");
  if (!file || typeof file.arrayBuffer !== "function")
    return NextResponse.json({ error: "Pilih file gambar dulu." }, { status: 400 });

  const mime = String(file.type || "").toLowerCase();
  if (!ALLOW.includes(mime))
    return NextResponse.json({ error: "Format harus JPG, PNG, WebP, atau AVIF." }, { status: 400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "Ukuran gambar maksimal 6 MB." }, { status: 400 });

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadImage(buf, {
      mime,
      folder: "pautin/avatars",
      eager: "c_fill,w_512,h_512,q_auto:good,f_webp", // versi kecil WebP tajam
    });
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Upload gagal." }, { status: 500 });
  }
}
