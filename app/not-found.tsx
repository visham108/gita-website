import Link from "next/link";

export const metadata = { title: "Page Not Found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main">
      <section className="page-hero" style={{ minHeight: "70svh", display: "flex", alignItems: "center" }}>
        <div className="container center">
          <p className="eyebrow" style={{ justifyContent: "center" }}>Bhagavad-gītā 2.40</p>
          <h1 style={{ fontSize: "var(--text-3xl)" }}>This page has passed on —<br />but nothing is ever lost.</h1>
          <p className="lede" style={{ marginInline: "auto", marginBottom: "var(--space-6)" }}>
            <em className="iast">nehābhikrama-nāśo &rsquo;sti</em> — &ldquo;In this endeavor there is no loss or
            diminution.&rdquo; The page you sought isn&rsquo;t here, but every path on this site still leads
            somewhere worth going.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn--gold btn--lg" href="/">Return Home</Link>
            <Link className="btn btn--ghost-dark btn--lg" href="/course">See the Free Course</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
