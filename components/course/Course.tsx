import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import { SESSION, AGENDA, AUDIENCE, FORMAT, SESSIONS, MAHAVANI } from "@/lib/courseData";

const lines = (s: string) =>
  s.split("\n").map((l, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {l}
    </span>
  ));

/* The free session, and the sign-up.

   Built around ONE dated evening rather than an eight-week commitment. That is a
   small ask for a visitor who has never heard you teach, it carries a firm date
   where a batch could not, and it repeats every month. The fuller course sits
   lower on the page as a roadmap — what this leads to — and is introduced in the
   closing minutes of the session itself, to a room that already chose to be
   there.

   Sign-up appears twice: in the hero where intent is highest, and at the close
   after the case is made. Nowhere in between, so the middle of the page can just
   be honest about what the hour contains. */

export default function Course() {
  return (
    <main id="main">
      {/* ============ HERO — the session, the date, the form ============ */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Free Session</li>
            </ol>
          </nav>
          <div className="course-hero">
            <div>
              <p className="eyebrow">Free · Live · Everyone welcome</p>
              <h1>{SESSION.title}</h1>
              <p className="lede">
                One hour on what this five-thousand-year-old book says about the life you are
                actually living — pressure, anger, difficult decisions, and who you are underneath
                the roles. No cost, no preparation, and nothing to read beforehand.
              </p>

              {/* The date, given its own weight — it is the single most useful
                  thing on this page. */}
              <div className="session-when">
                <p className="session-when__date">
                  <time dateTime={SESSION.startsAt}>{SESSION.dayLabel}</time>
                </p>
                <p className="session-when__time">{SESSION.timeLabel} · {SESSION.duration}</p>
                <p className="session-when__note">
                  Online, on Google Meet. The joining link is emailed to you straight away.
                </p>
              </div>

              <ul className="course-hero__points">
                <li>Open to everyone — no Sanskrit, no scripture, no background assumed</li>
                <li>You don&rsquo;t need to own the book to come</li>
                <li>Runs every month, so a clash is not the end of it</li>
              </ul>
            </div>

            <div className="card card--night course-signup">
              <p className="eyebrow" style={{ color: "var(--gold-bright)" }}>Save your seat</p>
              <h2 style={{ fontSize: "var(--text-lg)", color: "var(--moon)", margin: "0 0 var(--space-2)" }}>
                {SESSION.dayLabel}, {SESSION.timeLabel}
              </h2>
              <p style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>
                Leave your name and email and we&rsquo;ll send you the joining link. That is the
                whole sign-up.
              </p>
              <SignupForm
                kind="course"
                idPrefix="course-hero"
                placeholder="you@example.com"
                cta="Save my seat"
                withName
                dark
              />
              <p style={{ color: "var(--moon-faint)", fontSize: "var(--text-xs)", margin: "var(--space-4) 0 0" }}>
                Can&rsquo;t make this date? Sign up anyway — we&rsquo;ll tell you about the next one.
                Unsubscribe in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY IT'S FREE — Mahāprabhu's instruction ============
          Placed immediately after the hero because it answers the question a
          free offer always raises. Quiet, dark surface: it is a moment to pause
          on, not another sales panel. */}
      <section className="section section--night-deep" id="why">
        <div className="container">
          <div className="mahavani reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>Why it costs nothing</p>
            <blockquote className="mahavani__quote">
              <p className="mahavani__script" lang="bn">{lines(MAHAVANI.bengali)}</p>
              <p className="mahavani__iast">{lines(MAHAVANI.iast)}</p>
              <p className="mahavani__rendering">{MAHAVANI.rendering}</p>
              <cite className="mahavani__cite">{MAHAVANI.attribution}</cite>
            </blockquote>
            <p className="mahavani__note">
              <em>Para-upakāra</em> — working for the good of others. That instruction is the whole
              reason this session exists, and the reason there is nothing to pay. Giving the book
              away is how we understand that line.
            </p>
            <p className="mahavani__note">
              And to be clear about the welcome: the duty in the verse belongs to whoever is
              teaching, not to you. Wherever you were born, whatever you believe, you are welcome
              in the room.
            </p>
          </div>
        </div>
      </section>

      {/* ============ THE HOUR ============ */}
      <section className="section section--tight" id="agenda">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>What the hour holds</p>
            <h2 className="display-md">Sixty minutes, spent well</h2>
            <p className="lede">Not a lecture at you. A short walk through the book&rsquo;s opening
              situation, three ideas you can use immediately, and real time for questions.</p>
          </div>
          <ol className="agenda">
            {AGENDA.map((a) => (
              <li className="agenda__item reveal" key={a.title}>
                <span className="agenda__time">{a.minutes}</span>
                <div>
                  <h3 className="agenda__title">{a.title}</h3>
                  <p className="agenda__body">{a.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ WHO IT'S FOR ============ */}
      <section className="section section--cream">
        <div className="container">
          <div className="center mb-6 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>Who it&rsquo;s for</p>
            <h2 className="display-md">Come as you are</h2>
            <p className="lede">The Gītā was spoken to someone who had to act, under pressure, that
              day. This session keeps it there.</p>
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

      {/* ============ HOW IT WORKS ============ */}
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
        </div>
      </section>

      {/* ============ WHERE IT GOES — the fuller course ============ */}
      <section className="section section--cream" id="series">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>If you want to keep going</p>
            <h2 className="display-md">The fuller course</h2>
            <p className="lede">
              For anyone who wants more than an hour, we run a longer course through the book&rsquo;s
              core teachings — eight sessions, each opening with a question people actually arrive
              with. It is introduced at the end of the free session, and it is free too. Nothing to
              decide now.
            </p>
          </div>
          <div className="sessions">
            {SESSIONS.map((s) => (
              <article className="session reveal" key={s.n}>
                <div className="session__num" aria-hidden="true">{String(s.n).padStart(2, "0")}</div>
                <div className="session__body">
                  <h3 className="session__title">{s.title}</h3>
                  <p className="session__question">&ldquo;{s.question}&rdquo;</p>
                  <p className="session__text">{s.body}</p>
                  <p className="session__takeaway"><strong>You leave with:</strong> {s.takeaway}</p>
                  <p className="session__verses">{s.verses}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="card card--night mt-7 reveal" style={{ textAlign: "center" }}>
            <p className="eyebrow" style={{ justifyContent: "center", color: "var(--gold-bright)" }}>For the longer course</p>
            <h3 style={{ fontSize: "var(--text-lg)", color: "var(--moon)", margin: "0 0 var(--space-3)" }}>
              You&rsquo;ll want your own copy
            </h3>
            <p style={{ color: "var(--moon-soft)", maxWidth: "52ch", marginInline: "auto", marginBottom: "var(--space-5)" }}>
              The free session needs nothing. The eight-session course reads from{" "}
              <em>Bhagavad-gītā As It Is</em> throughout — the complete edition with the original
              Sanskrit and Śrīla Prabhupāda&rsquo;s purports. Any copy works; if you don&rsquo;t have
              one, we ship across India.
            </p>
            <Link className="btn btn--gold" href="/book#editions">See the editions</Link>
          </div>
        </div>
      </section>

      {/* ============ CLOSING SIGN-UP ============ */}
      <section className="cta-band" id="signup">
        <div className="container cta-band__inner">
          <p className="eyebrow" style={{ justifyContent: "center" }}>{SESSION.dayLabel} · {SESSION.timeLabel}</p>
          <h2 className="display-md">Come and sit in</h2>
          <p className="lede">
            One hour, online, free. Leave your email and the joining link arrives straight away.
          </p>
          <SignupForm
            kind="course"
            idPrefix="course-foot"
            placeholder="you@example.com"
            cta="Save my seat"
            withName
          />
        </div>
      </section>
    </main>
  );
}
