// Cloudinary: upload bertanda (signed) + URL responsif WebP/q_auto yang tetap tajam.
import crypto from "node:crypto";

export const cloudinaryConf = () => ({
  cloud: process.env.CLOUDINARY_CLOUD_NAME || "",
  key: process.env.CLOUDINARY_API_KEY || "",
  secret: process.env.CLOUDINARY_API_SECRET || "",
});
export const cloudinaryOn = () => {
  const c = cloudinaryConf();
  return !!(c.cloud && c.key && c.secret);
};

export function isCloudinaryUrl(url) {
  return typeof url === "string" && url.includes("/image/upload/") && url.includes("cloudinary.com");
}

/** URL tampilan: WebP + q_auto + ukuran sesuai konteks, tapi tetap tajam. */
export function optimized(url, { w = 480, c_fill = false } = {}) {
  if (!isCloudinaryUrl(url)) return url;
  const mode = c_fill ? `c_fill,w_${w},h_${w}` : `w_${w}`;
  return url.replace("/image/upload/", `/image/upload/${mode},q_auto:good,f_webp/`);
}

/** Upload gambar (buffer) dengan tanda tangan server-side. Folder default: pautin */
export async function uploadImage(buffer, opts = {}) {
  const c = cloudinaryConf();
  if (!cloudinaryOn()) throw new Error("Cloudinary belum dikonfigurasi");
  const folder = opts.folder || "pautin/avatars";
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = opts.publicId || `${Date.now().toString(36)}${crypto.randomBytes(4).toString("hex")}`;

  // transformasi saat upload (versi WebP kecil siap dipakai + versi asli dipertahankan)
  const eager = opts.eager || "c_fill,w_512,h_512,q_auto:good,f_webp";
  const params = { timestamp, folder, public_id: publicId, eager };
  const sigStr =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + c.secret;
  const signature = crypto.createHash("sha1").update(sigStr).digest("hex");

  const fd = new FormData();
  fd.append("file", new Blob([buffer], { type: opts.mime || "image/webp" }), publicId);
  for (const [k, v] of Object.entries({ api_key: c.key, timestamp, folder, public_id: publicId, eager })) fd.append(k, String(v));
  fd.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/image/upload`, { method: "POST", body: fd });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || j.error) throw new Error((j.error && j.error.message) || "Upload Cloudinary gagal");
  return { url: j.secure_url, publicId };
}
