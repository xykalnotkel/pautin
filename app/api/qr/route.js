import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

// Mark Pautin (dipakai ulang dari brand, skala via transform)
const MARK = `<rect width="64" height="64" rx="15" fill="#0F5B4D"/>
<g fill="none" stroke="#F7F0E3" stroke-width="6.5" stroke-linecap="round">
  <rect x="16" y="16" width="22" height="22" rx="8" transform="rotate(45 27 27)"/>
  <rect x="28" y="28" width="22" height="22" rx="8" transform="rotate(-45 39 39)"/>
</g>
<circle cx="46" cy="18" r="5.5" fill="#E4572E"/>`;

export async function GET(req) {
  const t = new URL(req.url).searchParams.get("t") || "";
  if (!/^https?:\/\/[^\s]{4,400}$/i.test(t))
    return new NextResponse("parameter t tidak valid", { status: 400 });

  let svg;
  try {
    svg = await QRCode.toString(t, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 520,
      color: { dark: "#0F5B4D", light: "#ffffff" },
    });
  } catch {
    return new NextResponse("gagal membuat QR", { status: 400 });
  }

  // sisipkan logo Pautin di tengah (lubang aman utk ECC H)
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (m) {
    const n = Number(m[1]);
    const box = Math.max(6, Math.round(n * 0.24));
    const x = Math.round((n - box) / 2);
    const k = (box * 0.8) / 64;
    const logo = `<g transform="translate(${x} ${x})">
      <rect width="${box}" height="${box}" rx="${Math.max(2, Math.round(box * 0.26))}" fill="#ffffff"/>
      <g transform="translate(${box / 2} ${box / 2}) scale(${k.toFixed(4)}) translate(-32 -32)">${MARK}</g>
    </g>`;
    svg = svg.replace("</svg>", logo + "</svg>");
  }

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
