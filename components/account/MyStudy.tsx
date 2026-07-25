"use client";

/* My Study dashboard — aggregates bookmarks, reflections, course progress,
   reading plan and the daily verse from the StudyProvider (device-local when
   anonymous, account-synced when signed in), plus magic-link sign in. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { READING_PLAN, GITA_VERSES } from "@/lib/data";
import { ORDERED_VERSES, dailyVerseIndex } from "@/lib/verses";
import { useToast } from "@/components/Toast";
import { useStudy } from "@/lib/study/StudyProvider";

const PLAN_NAMES: Record<string, string> = {
  pilgrim: "The Pilgrim's Path — one chapter a week for 18 weeks.",
  essence: "The Essence First — chapters 2, 9 and 18 in two weeks.",
  daily: "A Verse a Day — 700 mornings with the Gītā.",
};

const PLANS = [
  { value: "pilgrim", badge: "18 weeks", badgeClass: "badge badge--sage", title: "The Pilgrim's Path", body: "One chapter a week with purports, aligned to the free reading plan. The classic first journey." },
  { value: "essence", badge: "2 weeks", badgeClass: "badge", title: "The Essence First", body: "Chapters 2, 9 and 18 in a fortnight — the summary, the summit and the conclusion." },
  { value: "daily", badge: "700 days", badgeClass: "badge badge--night", title: "A Verse a Day", body: "One verse with purport every morning. Small, unbreakable, and quietly life-changing." },
];

const ALL_READINGS = READING_PLAN.flatMap((s) => s.readings);
const TOTAL_LESSONS = ALL_READINGS.length;

function AuthCard() {
  const toast = useToast();
  const study = useStudy();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (study.user) {
    return (
      <div className="card card--night" style={{ minWidth: 280 }}>
        <p style={{ fontSize: "var(--text-xs)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-bright)", margin: "0 0 .5rem" }}>Signed in</p>
        <p style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-4)", overflowWrap: "anywhere" }}>{study.user.email}</p>
        <button
          className="btn btn--ghost-dark btn--sm"
          type="button"
          onClick={async () => {
            await study.signOut();
            toast("Signed out. Your study stays safe in your account.");
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form
      className="card card--night"
      style={{ minWidth: 280 }}
      onSubmit={async (e) => {
        e.preventDefault();
        const addr = email.trim();
        if (!addr || busy) return;
        setBusy(true);
        const { error } = await study.signInWithEmail(addr);
        setBusy(false);
        if (error) toast("Could not send the link — " + error);
        else setSent(true);
      }}
    >
      <label htmlFor="auth-email" style={{ fontSize: "var(--text-sm)", fontWeight: 600, display: "block", marginBottom: ".5rem" }}>
        Sign in to sync across devices
      </label>
      {sent ? (
        <p style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)", margin: 0 }}>
          Check your email — we sent you a sign-in link. It signs you in on this device with one click.
        </p>
      ) : (
        <>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <input
              id="auth-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, minWidth: 0, background: "rgba(255,248,237,.07)", border: "1px solid var(--line-dark)", borderRadius: "var(--radius-pill)", color: "var(--moon)", padding: ".6em 1.1em" }}
            />
            <button className="btn btn--gold btn--sm" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send link"}
            </button>
          </div>
          <p style={{ color: "var(--moon-faint)", fontSize: "var(--text-xs)", margin: ".6rem 0 0" }}>
            No password needed — a magic link arrives in your inbox.
          </p>
        </>
      )}
    </form>
  );
}

export default function MyStudy() {
  const toast = useToast();
  const study = useStudy();
  const [mounted, setMounted] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setNameInput(study.name); }, [study.name]);

  const bookmarks = mounted ? study.bookmarks : [];
  const notes = mounted ? study.notes : {};
  const lastRead = mounted ? study.lastRead : null;
  const plan = mounted ? study.plan : null;

  // Count only readings that exist in the current plan — the exact same basis
  // the Reading Plan page uses. Counting every truthy key in `done` instead
  // (the old approach) also tallied orphaned ids left over from the previous
  // course structure, so this figure read higher than the Reading Plan bar and
  // could even exceed 100%.
  const doneLessons = ALL_READINGS.filter((r) => study.course.done[r.id]).length;
  const coursePct = TOTAL_LESSONS ? Math.round((doneLessons / TOTAL_LESSONS) * 100) : 0;
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
          <div className="flex-between" style={{ alignItems: "start" }}>
            <div>
              <p className="eyebrow">Personal Study Space</p>
              <h1>{mounted && study.name ? `Hare Kṛṣṇa, ${study.name}` : "Welcome, seeker"}</h1>
              <p className="lede">Your bookmarks, reflections, reading plan and course progress — kept together.{" "}
                <span style={{ color: "var(--gold-bright)" }}>
                  {mounted && study.user
                    ? "Synced securely to your account, on every device you sign in to."
                    : "Saved on this device — sign in and they follow you everywhere."}
                </span>
              </p>
            </div>
            <div className="stack-3" style={{ minWidth: 280 }}>
              <AuthCard />
              <form
                className="card card--night"
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = nameInput.trim();
                  study.setName(name);
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
              <div><strong>{coursePct}%</strong><span>Reading plan</span></div>
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
                    study.setPlan(p.value);
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
                              study.removeBookmark(ref);
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
