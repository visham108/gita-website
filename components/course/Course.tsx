import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import { SESSIONS, AUDIENCE, FORMAT } from "@/lib/courseData";

/* The free live course — a preview, and the sign-up.

   This replaced a self-study reading tracker. The product here is the live
   course, so the page has one job: make someone want to be in the room, and
   let them register without hunting for a form. Sign-up appears twice — in the
   hero, where intent is highest, and at the end, after the case is made — and
   nowhere in between, so the middle of the page can just be honest about what
   the course covers. */

export default function Course() {
  return (
    <main id="main">
      {/* ============ HERO — the offer and the form together ============ */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Free Course</li>
            </ol>
          </nav>
          <div className="course-hero">
            <div>
              <p className="eyebrow">Free · Live · Instructor-led</p>
              <h1>The Bhagavad-gītā,<br />for the life you actually have</h1>
              <p className="lede">
                Eight live sessions on what this book says about pressure, anger, duty, comparison
                and loss — taught in real time, with room to ask questions. No cost, no prior study
                assumed.
              </p>
              <ul className="course-hero__points">
                <li>Taught live, so you can ask what you actually want to ask</li>
                <li>Grounded in the verses, applied to work and family life</li>
                <li>Open to complete beginners</li>
              </ul>
            </div>
            <div className="card card--night course-signup">
              <p className="eyebrow" style={{ color: "var(--gold-bright)" }}>Register your interest</p>
              <h2 style={{ fontSize: "var(--text-lg)", color: "var(--moon)", margin: "0 0 var(--space-2)" }}>
                Save your place
              </h2>
              <p style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>
                Dates for the next batch aren&rsquo;t fixed yet. Leave your email and you&rsquo;ll be the
                first to know when they are.
              </p>
              <SignupForm
                kind="course"
                idPrefix="course-hero"
                placeholder="you@example.com"
                cta="Save my place"
                withName
                dark
              />
              <p style={{ color: "var(--moon-faint)", fontSize: "var(--text-xs)", margin: "var(--space-4) 0 0" }}>
                One email when the schedule is set. Unsubscribe in one click, any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHO IT'S FOR ============ */}
      <section className="section section--tight">
        <div className="container">
          <div className="center mb-6 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>Who it&rsquo;s for</p>
            <h2 className="display-md">Written for people with jobs</h2>
            <p className="lede">The Gītā was spoken to someone who had to act, under pressure, that day.
              This course keeps it there.</p>
          </div>
          <div className="grid-3">
            {AUDIENCE.map((a, i) => (
              <article className="card reveal" data-delay={i % 3 || undefined} key={a.title}>
                <h3 style={{ fontSize: "var(--text-md)" }}>{a.title}</h3>
                <p>{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CURRICULUM ============ */}
      <section className="section section--cream" id="sessions">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>What we cover</p>
            <h2 className="display-md">Eight sessions</h2>
            <p className="lede">Each one starts with a question people actually arrive with, and answers it
              from the text.</p>
          </div>
          <div className="sessions">
            {SESSIONS.map((s) => (
              <article className="session reveal" key={s.n}>
                <div className="session__num" aria-hidden="true">{String(s.n).padStart(2, "0")}</div>
                <div className="session__body">
                  <h3 className="session__title">{s.title}</h3>
                  <p className="session__question">&ldquo;{s.question}&rdquo;</p>
                  <p className="session__text">{s.body}</p>
                  <p className="session__takeaway">
                    <strong>You leave with:</strong> {s.takeaway}
                  </p>
                  <p className="session__verses">{s.verses}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FORMAT ============ */}
      <section className="section">
        <div className="container">
          <div className="center mb-6 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>How it works</p>
            <h2 className="display-md">Straightforward, and free</h2>
          </div>
          <div className="grid-4">
            {FORMAT.map((f, i) => (
              <article className="card reveal" data-delay={i % 3 || undefined} key={f.label}>
                <h3 style={{ fontSize: "var(--text-md)" }}>{f.label}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
          <div className="card card--night mt-7 reveal" style={{ textAlign: "center" }}>
            <p className="eyebrow" style={{ justifyContent: "center", color: "var(--gold-bright)" }}>What you&rsquo;ll need</p>
            <h3 style={{ fontSize: "var(--text-lg)", color: "var(--moon)", margin: "0 0 var(--space-3)" }}>
              A copy of the book
            </h3>
            <p style={{ color: "var(--moon-soft)", maxWidth: "52ch", marginInline: "auto", marginBottom: "var(--space-5)" }}>
              We read from <em>Bhagavad-gītā As It Is</em> throughout — the complete edition with the
              original Sanskrit and Śrīla Prabhupāda&rsquo;s purports. Any copy works; if you don&rsquo;t
              have one, we ship across India.
            </p>
            <Link className="btn btn--gold" href="/book#editions">Get the book</Link>
          </div>
        </div>
      </section>

      {/* ============ CLOSING SIGN-UP ============ */}
      <section className="cta-band" id="signup">
        <div className="container">
          <p className="eyebrow" style={{ justifyContent: "center" }}>Next batch</p>
          <h2 className="display-md">Come and sit in</h2>
          <p className="lede">
            The dates aren&rsquo;t set yet. Leave your email and we&rsquo;ll write to you once — when the
            schedule is confirmed.
          </p>
          <SignupForm
            kind="course"
            idPrefix="course-foot"
            placeholder="you@example.com"
            cta="Save my place"
            withName
          />
        </div>
      </section>
    </main>
  );
}
