"use client";

/* The Reading Plan — a structured path through the book, not a taught course.
   Each stage names what to read, the concepts that matter, and where they bite
   in ordinary life. Completion state lives in the StudyProvider: device-local
   when anonymous, account-synced when signed in. */

import { useState } from "react";
import Link from "next/link";
import { READING_PLAN } from "@/lib/data";
import { useToast } from "@/components/Toast";
import { useStudy } from "@/lib/study/StudyProvider";

const allReadings = READING_PLAN.flatMap((s) => s.readings);

export default function Course() {
  const toast = useToast();
  const study = useStudy();
  const state = study.course;
  const [openStage, setOpenStage] = useState(0);

  const doneCount = allReadings.filter((r) => state.done[r.id]).length;
  const total = allReadings.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const nextReading = allReadings.find((r) => !state.done[r.id]);

  const start = () => {
    if (!state.enrolled) {
      study.enroll();
      toast("Plan started — Stage 1 is open below.");
    } else {
      toast("You're already on the path — pick up where you left off.");
    }
    document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleReading = (id: string) => {
    const wasDone = !!state.done[id];
    if (!state.enrolled) toast("Plan started — reading marked complete.");
    study.toggleLesson(id);
    if (!wasDone && doneCount + 1 === total) toast("🎉 You've read the whole Gītā. Every chapter.");
  };

  const gotoReading = (id: string) => {
    const si = READING_PLAN.findIndex((s) => s.readings.some((r) => r.id === id));
    if (si >= 0) setOpenStage(si);
    requestAnimationFrame(() => {
      document.querySelector(`[data-lesson="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <main id="main">
      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><a href="/">Home</a></li>
              <li aria-current="page">Reading Plan</li>
            </ol>
          </nav>
          <div className="grid-2" style={{ alignItems: "center", gap: "var(--space-8)" }}>
            <div>
              <p className="eyebrow">Free Reading Plan</p>
              <h1>A Path Through the Gītā</h1>
              <p className="lede mb-5">
                Eighteen chapters is a lot to face alone. This plan breaks the book into six
                stages over eighteen weeks — what to read, the ideas worth slowing down for,
                and where each one actually lands in work, study and daily life.
                Self-paced, free, and yours to keep.
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
                <button className="btn btn--gold btn--lg" type="button" onClick={start}>Start the Plan</button>
                <a className="btn btn--ghost-dark btn--lg" href="#plan">See the Six Stages</a>
              </div>
              <div className="hero__proof" style={{ borderTopColor: "var(--line-dark)" }}>
                <div className="proof-item"><strong>6</strong><span>Stages</span></div>
                <div className="proof-item"><strong>18</strong><span>Weeks (or your pace)</span></div>
                <div className="proof-item"><strong>18</strong><span>Chapters covered</span></div>
                <div className="proof-item"><strong>23</strong><span>Key concepts</span></div>
              </div>
            </div>
            <div className="card card--night" style={{ padding: "var(--space-6)" }}>
              <p className="eyebrow" style={{ color: "var(--gold-bright)" }}>Your Progress</p>
              <div className="flex-between mb-4">
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)" }}>{pct}%</strong>
                <span className="badge badge--night">
                  {!state.enrolled ? "Not started" : pct === 100 ? "Finished 🎉" : `${doneCount} of ${total} readings`}
                </span>
              </div>
              <div className="progress-bar progress-bar--dark" role="progressbar" aria-label="Reading plan progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-4" style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)" }}>
                {pct === 100
                  ? "All eighteen chapters read. The Gītā is a book one returns to — this was the first pass, not the last."
                  : state.enrolled
                    ? "Your place is saved. Sign in on the My Study page to keep it across devices."
                    : "Tick off readings as you finish them. Saved on this device — sign in to sync it to your account."}
              </p>
              <div className="mt-4">
                {state.enrolled && pct < 100 && nextReading && (
                  <button className="btn btn--gold btn--block" type="button" onClick={() => gotoReading(nextReading.id)}>
                    Continue: {nextReading.title}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section section--cream">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow">How to use it</p>
            <h2 className="display-md">Read · Sit with it · Apply</h2>
          </div>
          <div className="grid-3">
            <article className="card reveal">
              <div className="card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 4v16M12 4c-2-.9-4.5-1.4-8-1.4v16c3.5 0 6 .5 8 1.4 2-.9 4.5-1.4 8-1.4v-16c-3.5 0-6 .5-8 1.4Z" /></svg></div>
              <h3>1 · Read</h3>
              <p>Each stage names the chapters and verses to read in the book itself. The plan orients you — the teaching is Prabhupāda&rsquo;s, in his own words, on the page.</p>
            </article>
            <article className="card reveal" data-delay="1">
              <div className="card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M5 4h14v13l-4 4H5V4Z" /><path d="M15 21v-4h4M9 9h6M9 12.5h4" /></svg></div>
              <h3>2 · Sit with it</h3>
              <p>Every stage ends with one question to write on — not a test with right answers, but the kind of question this book actually asks of a reader.</p>
            </article>
            <article className="card reveal" data-delay="2">
              <div className="card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 8.7l5.9-.8L12 2.5Z" /></svg></div>
              <h3>3 · Apply</h3>
              <p>Each concept is paired with where it bites in real life — exam pressure, career comparison, burnout, the argument you regret. Philosophy you can use by Tuesday.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ THE PLAN ============ */}
      <section className="section" id="plan">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="center mb-6 reveal">
            <p className="eyebrow">The Plan</p>
            <h2 className="display-md">Six stages, eighteen chapters</h2>
            <p className="lede">Open a stage to see what to read and why it matters. Tick readings off as you go.</p>
          </div>
          <div className="stack-4">
            {READING_PLAN.map((s, si) => {
              const stageDone = s.readings.filter((r) => state.done[r.id]).length;
              const stagePct = Math.round((stageDone / s.readings.length) * 100);
              return (
                <details
                  key={s.id}
                  className="module reveal is-visible"
                  open={si === openStage}
                  onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) setOpenStage(si); }}
                >
                  <summary>
                    <span className="module__num" aria-hidden="true">{si + 1}</span>
                    <span className="module__meta"><strong>{s.title}</strong><span>{s.time} · {s.read}</span></span>
                    <span className="module__progress">{stageDone}/{s.readings.length} read
                      <span className="progress-bar"><i style={{ width: `${stagePct}%` }} /></span>
                    </span>
                  </summary>

                  <div className="stage-body">
                    <p className="stage-audience"><strong>Especially helps:</strong> {s.audience}</p>

                    <h4 className="stage-heading">Key concepts</h4>
                    <div className="stack-3">
                      {s.concepts.map((c) => (
                        <div className="concept" key={c.term}>
                          <p className="concept__term">
                            {c.term} <Link className="concept__verse" href={`/explorer?v=${encodeURIComponent(c.verse.split(/[,–]/)[0].trim())}`}>{c.verse}</Link>
                          </p>
                          <p className="concept__meaning">{c.meaning}</p>
                          <p className="concept__practice"><strong>In practice:</strong> {c.inPractice}</p>
                        </div>
                      ))}
                    </div>

                    <h4 className="stage-heading">Readings</h4>
                    <ul className="lesson-list">
                      {s.readings.map((r) => (
                        <li key={r.id}>
                          <button
                            className={"lesson" + (state.done[r.id] ? " is-done" : "")}
                            type="button"
                            data-lesson={r.id}
                            aria-pressed={!!state.done[r.id]}
                            onClick={() => toggleReading(r.id)}
                          >
                            <span className="lesson__check" aria-hidden="true">✓</span>
                            <span><strong>{r.title}</strong></span>
                            <span>{r.time}</span>
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="stage-reflection">
                      <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Sit with this</p>
                      <p>{s.reflection}</p>
                      <Link className="link-arrow" href="/explorer">
                        Write it in your journal <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FINISH ============ */}
      <section className="section section--cream" id="finish">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="center reveal">
            <p className="eyebrow">At the end</p>
            <h2 className="display-md">
              {pct === 100 ? "You've read all eighteen chapters." : "Eighteen chapters, one stage at a time."}
            </h2>
            <p className="lede">
              {pct === 100
                ? "There's no certificate here, and that's deliberate — nobody grades a reading of the Gītā. What you have is the whole book behind you and your own reflections beside it. Most readers find the second pass is where it opens up."
                : "There's no exam and no certificate at the end of this plan — just the book, read properly, and a set of reflections in your own words. That's the only credential the Gītā has ever offered."}
            </p>
            <div className="mt-6" style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn--gold btn--lg" type="button" onClick={start}>
                {state.enrolled ? "Continue the Plan" : "Start the Plan — Free"}
              </button>
              <Link className="btn btn--ghost-light btn--lg" href="/book#editions">Get the Book</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
