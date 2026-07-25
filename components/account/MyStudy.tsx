"use client";

/* My Study — the reader's own corner: sign-in, name, today's verse and the
   reading pace they've chosen.

   Bookmarks, highlights and per-verse reflections used to live here too. They
   were created inside the Verse Explorer and every link opened there; with the
   Explorer removed (VedaBase does that job better, and we have no licence to
   show the translation) they had nowhere to come from and nowhere to go, so
   they are gone from the UI. The tables remain in the database, untouched. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORDERED_VERSES, dailyVerseIndex } from "@/lib/verses";
import { useToast } from "@/components/Toast";
import { useStudy } from "@/lib/study/StudyProvider";

const PLAN_NAMES: Record<string, string> = {
  pilgrim: "The Pilgrim's Path — one chapter a week for 18 weeks.",
  essence: "The Essence First — chapters 2, 9 and 18 in two weeks.",
  daily: "A Verse a Day — 700 mornings with the Gītā.",
};

const PLANS = [
  { value: "pilgrim", badge: "18 weeks", badgeClass: "badge badge--sage", title: "The Pilgrim's Path", body: "One chapter a week with the purports. The classic first journey through the whole book." },
  { value: "essence", badge: "2 weeks", badgeClass: "badge", title: "The Essence First", body: "Chapters 2, 9 and 18 in a fortnight — the summary, the summit and the conclusion." },
  { value: "daily", badge: "700 days", badgeClass: "badge badge--night", title: "A Verse a Day", body: "One verse with purport every morning. Small, unbreakable, and quietly life-changing." },
];

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

  const plan = mounted ? study.plan : null;
  const daily = ORDERED_VERSES[mounted ? dailyVerseIndex() : 0];

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
              <p className="lede">Your reading pace, today&rsquo;s verse and your orders — kept together.{" "}
                <span style={{ color: "var(--gold-bright)" }}>
                  {mounted && study.user
                    ? "Synced securely to your account, on every device you sign in to."
                    : "Saved on this device — sign in and it follows you everywhere."}
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

      {/* ============ TODAY + THE COURSE ============ */}
      <section className="section section--tight">
        <div className="container">
          <div className="grid-2" style={{ alignItems: "stretch" }}>
            <div className="card card--night" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--space-4)" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--gold-bright)" }}>The Free Live Course</p>
                <h2 style={{ fontSize: "var(--text-lg)", color: "var(--moon)", margin: "0 0 var(--space-3)" }}>
                  Learn the Gītā with a teacher
                </h2>
                <p style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)", margin: 0 }}>
                  Live sessions on what the Gītā actually asks of a working life — pressure, anger,
                  duty, comparison, loss. Free, and you can ask questions as you go.
                </p>
              </div>
              <Link className="btn btn--gold" href="/course">See the course</Link>
            </div>
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--space-4)" }}>
              <div>
                <p className="eyebrow">Today&rsquo;s Verse</p>
                <p className="iast" style={{ fontSize: "var(--text-sm)", textAlign: "left", marginBottom: "var(--space-3)" }}>
                  {daily?.t.split("\n")[0]}
                </p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)", margin: "0 0 var(--space-2)" }}>
                  {daily?.e}
                </p>
                <p className="muted">Bhagavad-gītā {daily?.ref}</p>
              </div>
              <Link className="link-arrow" href="/book#editions">Read it in full — get the book <span aria-hidden="true">→</span></Link>
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

      {/* ============ ORDERS ============ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p className="eyebrow" style={{ justifyContent: "center" }}>Your Orders</p>
            <h2 className="display-sm" style={{ margin: "0 0 var(--space-3)" }}>Track a book you&rsquo;ve ordered</h2>
            <p className="lede" style={{ marginInline: "auto" }}>
              Look up any order with your order number and the email you used at checkout.
            </p>
            <Link className="btn btn--gold" href="/orders">Track your order</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
