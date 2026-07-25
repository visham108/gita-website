import type { Metadata } from "next";
import Link from "next/link";
import Explorer from "@/components/explorer/Explorer";
import { getChapterVerses, getVerseCounts } from "@/lib/scripture";

export const metadata: Metadata = {
  title: "Verse Explorer — All 18 Chapters, Every Verse",
  description:
    "The complete Bhagavad-gītā in the original Sanskrit with transliteration — every verse of all eighteen chapters, with bookmarks, highlights and personal notes.",
};

export default async function ExplorerPage() {
  // Chapter 1 is rendered on the server so the page is useful without JS and
  // has real text for search engines; the rest load on demand.
  const [initialVerses, verseCounts] = await Promise.all([
    getChapterVerses(1),
    getVerseCounts(),
  ]);

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Verse Explorer</li>
            </ol>
          </nav>
          <div className="flex-between">
            <div>
              <p className="eyebrow">Śrīmad Bhagavad-gītā</p>
              <h1>Verse Explorer</h1>
              <p className="lede">Eighteen chapters. Every verse, in the original Sanskrit with
                transliteration so you can read it aloud. Bookmark, highlight and annotate as you
                go — your study is saved.</p>
            </div>
            <div className="card card--night" style={{ minWidth: 260 }}>
              {/* Deliberately not asserting a verse total: the Gītā is known as
                  700 verses, but editions differ — BBT numbers chapter 1 to 46
                  where the standard recension has 47. "Every verse" is true
                  under either count. */}
              <p className="muted mb-0" style={{ fontSize: "var(--text-xs)", letterSpacing: ".14em", textTransform: "uppercase" }}>The complete text</p>
              <p style={{ margin: ".4rem 0 0", color: "var(--moon-soft)", fontSize: "var(--text-sm)" }}>
                <strong style={{ color: "var(--gold-bright)" }}>Every verse</strong> of all eighteen
                chapters, in Sanskrit. The <em>As It Is</em> translation and purports live in{" "}
                <Link href="/book#editions" style={{ color: "var(--gold-bright)" }}>the book</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ background: "var(--ivory)" }}>
        <div className="container container--wide">
          <Explorer
            initialChapter={1}
            initialVerses={initialVerses}
            verseCounts={verseCounts}
          />
        </div>
      </section>
    </main>
  );
}
