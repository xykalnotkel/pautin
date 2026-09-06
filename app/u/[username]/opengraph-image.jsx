import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { db, esc, initials } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function UserOgImage({ params }) {
  const { username } = await params;
  let found = false;
  let name = String(username), bio = "";
  try {
    const r = await db.execute({ sql: "SELECT name, bio FROM users WHERE username=?", args: [String(username)] });
    if (r.rows[0]) {
      found = true;
      name = r.rows[0].name || username;
      bio = String(r.rows[0].bio || "").slice(0, 110);
    }
  } catch (e) {
    console.error("og db err", e);
  }
  if (!found) notFound();
  const ini = initials(name);
  const cleanBio = bio.length ? bio : "Halaman ini di Pautin.";

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", background: "#0B241D", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -200, top: -160, width: 640, height: 640, borderRadius: 999, background: "rgba(228,87,46,.28)" }} />
        <div style={{ position: "absolute", left: -240, bottom: -200, width: 660, height: 660, borderRadius: 999, background: "rgba(15,91,77,.6)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 44 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 160, height: 160, borderRadius: 999, background: "#E4572E", color: "#F7F0E3", fontSize: 60, fontWeight: 800 }}>
              {ini}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", color: "#F7F0E3", fontSize: 60, fontWeight: 800, letterSpacing: -2 }}>{name}</div>
              <div style={{ display: "flex", color: "rgba(247,240,227,.55)", fontSize: 30, fontWeight: 700 }}>@{username}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12, marginTop: 34 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.08)" }}>
              <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.8c.6 0 1.2.6 1.2 1.2S12.6 6.2 12 6.2s-1.2-.6-1.2-1.2.6-1.2 1.2-1.2zm0 3c1 0 1.8 1.5 2.2 2.8l1.4.4-.4-1.3c-.5-1.5-1.5-2.9-3.2-2.9v1zm-2.5 9.4c0 .5.4.9.9.9.6 0 1-.4 1-.9s-.4-.9-.9-.9c-.5 0-.9.4-.9.9zm0-4.3c0 1.5-.8 2.8-2 3.4.6.4 1.3.6 2 .6 2.2 0 4-1.8 4-4v-.6H9.5v1.6z" fill="#F7F0E3"/></svg>
            </div>
            <div style={{ display: "flex", color: "rgba(247,240,227,.66)", fontSize: 24, fontFamily: "monospace" }}>pautin/u/{username}</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 64, top: 48, display: "flex", color: "rgba(247,240,227,.6)", fontSize: 21, fontWeight: 800 }}>Pautin</div>
        <div style={{ position: "absolute", left: 90, bottom: 52, display: "flex", color: "rgba(247,240,227,.85)", fontSize: 24, fontWeight: 600, maxWidth: 900 }}>{cleanBio}</div>
      </div>
    ),
    { ...size }
  );
}
