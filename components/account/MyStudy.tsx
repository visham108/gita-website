"use client";

/* My Study dashboard — aggregates bookmarks, reflections, course progress,
   reading plan and the daily verse from localStorage (Supabase-synced in
   Phase 2). The daily verse now shares the homepage's numeric-order
   algorithm — one sequence across the whole site. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { COURSE, GITA_VERSES } from "@/lib/data";
import { ORDERED_VERSES, dailyVerseIndex } from "@/lib/verses";
import { useToast } from "@/components/Toast";

const KEYS = {
  bookmarks: "bgaii_bookmarks_v1",
  notes: "bgaii_notes_v1",
  lastRead: "bgaii_lastread_v1",
  course: "bgaii_course_v1",
  plan: "bgaii_plan_v1",
  profile: "bgaii_profile_v1",
};

function load<T>(k: string, fallback: T): T {
  try {
    return (JSON.parse(localStorage.getItem(k) ?? "null") as T) ?? fallback;
  } catch {
    return fallback;
  }
}
const save = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

const PLAN_NAMES: Record<string, string> = {
  pilgrim: "The Pilgrim's Path — one chapter a week for 18 weeks.",
  essence: "The Essence First — chapters 2, 9 and 18 in two weeks.",
  daily: "A Verse a Day — 700 mornings with the Gītā.",
};

const PLANS = [
  { value: "pilgrim", badge: "18 weeks", badgeClass: "badge badge--sage", title: "The Pilgrim's Path", body: "One chapter a week with purports, aligned to the free course. The classic first journey." },
  { value: "essence", badge: "2 weeks", badgeClass: "badge", title: "The Essence First", body: "Chapters 2, 9 and 18 in a fortnight — the summary, the summit and the conclusion." },
  { value: "daily", badge: "700 days", badgeClass: "badge badge--night", title: "A Verse a Day", body: "One verse with purport every morning. Small, unbreakable, and quietly life-changing." },
];

const TOTAL_LESSONS = COURSE.flatMap((m) => m.lessons).length;

export default function MyStudy() {
  const toast = useToast();
  const [rev, setRev] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    setMounted(true);
    setNameInput(load<{ name?: string }>(KEYS.profile, {}).name ?? "");
  }, []);

  void rev;
  const profile = mounted ? load<{ name?: string }>(KEYS.profile, {}) : {};
  const bookmarks = mounted ? load<string[]>(KEYS.bookmarks, []) : [];
  const notes = mounted ? load<Record<string, string>>(KEYS.notes, {}) : {};
  const lastRead = mounted ? load<{ ref: string; when: number } | null>(KEYS.lastRead, null) : null;
  const course = mounted ? load<{ done?: Record<string, boolean> }>(KEYS.course, {}) : {};
  const plan = mounted ? load<string | null>(KEYS.plan, null) : null;

  const doneLessons = Object.values(course.done ?? {}).filter(Boolean).length;
  const coursePct = Math.round((doneLessons / TOTAL_LESSONS) * 100);
  const noteEntries = Object.entries(notes);
  const daily = ORDERED_VERSES[mounted ? dailyVerseIndex() : 0];
  const lastVerse = lastRead && GITA_VERSES[lastRead.ref] ? GITA_VERSES[lastRead.ref] : null;

  return (
    <main id="main">
      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">My Study</li>
            </ol>
          </nav>
          <div className="flex-between">
            <div>
              <p className="eyebrow">Personal Study Space</p>
              <h1>{profile.name ? `Hare Kṛṣṇa, ${profile.name}` : "Welcome, seeker"}</h1>
              <p className="lede">Your bookmarks, reflections, reading plan and course progress — kept
                together, saved on this device. <span style={{ color: "var(--gold-bright)" }}>In the production
                  release, everything syncs securely across all your devices.</span></p>
            </div>
            <form
              className="card card--night"
              style={{ minWidth: 280 }}
              onSubmit={(e) => {
                e.preventDefault();
                const name = nameInput.trim();
                save(KEYS.profile, { name });
                setRev((r) => r + 1);
                toast(name ? `Welcome, ${name}. Your study space is ready.` : "Name cleared.");
              }}
            >
              <label htmlFor="profile-name" style={{ fontSize: "var(--text-sm)", fontWeight: 600, display: "block", marginBottom: ".5rem" }}>What should we call you?</label>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <input
                  id="profile-name"
                  type="text"
                  placeholder="Your name"
                  maxLength={40}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{ flex: 1, minWidth: 0, background: "rgba(255,248,237,.07)", border: "1px solid var(--line-dark)", borderRadius: "var(--radius-pill)", color: "var(--moon)", padding: ".6em 1.1em" }}
                />
                <button className="btn btn--gold btn--sm" type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ============ DASHBOARD STATS ============ */}
      <section className="section section--tight">
        <div className="container">
          <div className="dash-grid">
            <div className="card dash-stat">
              <span className="dash-stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M6.5 3.5h11V21L12 16.8 6.5 21V3.5Z" /></svg></span>
              <div><strong>{bookmarks.length}</strong><span>Bookmarked verses</span></div>
            </div>
            <div className="card dash-stat">
              <span className="dash-stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 4h14v13l-4 4H5V4Z" /><path d="M15 21v-4h4M9 9h6M9 12.5h4" /></svg></span>
              <div><strong>{noteEntries.length}</strong><span>Reflections written</span></div>
            </div>
            <div className="card dash-stat">
              <span className="dash-stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3.2 1.8" /></svg></span>
              <div><strong>{coursePct}%</strong><span>Course progress</span></div>
            </div>
          </div>

          <div className="grid-2 mt-5" style={{ alignItems: "stretch" }}>
            <div className="card card--night">
              <p className="eyebrow" style={{ color: "var(--gold-bright)" }}>Continue Reading</p>
              {lastRead && lastVerse ? (
                <div>
                  <p className="verse-card__ref" style={{ marginBottom: ".6rem" }}>Bhagavad-gītā {lastRead.ref}</p>
                  <p style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>{lastVerse.r}</p>
                  <Link className="btn btn--gold" href={`/explorer#${lastRead.ref}`}>Resume at {lastRead.ref}</Link>
                </div>
              ) : (
                <div>
                  <p style={{ color: "var(--moon-soft)" }}>You haven&rsquo;t opened a verse yet. The journey of 700
                    verses begins with a single śloka.</p>
                  <Link className="btn btn--gold" href="/explorer">Open the Verse Explorer</Link>
                </div>
              )}
            </div>
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--space-4)" }}>
              <div>
                <p className="eyebrow">Today&rsquo;s Practice</p>
                <p className="verse-detail__translation" style={{ fontSize: "var(--text-md)", marginBottom: "var(--space-2)" }}>
                  &ldquo;{daily?.r}&rdquo;
                </p>
                <p className="muted">Bhagavad-gītā {daily?.ref}</p>
              </div>
              <Link className="link-arrow" href={`/explorer#${daily?.ref ?? ""}`}>Read today&rsquo;s verse in context <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ READING PLANS ============ */}
      <section className="section section--cream" id="plans">
        <div className="container">
          <div className="center mb-6 reveal">
            <p className="eyebrow">Reading Plans</p>
            <h2 className="display-md">Choose your pace</h2>
            <p className="lede">A plan turns intention into habit. Pick one — you can change it any time.</p>
          </div>
          <div className="grid-3">
            {PLANS.map((p) => (
              <label className="plan-option" key={p.value}>
                <input
                  type="radio"
                  name="plan"
                  value={p.value}
                  checked={plan === p.value}
                  onChange={() => {
                    save(KEYS.plan, p.value);
                    setRev((r) => r + 1);
                    toast("Reading plan saved. See you tomorrow.");
                  }}
                />
                <span className="card" style={{ display: "block" }}>
                  <span className={p.badgeClass + " mb-4"} style={{ display: "inline-flex", ...(p.value === "daily" ? { color: "var(--moon)" } : {}) }}>{p.badge}</span>
                  <h3 style={{ fontSize: "var(--text-md)" }}>{p.title}</h3>
                  <p>{p.body}</p>
                </span>
              </label>
            ))}
          </div>
          <p className="center muted mt-5">
            {plan && PLAN_NAMES[plan] ? "Active plan: " + PLAN_NAMES[plan] : "No plan selected yet."}
          </p>
        </div>
      </section>

      {/* ============ BOOKMARKS & NOTES ============ */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: "var(--space-7)", alignItems: "start" }}>
            <div>
              <div className="flex-between mb-5">
                <h2 className="display-sm" style={{ margin: 0 }}>Bookmarks</h2>
                <Link className="link-arrow" href="/explorer">Add more <span aria-hidden="true">→</span></Link>
              </div>
              <div className="stack-3">
                {bookmarks.length === 0 ? (
                  <div className="empty-state">
                    <p>No bookmarks yet. Star the verses that speak to you in the{" "}
                      <Link href="/explorer" style={{ color: "var(--gold-deep)", fontWeight: 600 }}>Verse Explorer</Link>.</p>
                  </div>
                ) : (
                  bookmarks.map((ref) => {
                    const v = GITA_VERSES[ref];
                    if (!v) return null;
                    return (
                      <div className="card" key={ref} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "var(--space-4)", alignItems: "center", padding: "var(--space-4) var(--space-5)" }}>
                        <span className="verse-row__ref">{ref}</span>
                        <span className="verse-row__text">{v.r}</span>
                        <span style={{ display: "flex", gap: ".4rem" }}>
                          <Link className="btn btn--ghost-light btn--sm" href={`/explorer#${ref}`}>Open</Link>
                          <button
                            className="btn btn--ghost-light btn--sm"
                            type="button"
                            aria-label={`Remove bookmark ${ref}`}
                            onClick={() => {
                              save(KEYS.bookmarks, load<string[]>(KEYS.bookmarks, []).filter((r) => r !== ref));
                              setRev((r) => r + 1);
                              toast("Bookmark removed.");
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div>
              <div className="flex-between mb-5">
                <h2 className="display-sm" style={{ margin: 0 }}>My Reflections</h2>
                <span className="muted">{noteEntries.length ? `${noteEntries.length} saved` : ""}</span>
              </div>
              <div className="stack-3">
                {noteEntries.length === 0 ? (
                  <div className="empty-state">
                    <p>No reflections yet. Open any verse and choose <strong>Note</strong> — your thoughts
                      become your own commentary over time.</p>
                  </div>
                ) : (
                  noteEntries.map(([ref, text]) => (
                    <div className="card" key={ref} style={{ padding: "var(--space-4) var(--space-5)" }}>
                      <div className="flex-between mb-2" style={{ marginBottom: ".5rem" }}>
                        <span className="verse-row__ref">{ref}</span>
                        <Link className="link-arrow" href={`/explorer#${ref}`} style={{ fontSize: "var(--text-xs)" }}>Edit <span aria-hidden="true">→</span></Link>
                      </div>
                      <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)", margin: 0 }}>{text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
