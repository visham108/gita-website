"use client";

/* Verse Explorer — the complete Sanskrit text, chapter by chapter.

   Verses come from Postgres one chapter at a time (see /api/verses): all 701
   in the page payload would add hundreds of kilobytes to first load. Study
   state (bookmarks / highlights / notes / last-read) still lives in the
   StudyProvider and is keyed on the "ch.v" reference, so nothing a reader has
   saved is affected by where the text is stored.

   No English translation is shown. The Devanāgarī and its transliteration are
   public domain; the translation, word-for-word meanings and purports are the
   Bhaktivedanta Book Trust's, and belong in the book — every verse links there
   and to the official VedaBase. The essence notes are our own.

   VedaBase links point at the CHAPTER, never the verse: BBT's edition prints
   some verses as combined blocks and numbers chapter 1 to 46 where the
   standard recension has 47, so a per-verse link would silently land readers
   on the wrong text. */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GITA_CHAPTERS } from "@/lib/data";
import type { DbVerse } from "@/lib/scripture";
import { useToast } from "@/components/Toast";
import { useStudy } from "@/lib/study/StudyProvider";

const refOf = (v: DbVerse) => `${v.chapter}.${v.verse}`;
const vedabaseChapter = (ch: number) => `https://vedabase.io/en/library/bg/${ch}/`;

const withBreaks = (s: string) =>
  s.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));

/** First line of the transliteration — enough to recognise a verse in a list. */
function openingLine(v: DbVerse): string {
  const first = v.transliteration.split("\n")[0] ?? "";
  return first.length > 78 ? first.slice(0, 78).trimEnd() + "…" : first;
}

