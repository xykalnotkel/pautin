export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pautin.xyc.my.id";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/app", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
