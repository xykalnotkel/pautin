import { notFound } from "next/navigation";
import { db, esc } from "@/lib/db";
import { renderPublic } from "@/lib/theme";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getUser(username) {
  const r = await db.execute({ sql: "SELECT * FROM users WHERE username=?", args: [username] });
  return r.rows[0] || null;
}
async function getUserLinks(uid) {
  const r = await db.execute({ sql: "SELECT * FROM links WHERE user_id=? ORDER BY pos, id", args: [uid] });
  return r.rows;
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const u = await getUser(username);
  if (!u)
    return {
      title: "Halaman tidak ditemukan",
      robots: { index: false },
    };
  return {
    title: u.name,
    description: (u.bio || `Halaman ${u.username} di Pautin.`).slice(0, 160),
    openGraph: {
      title: `${u.name} — Pautin`,
      description: (u.bio || "").slice(0, 160) || undefined,
      type: "profile",
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicPage({ params, searchParams }) {
  const { username } = await params;
  const sp = await searchParams;
  const u = await getUser(username);
  if (!u) notFound();

  const isPreview = !!sp.pv;
  const links = await getUserLinks(Number(u.id));

  if (!isPreview) {
    try {
      await db.execute({ sql: "UPDATE users SET views=views+1 WHERE id=?", args: [Number(u.id)] });
    } catch {}
  }

  const { body, css } = renderPublic(
    { ...u, views: Number(u.views), created_at: Number(u.created_at) },
    links,
    { preview: isPreview }
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