export default function Explorer({
  initialChapter,
  initialVerses,
  verseCounts,
}: {
  initialChapter: number;
  initialVerses: DbVerse[];
  verseCounts: Record<number, number>;
}) {
  const toast = useToast();
  const study = useStudy();

  const [chapter, setChapter] = useState(initialChapter);
  const [verses, setVerses] = useState<DbVerse[]>(initialVerses);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DbVerse[] | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const viewRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cache = useRef<Record<number, DbVerse[]>>({ [initialChapter]: initialVerses });
  const setLastReadRef = useRef(study.setLastRead);
  setLastReadRef.current = study.setLastRead;

  /** Load a chapter, from cache when we already have it. */
  const loadChapter = useCallback(async (n: number): Promise<DbVerse[]> => {
    if (cache.current[n]) return cache.current[n];
    setLoading(true);
    try {
      const res = await fetch(`/api/verses?chapter=${n}`);
      const json = await res.json();
      const list: DbVerse[] = json.verses ?? [];
      cache.current[n] = list;
      return list;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const openChapter = useCallback(
    async (n: number, keepHash = false) => {
      setChapter(n);
      setActive(null);
      setQuery("");
      setResults(null);
      if (!keepHash) history.replaceState(null, "", "#ch" + n);
      setVerses(await loadChapter(n));
    },
    [loadChapter]
  );

  const openVerse = useCallback(
    async (ref: string) => {
      const [c] = ref.split(".").map(Number);
      if (c !== chapter) {
        setChapter(c);
        setVerses(await loadChapter(c));
      }
      setActive(ref);
      setQuery("");
      setResults(null);
      setNoteOpen(false);
      history.replaceState(null, "", "#" + ref);
      setLastReadRef.current(ref);
      viewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [chapter, loadChapter]
  );

  /* Hash routing (#2.47 or #ch2) — the same scheme as before, so old bookmarks
     and shared links keep working.

     This runs on mount AND on hashchange. Without the listener, pasting a verse
     link while already on the Explorer does nothing: the browser treats it as a
     same-page fragment change, React never remounts, and the reader stares at
     whatever was already open. */
  useEffect(() => {
    setMounted(true);

    const applyHash = () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      if (/^\d{1,2}\.\d{1,3}$/.test(hash)) {
        const [c] = hash.split(".").map(Number);
        if (c < 1 || c > 18) return;
        loadChapter(c).then((list) => {
          setChapter(c);
          setVerses(list);
          setQuery("");
          setResults(null);
          if (list.some((v) => refOf(v) === hash)) {
            setActive(hash);
            setLastReadRef.current(hash);
          }
        });
      } else if (/^ch(\d{1,2})$/.test(hash)) {
        const n = Math.min(18, Math.max(1, Number(hash.slice(2))));
        loadChapter(n).then((list) => {
          setChapter(n);
          setVerses(list);
          setActive(null);
        });
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setQuery("");
      setResults(null);
      return;
    }
    // "2.47" jumps straight to the verse rather than searching for it.
    const m = /^(\d{1,2})[.:](\d{1,3})$/.exec(trimmed);
    if (m) {
      const c = Number(m[1]);
      const v = Number(m[2]);
      if (c >= 1 && c <= 18) {
        const list = await loadChapter(c);
        if (list.some((x) => x.verse === v)) {
          const input = document.getElementById("verse-search") as HTMLInputElement | null;
          if (input) input.value = "";
          await openVerse(`${c}.${v}`);
          return;
        }
      }
    }
    setQuery(trimmed);
    setLoading(true);
    try {
      const res = await fetch(`/api/verses?q=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      setResults(json.verses ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [loadChapter, openVerse]);

  const onSearchInput = (value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 260);
  };

  const shareVerse = async (v: DbVerse) => {
    const ref = refOf(v);
    const text = `Bhagavad-gītā ${ref} — ${v.transliteration.split("\n")[0]}`;
    const url = location.origin + location.pathname + "#" + ref;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Bhagavad-gītā ${ref}`, text, url });
        return;
      } catch {
        /* cancelled — fall through to clipboard */
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

  /* ---------------- rows ---------------- */

  const verseRow = (v: DbVerse) => {
    const ref = refOf(v);
    return (
      <button className="verse-row" type="button" key={ref} onClick={() => openVerse(ref)}>
        <span className="verse-row__ref">{ref}</span>
        <span className="verse-row__text iast-inline">{openingLine(v)}</span>
        <span className="verse-row__flag" aria-hidden="true">{bookmarks.includes(ref) ? "★" : ""}</span>
      </button>
    );
  };

  /** Where the translation and purport actually live. Shown on every verse. */
  const sourceBlock = (ch: number) => (
    <div className="verse-source">
      <p className="verse-source__label">Translation &amp; purport</p>
      <p className="verse-source__body">
        Read the full <em>As It Is</em> translation, word-for-word meanings and Śrīla
        Prabhupāda&rsquo;s purport in the book, or on the Bhaktivedanta VedaBase.
      </p>
      <div className="verse-source__btns">
        <Link className="btn btn--gold btn--sm" href="/book#editions">Get the book</Link>
        <a
          className="btn btn--ghost-light btn--sm"
          href={vedabaseChapter(ch)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open chapter {ch} on VedaBase ↗
        </a>
      </div>
    </div>
  );

  /* ---------------- views ---------------- */

  const renderChapterView = () => {
    const c = GITA_CHAPTERS[chapter - 1];
    const count = verseCounts[chapter] ?? verses.length;
    return (
      <>
        <header className="verse-detail" style={{ marginBottom: "var(--space-5)" }}>
          <div className="verse-detail__head">
            <div>
              <p className="verse-detail__eyebrow">Chapter {c.n} · {c.iast}</p>
              <h2 className="verse-detail__title">{c.en}</h2>
            </div>
            <span className="badge badge--night">{count} verses</span>
          </div>
          <div className="verse-detail__body">
            <p className="sanskrit" style={{ border: "none", padding: 0, marginBottom: "var(--space-3)", textAlign: "left", fontSize: "var(--text-md)", color: "var(--gold-deep)" }}>{c.sa}</p>
            <p style={{ color: "var(--ink-soft)", margin: 0 }}>{c.summary}</p>
          </div>
        </header>
        <div className="flex-between">
          <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>All verses in this chapter</h3>
          <span className="muted">{count} verses</span>
        </div>
        <div className="verse-list">{verses.map(verseRow)}</div>
        <div className="flex-between mt-6">
          {c.n > 1
            ? <button className="btn btn--ghost-light" type="button" onClick={() => openChapter(c.n - 1)}>← Chapter {c.n - 1}</button>
            : <span />}
          {c.n < 18
            ? <button className="btn btn--ghost-light" type="button" onClick={() => openChapter(c.n + 1)}>Chapter {c.n + 1} →</button>
            : <span />}
        </div>
      </>
    );
  };

  const renderVerseView = (ref: string) => {
    const v = verses.find((x) => refOf(x) === ref);
    if (!v) return renderChapterView();

    const chNum = v.chapter;
    const c = GITA_CHAPTERS[chNum - 1];
    const isBook = bookmarks.includes(ref);
    const isHi = highlights.includes(ref);
    const note = notes[ref] || "";
    const idx = verses.findIndex((x) => refOf(x) === ref);
    const prev = verses[idx - 1];
    const next = verses[idx + 1];
    const showNote = noteOpen || !!note;

    return (
      <>
        <article className={"verse-detail" + (isHi ? " highlighted" : "")}>
          <div className="verse-detail__head">
            <div>
              <p className="verse-detail__eyebrow">Chapter {chNum} · {c.iast}</p>
              <h2 className="verse-detail__title">Text {ref}</h2>
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
              <button className="tool-btn" type="button" onClick={() => shareVerse(v)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8" /></svg>
                Share
              </button>
            </div>
          </div>
          <div className="verse-detail__body">
            <p className="sanskrit">{withBreaks(v.devanagari)}</p>
            <p className="iast">{withBreaks(v.transliteration)}</p>
            {v.essence && (
              <div className="verse-detail__essence">
                <strong style={{ color: "var(--gold-deep)" }}>Essence · </strong>{v.essence}
              </div>
            )}
            {sourceBlock(chNum)}
            {showNote && <NoteEditor key={ref} verseRef={ref} initial={note} />}
          </div>
        </article>
        <div className="flex-between mt-5">
          <button className="btn btn--ghost-light" type="button" disabled={!prev} onClick={() => prev && openVerse(refOf(prev))}>
            ← {prev ? refOf(prev) : ""}
          </button>
          <button className="btn btn--ghost-light" type="button" onClick={() => openChapter(chNum)}>Chapter {chNum} overview</button>
          <button className="btn btn--ghost-light" type="button" disabled={!next} onClick={() => next && openVerse(refOf(next))}>
            {next ? refOf(next) : ""} →
          </button>
        </div>
        <p className="muted center mt-4" style={{ fontSize: "var(--text-xs)" }}>
          Verse {idx + 1} of {verses.length} in Chapter {chNum}
        </p>
      </>
    );
  };

  const renderSearchView = () => (
    <>
      <div className="flex-between">
        <h2 style={{ margin: 0, fontSize: "var(--text-lg)" }}>Search: &ldquo;{query}&rdquo;</h2>
        <span className="muted">{results?.length ?? 0} verse{results?.length === 1 ? "" : "s"} found</span>
      </div>
      <div className="verse-list">{(results ?? []).map(verseRow)}</div>
      {results && results.length === 0 && (
        <div className="empty-state mt-5">
          <p>
            Nothing matched. Search the Sanskrit as it sounds — <em>karma</em>, <em>ātmā</em>,{" "}
            <em>bhakti</em> — or jump straight to a verse with a reference like <em>2.47</em>.
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="explorer">
      <aside className="explorer__sidebar" aria-label="Chapters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></svg>
          <label className="visually-hidden" htmlFor="verse-search">Search verses</label>
          <input
            id="verse-search"
            type="search"
            placeholder="Search Sanskrit or a reference: karma, 2.47…"
            autoComplete="off"
            onChange={(e) => onSearchInput(e.target.value)}
          />
        </div>
        <div className="chapter-scroller">
          {GITA_CHAPTERS.map((c) => (
            <button
              key={c.n}
              className={"chapter-link" + (c.n === chapter && !query ? " is-active" : "")}
              type="button"
              onClick={() => openChapter(c.n)}
            >
              <span className="chapter-link__num" aria-hidden="true">{c.n}</span>
              <span>
                <strong>{c.en}</strong>
                <span>{c.iast} · {verseCounts[c.n] ?? c.verses} verses</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        <div ref={viewRef} aria-busy={loading}>
          {loading && !verses.length ? (
            <p className="center muted" style={{ padding: "var(--space-7) 0" }}>Loading the text…</p>
          ) : query ? (
            renderSearchView()
          ) : active ? (
            renderVerseView(active)
          ) : (
            renderChapterView()
          )}
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
