"use client";

/* Resource library — filterable cards. Media items are placeholders until the
   production CMS build; the links confirm that honestly via toast. */

import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/Toast";

type ResourceType = "article" | "lecture" | "video" | "download";

interface Resource {
  type: ResourceType;
  typeLabel: string;
  title: string;
  body: string;
  meta: string;
  action: string;
}

const RESOURCES: Resource[] = [
  { type: "article", typeLabel: "Article · 8 min", title: "Five Questions the Gītā Answers That Google Can't", body: "Who am I beyond this body? Why do good people suffer? The Gītā's answers to the questions beneath all our searches.", meta: "Study Desk · Beginner", action: "Read article" },
  { type: "lecture", typeLabel: "Lecture · 42 min", title: "Śrīla Prabhupāda on Bhagavad-gītā 2.13", body: "A recorded class from 1966, New York — the very teachings that launched a worldwide movement, on the verse that begins everything.", meta: "Audio archive · All levels", action: "Listen now" },
  { type: "video", typeLabel: "Video · 15 min", title: "How to Read Bhagavad-gītā As It Is", body: "A visual walkthrough of the five layers of every verse — Devanagari, transliteration, word meanings, translation, purport — and how to use them.", meta: "Video series · Beginner", action: "Watch" },
  { type: "download", typeLabel: "Download · PDF", title: "18-Week Reading Plan & Journal", body: "A beautifully typeset companion: weekly reading assignments, reflection prompts, and space to record your realizations chapter by chapter.", meta: "Free · Print-ready A4/Letter", action: "Download" },
  { type: "article", typeLabel: "Article · 12 min", title: "Karma-yoga at the Office: 2.47 for the Working Week", body: "Duty without attachment isn't resignation — it's the highest performance psychology ever written. A practical field guide.", meta: "Study Desk · Intermediate", action: "Read article" },
  { type: "download", typeLabel: "Download · Audio", title: "Sanskrit Pronunciation Starter Pack", body: "Learn to recite ten essential ślokas with syllable-by-syllable audio and IAST guides — including 2.13, 2.20, 4.7–8, 9.22 and 18.66.", meta: "Free · MP3 + PDF", action: "Download" },
  { type: "video", typeLabel: "Video · 28 min", title: "The Jaladuta Diaries: A Journey of Faith", body: "The story of a 69-year-old sannyāsī, two heart attacks at sea, and a trunk of books that changed the spiritual landscape of the world.", meta: "Documentary short · All levels", action: "Watch" },
  { type: "lecture", typeLabel: "Lecture series · 6 parts", title: "The Catuḥ-ślokī: Four Verses, Whole Gītā", body: "A guided series on 10.8–11, the four “nutshell verses” that tradition holds to contain the entire teaching in seed form.", meta: "Audio course · Intermediate", action: "Start series" },
];

const FILTERS: Array<{ id: "all" | ResourceType; label: string }> = [
  { id: "all", label: "All" },
  { id: "article", label: "Articles" },
  { id: "lecture", label: "Lectures" },
  { id: "video", label: "Videos" },
  { id: "download", label: "Downloads" },
];

// The ninth card lives outside RESOURCES in source order in the prototype; kept inline below.
const NINTH: Resource = { type: "article", typeLabel: "Article · 10 min", title: "What “As It Is” Means — and Why It Matters", body: "On paramparā, interpretation, and intellectual honesty: why the presentation of a text can preserve or dissolve its power.", meta: "Study Desk · All levels", action: "Read article" };

export default function ResourceLibrary() {
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | ResourceType>("all");
  const items = [...RESOURCES, NINTH];

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
          <p className="lede">Articles, lectures, study aids and downloads — everything that surrounds the
            book and supports your journey through it.</p>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: "var(--space-5)" }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={"chip" + (filter === f.id ? " is-active" : "")}
                type="button"
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--space-7)" }}>
        <div className="container">
          <div className="grid-3">
            {items.map((r, i) => (
              <article
                key={r.title}
                className="card resource-card reveal"
                data-delay={i % 3 || undefined}
                style={{ display: filter === "all" || r.type === filter ? undefined : "none" }}
              >
                <span className="resource-card__type">{r.typeLabel}</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <span className="resource-card__meta">{r.meta}</span>
                <a
                  className="link-arrow"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast("Full media library ships with the production CMS build.");
                  }}
                >
                  {r.action} <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>

          <div className="cta-band mt-7 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>After the Gītā</p>
            <h2 style={{ fontSize: "var(--text-xl)" }}>Recommended next steps</h2>
            <p className="lede">Finished your first reading? Continue with Śrīmad-Bhāgavatam, join a weekly
              study circle, or visit a temple near you — the Gītā opens a door; a whole world lies beyond it.</p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn--gold" href="/course">Follow the Reading Plan</Link>
              <a
                className="btn btn--ghost-dark"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast("Community directory launches with the production release.");
                }}
              >
                Find a Study Circle
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
