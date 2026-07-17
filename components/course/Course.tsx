"use client";

/* Gītā Foundations course — enrollment, lesson completion, module progress,
   Module 1 quiz, certificate unlock. State lives in the StudyProvider:
   device-local when anonymous, account-synced when signed in. */

import { useState } from "react";
import { COURSE, QUIZ_M1 } from "@/lib/data";
import { useToast } from "@/components/Toast";
import { useStudy } from "@/lib/study/StudyProvider";

const allLessons = COURSE.flatMap((m) => m.lessons);

export default function Course() {
  const toast = useToast();
  const study = useStudy();
  const state = study.course;
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [openModule, setOpenModule] = useState(0);

  const doneCount = allLessons.filter((l) => state.done[l.id]).length;
  const total = allLessons.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const nextLesson = allLessons.find((l) => !state.done[l.id]);

  const enroll = () => {
    if (!state.enrolled) {
      study.enroll();
      toast("Welcome to Gītā Foundations! Module 1 awaits below.");
    } else {
      toast("You are already enrolled — continue where you left off.");
    }
    document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleLesson = (id: string) => {
    const wasDone = !!state.done[id];
    if (!state.enrolled) toast("Enrolled! Lesson marked complete.");
    study.toggleLesson(id);
    if (!wasDone && doneCount + 1 === total) toast("🎉 Course complete! Your certificate is unlocked.");
  };

  const gotoLesson = (id: string) => {
    const mi = COURSE.findIndex((m) => m.lessons.some((l) => l.id === id));
    if (mi >= 0) setOpenModule(mi);
    requestAnimationFrame(() => {
      document.querySelector(`[data-lesson="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const pickAnswer = (qi: number, oi: number) => {
    if (quizAnswers[qi] !== undefined) return;
    const nextAnswers = { ...quizAnswers, [qi]: oi };
    setQuizAnswers(nextAnswers);
    if (Object.keys(nextAnswers).length === QUIZ_M1.length) {
      const score = QUIZ_M1.reduce((s, q, i) => s + (nextAnswers[i] === q.answer ? 1 : 0), 0);
      study.setQuizScore(score);
    }
  };

  const answered = Object.keys(quizAnswers).length;
  const score = QUIZ_M1.reduce((s, q, i) => s + (quizAnswers[i] === q.answer ? 1 : 0), 0);

  return (
    <main id="main">
      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><a href="/">Home</a></li>
              <li aria-current="page">Course</li>
            </ol>
          </nav>
          <div className="grid-2" style={{ alignItems: "center", gap: "var(--space-8)" }}>
            <div>
              <p className="eyebrow">Free Guided Study</p>
              <h1>Gītā Foundations</h1>
              <p className="lede mb-5">
                An 18-week journey through every chapter of Bhagavad-gītā As It Is —
                27 guided lessons, weekly reflections, gentle quizzes, and a certificate when you
                complete the path. Self-paced. Free forever. Transformative by design.
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
                <button className="btn btn--gold btn--lg" type="button" onClick={enroll}>Enroll Free</button>
                <a className="btn btn--ghost-dark btn--lg" href="#curriculum">View Curriculum</a>
              </div>
              <div className="hero__proof" style={{ borderTopColor: "var(--line-dark)" }}>
                <div className="proof-item"><strong>27</strong><span>Lessons</span></div>
                <div className="proof-item"><strong>18</strong><span>Weeks (or your pace)</span></div>
                <div className="proof-item"><strong>6</strong><span>Modules</span></div>
                <div className="proof-item"><strong>1</strong><span>Certificate</span></div>
              </div>
            </div>
            <div className="card card--night" style={{ padding: "var(--space-6)" }}>
              <p className="eyebrow" style={{ color: "var(--gold-bright)" }}>Your Progress</p>
              <div className="flex-between mb-4">
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)" }}>{pct}%</strong>
                <span className="badge badge--night">
                  {!state.enrolled ? "Not yet enrolled" : pct === 100 ? "Completed 🎉" : `${doneCount} of ${total} lessons`}
                </span>
              </div>
              <div className="progress-bar progress-bar--dark" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-4" style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)" }}>
                {pct === 100
                  ? "All 27 lessons complete. Your certificate is unlocked below — and the Gītā is now a lifelong companion."
                  : state.enrolled
                    ? "Enrolled — your progress is saved on this device."
                    : "Enroll and check off lessons as you complete them. Your progress is saved on this device — and syncs to your account in the production release."}
              </p>
              <div className="mt-4">
                {state.enrolled && pct === 100 && (
                  <a className="btn btn--gold btn--block" href="#certificate">View Your Certificate</a>
                )}
                {state.enrolled && pct < 100 && nextLesson && (
                  <button className="btn btn--gold btn--block" type="button" onClick={() => gotoLesson(nextLesson.id)}>
                    Continue: {nextLesson.title}
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
            <p className="eyebrow">The Method</p>
            <h2 className="display-md">Read · Reflect · Realize</h2>
          </div>
          <div className="grid-3">
            <article className="card reveal">
              <div className="card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 4v16M12 4c-2-.9-4.5-1.4-8-1.4v16c3.5 0 6 .5 8 1.4 2-.9 4.5-1.4 8-1.4v-16c-3.5 0-6 .5-8 1.4Z" /></svg></div>
              <h3>1 · Read</h3>
              <p>Each lesson assigns a short passage from the book with orientation notes — what to look for, which Sanskrit terms matter, where the argument is heading.</p>
            </article>
            <article className="card reveal" data-delay="1">
              <div className="card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M5 4h14v13l-4 4H5V4Z" /><path d="M15 21v-4h4M9 9h6M9 12.5h4" /></svg></div>
              <h3>2 · Reflect</h3>
              <p>Guided journal prompts turn reading into realization. Save reflections against any verse in the Explorer — they become your personal commentary over time.</p>
            </article>
            <article className="card reveal" data-delay="2">
              <div className="card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 8.7l5.9-.8L12 2.5Z" /></svg></div>
              <h3>3 · Realize</h3>
              <p>Short quizzes consolidate each module, and a certificate crowns the course — but the real credential is a transformed way of seeing your own life.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ CURRICULUM ============ */}
      <section className="section" id="curriculum">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="center mb-6 reveal">
            <p className="eyebrow">Curriculum</p>
            <h2 className="display-md">Six modules, eighteen chapters</h2>
            <p className="lede">Click a lesson to mark it complete. Your place is always saved.</p>
          </div>
          <div className="stack-4">
            {COURSE.map((m, mi) => {
              const moduleDone = m.lessons.filter((l) => state.done[l.id]).length;
              const modulePct = Math.round((moduleDone / m.lessons.length) * 100);
              return (
                <details
                  key={m.id}
                  className="module reveal is-visible"
                  open={mi === openModule}
                  onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) setOpenModule(mi); }}
                >
                  <summary>
                    <span className="module__num" aria-hidden="true">{mi + 1}</span>
                    <span className="module__meta"><strong>{m.title}</strong><span>{m.time}</span></span>
                    <span className="module__progress">{moduleDone}/{m.lessons.length} complete
                      <span className="progress-bar"><i style={{ width: `${modulePct}%` }} /></span>
                    </span>
                  </summary>
                  <ul className="lesson-list">
                    {m.lessons.map((l) => (
                      <li key={l.id}>
                        <button
                          className={"lesson" + (state.done[l.id] ? " is-done" : "")}
                          type="button"
                          data-lesson={l.id}
                          aria-pressed={!!state.done[l.id]}
                          onClick={() => toggleLesson(l.id)}
                        >
                          <span className="lesson__check" aria-hidden="true">✓</span>
                          <span><strong>{l.title}</strong></span>
                          <span>{l.time}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ QUIZ ============ */}
      <section className="section section--cream" id="quiz">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="center mb-6 reveal">
            <p className="eyebrow">Try It Now</p>
            <h2 className="display-md">Module 1 checkpoint</h2>
            <p className="lede">Three questions from the first module — see how the course feels.</p>
          </div>
          <div className="stack-4">
            {QUIZ_M1.map((q, qi) => {
              const chosen = quizAnswers[qi];
              return (
                <div className="card" style={{ cursor: "default" }} key={qi}>
                  <p style={{ fontWeight: 650, marginBottom: "var(--space-4)" }}>{qi + 1}. {q.q}</p>
                  <div className="stack-3">
                    {q.options.map((opt, oi) => {
                      let cls = "quiz-option";
                      if (chosen !== undefined) {
                        if (oi === q.answer) cls += " is-correct";
                        else if (oi === chosen) cls += " is-wrong";
                      }
                      return (
                        <button key={oi} className={cls} type="button" disabled={chosen !== undefined} onClick={() => pickAnswer(qi, oi)}>
                          <span className="quiz-option__key" aria-hidden="true">{"ABCD"[oi]}</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {chosen !== undefined && (
                    <p className="mt-4" style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)", borderLeft: "3px solid var(--gold)", paddingLeft: "1em", marginBottom: 0 }}>{q.why}</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="center mt-5">
            {answered === QUIZ_M1.length && (
              <div className="card card--night" style={{ display: "inline-block", padding: "var(--space-5) var(--space-7)" }}>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", color: "var(--gold-bright)" }}>{score} / {QUIZ_M1.length}</strong>
                <p style={{ color: "var(--moon-soft)", margin: "0.4rem 0 0" }}>
                  {score === QUIZ_M1.length ? "Perfect — you are ready for Module 2." : "Well tried — the lessons will make these second nature."}
                  <button
                    className="btn btn--ghost-dark btn--sm"
                    type="button"
                    style={{ marginLeft: ".8em" }}
                    onClick={() => {
                      setQuizAnswers({});
                      document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Retry
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ CERTIFICATE ============ */}
      <section className="section" id="certificate">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="certificate reveal">
            <p className="eyebrow" style={{ justifyContent: "center", color: "var(--gold-bright)" }}>Certificate of Completion</p>
            <h2 style={{ fontSize: "var(--text-2xl)" }}>Gītā Foundations</h2>
            <p style={{ color: "var(--moon-soft)", maxWidth: "46ch", marginInline: "auto" }}>
              Awarded to <strong style={{ color: "var(--moon)" }}>{pct === 100 ? "a dedicated student of the Gītā" : "your name"}</strong> upon completion of the
              18-week journey through all eighteen chapters of Bhagavad-gītā As It Is.
            </p>
            <p
              className="badge badge--night"
              style={{ marginTop: "var(--space-3)", ...(pct === 100 ? { background: "rgba(255,217,163,.28)", color: "#ffe3b8" } : {}) }}
            >
              {pct === 100 ? "Unlocked — congratulations!" : `Locked — ${total - doneCount} lesson${total - doneCount === 1 ? "" : "s"} to go`}
            </p>
          </div>
          <div className="center mt-6">
            <button className="btn btn--gold btn--lg" type="button" onClick={enroll}>Begin the Journey — Free</button>
          </div>
        </div>
      </section>
    </main>
  );
}
