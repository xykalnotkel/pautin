export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pautin.xyc.my.id";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
