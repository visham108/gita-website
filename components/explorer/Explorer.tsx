"use client";

/* Verse Explorer — chapter navigation, search, verse detail. Study state
   (bookmarks / highlights / notes / last-read) lives in the StudyProvider:
   device-local when anonymous, account-synced when signed in. */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GITA_CHAPTERS, GITA_VERSES } from "@/lib/data";
import { useToast } from "@/components/Toast";
import { useStudy } from "@/lib/study/StudyProvider";

const versesOf = (ch: number) =>
  Object.keys(GITA_VERSES)
    .filter((ref) => Number(ref.split(".")[0]) === ch)
    .sort((a, b) => Number(a.split(".")[1]) - Number(b.split(".")[1]));

const ALL_REFS = Object.keys(GITA_VERSES).sort((a, b) => {
  const [ac, av] = a.split(".").map(Number);
  const [bc, bv] = b.split(".").map(Number);
  return ac - bc || av - bv;
});

const withBreaks = (s: string) =>
  s.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));

export default function Explorer() {
  const toast = useToast();
  const study = useStudy();
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const setLastReadRef = useRef(study.setLastRead);
  setLastReadRef.current = study.setLastRead;

  const openVerse = useCallback((ref: string) => {
    setVerse(ref);
    setChapter(Number(ref.split(".")[0]));
    setQuery("");
    setNoteOpen(false);
    history.replaceState(null, "", "#" + ref);
    setLastReadRef.current(ref);
    viewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openChapter = useCallback((n: number) => {
    setChapter(n);
    setVerse(null);
    setQuery("");
    history.replaceState(null, "", "#ch" + n);
  }, []);

  // Hash routing on load (#2.47 or #ch2), same as the prototype.
  useEffect(() => {
    setMounted(true);
    const hash = decodeURIComponent(location.hash.slice(1));
    if (/^\d{1,2}\.\d{1,2}$/.test(hash) && GITA_VERSES[hash]) {
      setVerse(hash);
      setChapter(Number(hash.split(".")[0]));
      setLastReadRef.current(hash);
    } else if (/^ch(\d{1,2})$/.test(hash)) {
      setChapter(Math.min(18, Math.max(1, Number(hash.slice(2)))));
    }
  }, []);

  const shareVerse = async (ref: string) => {
    const v = GITA_VERSES[ref];
    const text = `Bhagavad-gītā ${ref} — “${v.r}”`;
    const url = location.origin + location.pathname + "#" + ref;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Bhagavad-gītā ${ref}`, text, url });
        return;
      } catch {
        /* user canceled — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(text + "\n" + url);
      toast("Verse copied to clipboard — share it with someone who needs it.");
    } catch {
      toast("Could not copy automatically — please copy the address bar link.");
    }
  };

  const bookmarks = mounted ? study.bookmarks : [];
  const highlights = mounted ? study.highlights : [];
  const notes = mounted ? study.notes : {};

  const q = query.trim().toLowerCase();
  const searching = q.length >= 2;

  /* ---------------- render helpers ---------------- */

  const verseRow = (ref: string, flag: boolean) => (
    <button className="verse-row" type="button" key={ref} onClick={() => openVerse(ref)}>
      <span className="verse-row__ref">{ref}</span>
      <span className="verse-row__text">{GITA_VERSES[ref].r}</span>
      <span className="verse-row__flag" aria-hidden="true">{flag ? "★" : ""}</span>
    </button>
  );

  const renderChapterView = () => {
    const c = GITA_CHAPTERS[chapter - 1];
    const list = versesOf(c.n);
    return (
      <>
        <header className="verse-detail" style={{ marginBottom: "var(--space-5)" }}>
          <div className="verse-detail__head">
            <div>
              <p style={{ margin: 0, fontSize: "var(--text-xs)", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold-bright)" }}>Chapter {c.n} · {c.iast}</p>
              <h2 style={{ margin: ".35rem 0 0", fontSize: "var(--text-xl)", color: "var(--moon)" }}>{c.en}</h2>
            </div>
            <span className="badge badge--night">{c.verses} verses</span>
          </div>
          <div className="verse-detail__body">
            <p className="sanskrit" style={{ border: "none", padding: 0, marginBottom: "var(--space-3)", textAlign: "left", fontSize: "var(--text-md)", color: "var(--gold-deep)" }}>{c.sa}</p>
            <p style={{ color: "var(--ink-soft)", margin: 0 }}>{c.summary}</p>
          </div>
        </header>
        <div className="flex-between">
          <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>Key verses in this chapter</h3>
          <span className="muted">{list.length} of {c.verses} presented — <Link href="/book#editions" style={{ color: "var(--gold-deep)" }}>read all in the book</Link></span>
        </div>
        <div className="verse-list">{list.map((ref) => verseRow(ref, bookmarks.includes(ref)))}</div>
        <div className="flex-between mt-6">
          {c.n > 1 ? <button className="btn btn--ghost-light" type="button" onClick={() => openChapter(c.n - 1)}>← Chapter {c.n - 1}</button> : <span />}
          {c.n < 18 ? <button className="btn btn--ghost-light" type="button" onClick={() => openChapter(c.n + 1)}>Chapter {c.n + 1} →</button> : <span />}
        </div>
      </>
    );
  };

  const renderVerseView = (ref: string) => {
    const v = GITA_VERSES[ref];
    const chNum = Number(ref.split(".")[0]);
    const c = GITA_CHAPTERS[chNum - 1];
    const isBook = bookmarks.includes(ref);
    const isHi = highlights.includes(ref);
    const note = notes[ref] || "";
    const list = versesOf(chNum);
    const idx = list.indexOf(ref);
    const gIdx = ALL_REFS.indexOf(ref);
    const prevRef = ALL_REFS[gIdx - 1];
    const nextRef = ALL_REFS[gIdx + 1];
    const showNote = noteOpen || !!note;

    return (
      <>
        <article className={"verse-detail" + (isHi ? " highlighted" : "")}>
          <div className="verse-detail__head">
            <div>
              <p style={{ margin: 0, fontSize: "var(--text-xs)", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold-bright)" }}>Chapter {chNum} · {c.iast}</p>
              <h2 style={{ margin: ".35rem 0 0", fontSize: "var(--text-xl)", color: "var(--moon)" }}>Text {ref}</h2>
            </div>
            <div className="verse-toolbar" role="toolbar" aria-label="Verse tools">
              <button
                className={"tool-btn" + (isBook ? " is-active" : "")}
                type="button"
                aria-pressed={isBook}
                onClick={() => {
                  const added = study.toggleBookmark(ref);
                  toast(added ? `Bookmarked ${ref} — find it in My Study.` : `Bookmark removed from ${ref}.`);
                }}
              >
                <svg viewBox="0 0 24 24" fill={isBook ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M6.5 3.5h11V21L12 16.8 6.5 21V3.5Z" /></svg>
                {isBook ? "Bookmarked" : "Bookmark"}
              </button>
              <button
                className={"tool-btn" + (isHi ? " is-active" : "")}
                type="button"
                aria-pressed={isHi}
                onClick={() => {
                  const added = study.toggleHighlight(ref);
                  toast(added ? `Highlighted ${ref}.` : "Highlight removed.");
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m9 15 7.5-7.5a2.1 2.1 0 0 1 3 3L12 18l-4.5 1.5L9 15Z" /><path d="M4 21h7" /></svg>
                Highlight
              </button>
              <button className="tool-btn" type="button" onClick={() => setNoteOpen((o) => !o)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 4h14v13l-4 4H5V4Z" /><path d="M15 21v-4h4" /></svg>
                Note{note ? " ●" : ""}
              </button>
              <button className="tool-btn" type="button" onClick={() => shareVerse(ref)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8" /></svg>
                Share
              </button>
            </div>
          </div>
          <div className="verse-detail__body">
            <p className="sanskrit">{withBreaks(v.d)}</p>
            <p className="iast">{withBreaks(v.t)}</p>
            <p className="verse-detail__translation">{v.r}</p>
            <p className="muted" style={{ fontSize: "var(--text-xs)", marginBottom: "var(--space-4)" }}>Study rendering. The official BBT translation, word-for-word meanings and full purport appear in the book and the production edition of this site.</p>
            <div className="verse-detail__essence"><strong style={{ color: "var(--gold-deep)" }}>Essence · </strong>{v.e}</div>
            {showNote && <NoteEditor key={ref} verseRef={ref} initial={note} />}
          </div>
        </article>
        <div className="flex-between mt-5">
          <button className="btn btn--ghost-light" type="button" disabled={!prevRef} onClick={() => prevRef && openVerse(prevRef)}>← {prevRef || ""}</button>
          <button className="btn btn--ghost-light" type="button" onClick={() => openChapter(chNum)}>Chapter {chNum} overview</button>
          <button className="btn btn--ghost-light" type="button" disabled={!nextRef} onClick={() => nextRef && openVerse(nextRef)}>{nextRef || ""} →</button>
        </div>
        <p className="muted center mt-4" style={{ fontSize: "var(--text-xs)" }}>Verse {idx + 1} of {list.length} presented from Chapter {chNum}</p>
      </>
    );
  };

  const renderSearchView = () => {
    const hits = Object.entries(GITA_VERSES).filter(([ref, v]) =>
      ref.includes(q) || v.t.toLowerCase().includes(q) || v.r.toLowerCase().includes(q) || v.e.toLowerCase().includes(q)
    );
    return (
      <>
        <div className="flex-between">
          <h2 style={{ margin: 0, fontSize: "var(--text-lg)" }}>Search: &ldquo;{query.trim()}&rdquo;</h2>
          <span className="muted">{hits.length} verse{hits.length === 1 ? "" : "s"} found</span>
        </div>
        <div className="verse-list">{hits.map(([ref]) => verseRow(ref, false))}</div>
        {hits.length === 0 && (
          <div className="empty-state mt-5">
            <p>No verses in this selection match. Try &ldquo;karma&rdquo;, &ldquo;soul&rdquo;, &ldquo;surrender&rdquo;, or a reference like &ldquo;2.47&rdquo;.</p>
          </div>
        )}
      </>
    );
  };

  const onSearchInput = (value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      const refMatch = /^(\d{1,2})[.:](\d{1,2})$/.exec(trimmed.toLowerCase());
      if (refMatch) {
        const ref = `${Number(refMatch[1])}.${Number(refMatch[2])}`;
        if (GITA_VERSES[ref]) {
          openVerse(ref);
          const input = document.getElementById("verse-search") as HTMLInputElement | null;
          if (input) input.value = "";
          return;
        }
      }
      setQuery(value);
    }, 220);
  };

  return (
    <div className="explorer">
      <aside className="explorer__sidebar" aria-label="Chapters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></svg>
          <label className="visually-hidden" htmlFor="verse-search">Search verses</label>
          <input id="verse-search" type="search" placeholder="Search: karma, soul, 2.47, surrender…" autoComplete="off" onChange={(e) => onSearchInput(e.target.value)} />
        </div>
        <div className="chapter-scroller">
          {GITA_CHAPTERS.map((c) => (
            <button
              key={c.n}
              className={"chapter-link" + (c.n === chapter && !searching ? " is-active" : "")}
              type="button"
              onClick={() => openChapter(c.n)}
            >
              <span className="chapter-link__num" aria-hidden="true">{c.n}</span>
              <span><strong>{c.en}</strong><span>{c.iast} · {c.verses} verses</span></span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        <div ref={viewRef}>
          {searching ? renderSearchView() : verse ? renderVerseView(verse) : renderChapterView()}
        </div>
      </div>
    </div>
  );
}

function NoteEditor({ verseRef, initial }: { verseRef: string; initial: string }) {
  const toast = useToast();
  const study = useStudy();
  const [text, setText] = useState(initial);

  return (
    <div className="note-editor mt-5">
      <label htmlFor="verse-note" style={{ fontWeight: 600, fontSize: "var(--text-sm)", display: "block", marginBottom: ".5rem" }}>
        My reflection on {verseRef}
      </label>
      <textarea
        id="verse-note"
        placeholder="What is this verse saying to you today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={{ display: "flex", gap: ".6rem", marginTop: ".6rem" }}>
        <button
          className="btn btn--night btn--sm"
          type="button"
          onClick={() => {
            const trimmed = text.trim();
            if (trimmed) {
              study.saveNote(verseRef, trimmed);
              toast(`Reflection saved for ${verseRef}.`);
            } else {
              study.deleteNote(verseRef);
            }
          }}
        >
          Save note
        </button>
        <button
          className="btn btn--ghost-light btn--sm"
          type="button"
          onClick={() => {
            setText("");
            study.deleteNote(verseRef);
            toast("Note deleted.");
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
