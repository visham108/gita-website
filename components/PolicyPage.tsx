import Link from "next/link";

/* Shared shell for legal/policy pages — quiet, readable, no ornament. */
export default function PolicyPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main">
      <section className="page-hero" style={{ paddingBottom: "var(--space-6)" }}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <h1 style={{ fontSize: "var(--text-2xl)" }}>{title}</h1>
          <p className="lede" style={{ marginBottom: 0 }}>Last updated: {updated}</p>
        </div>
      </section>
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="policy-body">{children}</div>
        </div>
      </section>
    </main>
  );
}
