import type { Metadata } from "next";
import Link from "next/link";
import Explorer from "@/components/explorer/Explorer";
import { GITA_VERSES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Verse Explorer — All 18 Chapters",
  description:
    "Explore the Bhagavad-gītā chapter by chapter and verse by verse — original Sanskrit, transliteration and translation, with bookmarks, highlights and personal notes.",
};

export default function ExplorerPage() {
  const verseCount = Object.keys(GITA_VERSES).length;

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
              <p className="lede">Eighteen chapters. Seven hundred verses. One conversation that answers
                everything. Bookmark, highlight and annotate as you go — your study is saved on this device.</p>
            </div>
            <div className="card card--night" style={{ minWidth: 260 }}>
              <p className="muted mb-0" style={{ fontSize: "var(--text-xs)", letterSpacing: ".14em", textTransform: "uppercase" }}>Featured selection</p>
              <p style={{ margin: ".4rem 0 0", color: "var(--moon-soft)", fontSize: "var(--text-sm)" }}>
                This explorer presents <strong style={{ color: "var(--gold-bright)" }}>{verseCount}</strong> key verses
                in full. The complete 700-verse text lives in{" "}
                <Link href="/book#editions" style={{ color: "var(--gold-bright)" }}>the book</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ background: "var(--ivory)" }}>
        <div className="container container--wide">
          <Explorer />
        </div>
      </section>
    </main>
  );
}
