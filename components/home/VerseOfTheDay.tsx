"use client";

/* The hero book: a flat cover that opens the verse of the day as a centered
   paper page over a dimmed backdrop. Sequence is one verse per day through
   the whole corpus, with ‹ › browsing. */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ORDERED_VERSES, dailyVerseIndex } from "@/lib/verses";

export default function VerseOfTheDay() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bookRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIndex(dailyVerseIndex());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      bookRef.current?.focus();
    };
  }, [open]);

  const v = ORDERED_VERSES[index];
  const n = ORDERED_VERSES.length;

  return (
    <>
      <div className="book-scene">
        <button
          ref={bookRef}
          className="book"
          id="book"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Open the book to read the verse of the day"
          onClick={() => setOpen(true)}
        >
          <Image
            src="/images/bgaii-cover.jpg"
            alt="Bhagavad-gītā As It Is — original cover painting of Lord Kṛṣṇa driving Arjuna's chariot at Kurukṣetra"
            width={241}
            height={413}
            priority
          />
        </button>
      </div>

      <div className={"book-backdrop" + (open ? " is-on" : "")} hidden={!open} onClick={() => setOpen(false)} />
      <div
        className={"verse-page" + (open ? " is-on" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Verse of the day"
        hidden={!open}
      >
        <button ref={closeRef} className="verse-page__close" type="button" aria-label="Close" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <p className="bi-brand">Bhagavad-gītā · As It Is</p>
        <p className="bi-ref">Verse of the day — <span>{v?.ref}</span></p>
        <div className="bi-rule" aria-hidden="true" />
        <p className="bi-iast">
          {v?.t.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        {/* Our own note on the verse, not a translation. The English rendering
            that used to sit here read too close to the BBT text to be safe on a
            commercial page; the Sanskrit above is public domain. */}
        <p className="bi-trans">{v?.e}</p>
        <div className="bi-nav">
          <button type="button" aria-label="Previous verse" onClick={() => setIndex((i) => (i - 1 + n) % n)}>‹</button>
          <span>{mounted ? `${index + 1} of ${n}` : ""}</span>
          <button type="button" aria-label="Next verse" onClick={() => setIndex((i) => (i + 1) % n)}>›</button>
        </div>
      </div>
    </>
  );
}
