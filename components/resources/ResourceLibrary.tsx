import Link from "next/link";

/* Resource library. Every item here points at something that actually opens —
   two of our own tools, one real download, and two authoritative external
   archives. It deliberately does NOT pretend to be a large media library:
   fewer cards that all work beat a wall of dead links. */

interface Resource {
  typeLabel: string;
  title: string;
  body: string;
  meta: string;
  action: string;
  href: string;
  external?: boolean;
  download?: boolean;
}

const RESOURCES: Resource[] = [
  {
    typeLabel: "Study tool",
    title: "The Verse Explorer",
    body: "Move through the Gītā verse by verse — the original Sanskrit, transliteration, word-for-word meanings and translation, side by side.",
    meta: "On this site · All levels",
    action: "Open the Explorer",
    href: "/explorer",
  },
  {
    typeLabel: "Guided plan",
    title: "The Reading Plan",
    body: "A six-stage path through the book's core teachings over eighteen weeks — shaped for students, working professionals, and everyday life.",
    meta: "On this site · Beginner-friendly",
    action: "Start the plan",
    href: "/course",
  },
  {
    typeLabel: "Download · PDF",
    title: "Reading Plan & Companion (PDF)",
    body: "The whole plan as a print-ready booklet: every concept, the verses it rests on, how each meets ordinary life, and a reflection for each stage.",
    meta: "Free · Print-ready A4",
    action: "Download the PDF",
    href: "/downloads/gita-reading-plan.pdf",
    download: true,
  },
  {
    typeLabel: "Read · official archive",
    title: "The complete text online",
    body: "Every chapter, verse and purport of Bhagavad-gītā As It Is at the Bhaktivedanta VedaBase — the BBT's own online library — for study and reference.",
    meta: "vedabase.io · Free",
    action: "Open the VedaBase",
    href: "https://vedabase.io/en/library/bg/",
    external: true,
  },
  {
    typeLabel: "Listen · official archive",
    title: "Śrīla Prabhupāda's lectures",
    body: "Recorded classes on the Gītā from 1966 onward — the very teachings that launched a worldwide movement — in the official transcript and audio archive.",
    meta: "vedabase.io · Free",
    action: "Browse the lectures",
    href: "https://vedabase.io/en/library/transcripts/",
    external: true,
  },
];

export default function ResourceLibrary() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Resources</li>
            </ol>
          </nav>
          <p className="eyebrow">Go Deeper</p>
          <h1>The Resource Library</h1>
          <p className="lede">A handful of things that actually help you read the book — two tools on this
            site, a companion you can print, and the authoritative archives where the whole text and
            Śrīla Prabhupāda&apos;s own lectures live.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--space-7)" }}>
        <div className="container">
          <div className="grid-3">
            {RESOURCES.map((r, i) => (
              <article key={r.title} className="card resource-card reveal" data-delay={i % 3 || undefined}>
                <span className="resource-card__type">{r.typeLabel}</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <span className="resource-card__meta">{r.meta}</span>
                {r.external ? (
                  <a className="link-arrow" href={r.href} target="_blank" rel="noopener noreferrer">
                    {r.action} <span aria-hidden="true">↗</span>
                  </a>
                ) : r.download ? (
                  <a className="link-arrow" href={r.href} download>
                    {r.action} <span aria-hidden="true">↓</span>
                  </a>
                ) : (
                  <Link className="link-arrow" href={r.href}>
                    {r.action} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="cta-band mt-7 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>After the Gītā</p>
            <h2 style={{ fontSize: "var(--text-xl)" }}>Recommended next steps</h2>
            <p className="lede">Finished your first reading? Continue with the reading plan, or find a temple or
              study group near you — the Gītā opens a door; a whole world lies beyond it.</p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--gold" href="/course">Follow the Reading Plan</Link>
              <a
                className="btn btn--ghost-dark"
                href="https://centres.iskcon.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find a Temple Near You ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
