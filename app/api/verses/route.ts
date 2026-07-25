import { NextResponse } from "next/server";
import { getChapterVerses, searchVerses } from "@/lib/scripture";

/** Public read of the Sanskrit text.

    The Explorer loads one chapter at a time rather than shipping all 701
    verses to every visitor. Search runs here too, so the client never holds
    the whole corpus.

    Read-only and cached upstream; no rate limit is applied because this is
    scripture on a public page, and the underlying query is a cached SELECT. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  if (q) {
    const verses = await searchVerses(q.slice(0, 60));
    return NextResponse.json({ verses });
  }

  const chapter = Number(url.searchParams.get("chapter"));
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 18)
    return NextResponse.json({ error: "chapter must be 1–18" }, { status: 400 });

  const verses = await getChapterVerses(chapter);
  return NextResponse.json({ verses });
}
