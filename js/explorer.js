/* ==========================================================================
   Verse Explorer — chapter navigation, search, verse detail,
   bookmarks / highlights / notes persisted in localStorage.
   ========================================================================== */

(function () {
  "use strict";

  const KEYS = {
    bookmarks: "bgaii_bookmarks_v1",
    highlights: "bgaii_highlights_v1",
    notes: "bgaii_notes_v1",
    lastRead: "bgaii_lastread_v1"
  };

  const load = (k, fallback) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; }
    catch { return fallback; }
  };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  let state = {
    chapter: 1,
    verse: null,          // "2.47" or null (chapter overview)
    query: ""
  };

  const $ = (sel, root) => (root || document).querySelector(sel);

  const versesOf = (ch) =>
    Object.keys(window.GITA_VERSES)
      .filter((ref) => Number(ref.split(".")[0]) === ch)
      .sort((a, b) => Number(a.split(".")[1]) - Number(b.split(".")[1]));

  const esc = (s) => s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- Sidebar ---------------- */

  function renderSidebar() {
    const box = $("[data-chapter-list]");
    box.innerHTML = window.GITA_CHAPTERS.map((c) => `
      <button class="chapter-link${c.n === state.chapter && !state.query ? " is-active" : ""}" type="button" data-ch="${c.n}">
        <span class="chapter-link__num" aria-hidden="true">${c.n}</span>
        <span><strong>${c.en}</strong><span>${c.iast} · ${c.verses} verses</span></span>
      </button>`).join("");
  }

  /* ---------------- Chapter overview ---------------- */

  function renderChapter() {
    const c = window.GITA_CHAPTERS[state.chapter - 1];
    const bookmarks = load(KEYS.bookmarks, []);
    const list = versesOf(c.n);
    const rows = list.map((ref) => {
      const v = window.GITA_VERSES[ref];
      return `<button class="verse-row" type="button" data-verse="${ref}">
        <span class="verse-row__ref">${ref}</span>
        <span class="verse-row__text">${esc(v.r)}</span>
        <span class="verse-row__flag" aria-hidden="true">${bookmarks.includes(ref) ? "★" : ""}</span>
      </button>`;
    }).join("");

    $("[data-view]").innerHTML = `
      <header class="verse-detail" style="margin-bottom: var(--space-5);">
        <div class="verse-detail__head">
          <div>
            <p style="margin:0; font-size:var(--text-xs); letter-spacing:.18em; text-transform:uppercase; color:var(--gold-bright)">Chapter ${c.n} · ${c.iast}</p>
            <h2 style="margin:.35rem 0 0; font-size:var(--text-xl); color:var(--moon)">${c.en}</h2>
          </div>
          <span class="badge badge--night">${c.verses} verses</span>
        </div>
        <div class="verse-detail__body">
          <p class="sanskrit" style="border:none; padding:0; margin-bottom:var(--space-3); text-align:left; font-size:var(--text-md); color:var(--gold-deep)">${c.sa}</p>
          <p style="color:var(--ink-soft); margin:0">${c.summary}</p>
        </div>
      </header>
      <div class="flex-between">
        <h3 style="margin:0; font-size:var(--text-md)">Key verses in this chapter</h3>
        <span class="muted">${list.length} of ${c.verses} presented — <a href="book.html#editions" style="color:var(--gold-deep)">read all in the book</a></span>
      </div>
      <div class="verse-list">${rows || ""}</div>
      <div class="flex-between mt-6">
        ${c.n > 1 ? `<button class="btn btn--ghost-light" type="button" data-ch="${c.n - 1}">← Chapter ${c.n - 1}</button>` : "<span></span>"}
        ${c.n < 18 ? `<button class="btn btn--ghost-light" type="button" data-ch="${c.n + 1}">Chapter ${c.n + 1} →</button>` : "<span></span>"}
      </div>`;
  }

  /* ---------------- Verse detail ---------------- */

  function renderVerse() {
    const ref = state.verse;
    const v = window.GITA_VERSES[ref];
    if (!v) { state.verse = null; renderChapter(); return; }

    const [chNum] = ref.split(".").map(Number);
    const c = window.GITA_CHAPTERS[chNum - 1];
    const bookmarks = load(KEYS.bookmarks, []);
    const highlights = load(KEYS.highlights, []);
    const notes = load(KEYS.notes, {});
    const isBook = bookmarks.includes(ref);
    const isHi = highlights.includes(ref);
    const note = notes[ref] || "";

    const list = versesOf(chNum);
    const idx = list.indexOf(ref);
    const allRefs = Object.keys(window.GITA_VERSES).sort((a, b) => {
      const [ac, av] = a.split(".").map(Number); const [bc, bv] = b.split(".").map(Number);
      return ac - bc || av - bv;
    });
    const gIdx = allRefs.indexOf(ref);
    const prevRef = allRefs[gIdx - 1];
    const nextRef = allRefs[gIdx + 1];

    save(KEYS.lastRead, { ref, when: Date.now() });

    $("[data-view]").innerHTML = `
      <article class="verse-detail${isHi ? " highlighted" : ""}" data-verse-detail>
        <div class="verse-detail__head">
          <div>
            <p style="margin:0; font-size:var(--text-xs); letter-spacing:.18em; text-transform:uppercase; color:var(--gold-bright)">Chapter ${chNum} · ${c.iast}</p>
            <h2 style="margin:.35rem 0 0; font-size:var(--text-xl); color:var(--moon)">Text ${ref}</h2>
          </div>
          <div class="verse-toolbar" role="toolbar" aria-label="Verse tools">
            <button class="tool-btn${isBook ? " is-active" : ""}" type="button" data-act="bookmark" aria-pressed="${isBook}">
              <svg viewBox="0 0 24 24" fill="${isBook ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h11V21L12 16.8 6.5 21V3.5Z"/></svg>
              ${isBook ? "Bookmarked" : "Bookmark"}
            </button>
            <button class="tool-btn${isHi ? " is-active" : ""}" type="button" data-act="highlight" aria-pressed="${isHi}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m9 15 7.5-7.5a2.1 2.1 0 0 1 3 3L12 18l-4.5 1.5L9 15Z"/><path d="M4 21h7"/></svg>
              Highlight
            </button>
            <button class="tool-btn" type="button" data-act="note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 4h14v13l-4 4H5V4Z"/><path d="M15 21v-4h4"/></svg>
              Note${note ? " ●" : ""}
            </button>
            <button class="tool-btn" type="button" data-act="share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8"/></svg>
              Share
            </button>
          </div>
        </div>
        <div class="verse-detail__body">
          <p class="sanskrit">${v.d.replace(/\n/g, "<br />")}</p>
          <p class="iast">${v.t.replace(/\n/g, "<br />")}</p>
          <p class="verse-detail__translation">${esc(v.r)}</p>
          <p class="muted" style="font-size:var(--text-xs); margin-bottom:var(--space-4)">Study rendering. The official BBT translation, word-for-word meanings and full purport appear in the book and the production edition of this site.</p>
          <div class="verse-detail__essence"><strong style="color:var(--gold-deep)">Essence · </strong>${esc(v.e)}</div>
          <div class="note-editor mt-5" ${note ? "" : "hidden"} data-note-wrap>
            <label for="verse-note" style="font-weight:600; font-size:var(--text-sm); display:block; margin-bottom:.5rem">My reflection on ${ref}</label>
            <textarea id="verse-note" placeholder="What is this verse saying to you today?">${esc(note)}</textarea>
            <div style="display:flex; gap:.6rem; margin-top:.6rem">
              <button class="btn btn--night btn--sm" type="button" data-act="save-note">Save note</button>
              <button class="btn btn--ghost-light btn--sm" type="button" data-act="delete-note">Delete</button>
            </div>
          </div>
        </div>
      </article>
      <div class="flex-between mt-5">
        <button class="btn btn--ghost-light" type="button" data-verse-nav="${prevRef || ""}" ${prevRef ? "" : "disabled"}>← ${prevRef || ""}</button>
        <button class="btn btn--ghost-light" type="button" data-ch="${chNum}">Chapter ${chNum} overview</button>
        <button class="btn btn--ghost-light" type="button" data-verse-nav="${nextRef || ""}" ${nextRef ? "" : "disabled"}>${nextRef || ""} →</button>
      </div>
      <p class="muted center mt-4" style="font-size:var(--text-xs)">Verse ${idx + 1} of ${list.length} presented from Chapter ${chNum}</p>`;
  }

  /* ---------------- Search ---------------- */

  function renderSearch() {
    const q = state.query.trim().toLowerCase();
    const refMatch = /^(\d{1,2})[.:](\d{1,2})$/.exec(q);
    if (refMatch) {
      const ref = `${Number(refMatch[1])}.${Number(refMatch[2])}`;
      if (window.GITA_VERSES[ref]) {
        openVerse(ref);
        $("#verse-search").value = "";
        state.query = "";
        return;
      }
    }
    const hits = Object.entries(window.GITA_VERSES).filter(([ref, v]) =>
      ref.includes(q) ||
      v.t.toLowerCase().includes(q) ||
      v.r.toLowerCase().includes(q) ||
      v.e.toLowerCase().includes(q)
    );

    const rows = hits.map(([ref, v]) => `
      <button class="verse-row" type="button" data-verse="${ref}">
        <span class="verse-row__ref">${ref}</span>
        <span class="verse-row__text">${esc(v.r)}</span>
        <span class="verse-row__flag" aria-hidden="true"></span>
      </button>`).join("");

    $("[data-view]").innerHTML = `
      <div class="flex-between">
        <h2 style="margin:0; font-size:var(--text-lg)">Search: “${esc(state.query)}”</h2>
        <span class="muted">${hits.length} verse${hits.length === 1 ? "" : "s"} found</span>
      </div>
      <div class="verse-list">${rows || ""}</div>
      ${hits.length ? "" : `<div class="empty-state mt-5">
        <p>No verses in this selection match. Try “karma”, “soul”, “surrender”, or a reference like “2.47”.</p>
      </div>`}`;
  }

  /* ---------------- Actions ---------------- */

  function toggleIn(key, ref) {
    const arr = load(key, []);
    const i = arr.indexOf(ref);
    if (i >= 0) arr.splice(i, 1); else arr.push(ref);
    save(key, arr);
    return i < 0;
  }

  function openVerse(ref) {
    state.verse = ref;
    state.chapter = Number(ref.split(".")[0]);
    state.query = "";
    history.replaceState(null, "", "#" + ref);
    renderSidebar();
    renderVerse();
    $("[data-view]").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openChapter(n) {
    state.chapter = n;
    state.verse = null;
    state.query = "";
    history.replaceState(null, "", "#ch" + n);
    renderSidebar();
    renderChapter();
  }

  async function shareVerse(ref) {
    const v = window.GITA_VERSES[ref];
    const text = `Bhagavad-gītā ${ref} — “${v.r}”`;
    const url = location.origin + location.pathname + "#" + ref;
    if (navigator.share) {
      try { await navigator.share({ title: `Bhagavad-gītā ${ref}`, text, url }); return; }
      catch { /* user canceled — fall through to clipboard */ }
    }
    try {
      await navigator.clipboard.writeText(text + "\n" + url);
      Site.toast("Verse copied to clipboard — share it with someone who needs it.");
    } catch {
      Site.toast("Could not copy automatically — please copy the address bar link.");
    }
  }

  function handleClick(e) {
    const chBtn = e.target.closest("[data-ch]");
    if (chBtn) { openChapter(Number(chBtn.dataset.ch)); return; }

    const vBtn = e.target.closest("[data-verse]");
    if (vBtn) { openVerse(vBtn.dataset.verse); return; }

    const nav = e.target.closest("[data-verse-nav]");
    if (nav && nav.dataset.verseNav) { openVerse(nav.dataset.verseNav); return; }

    const act = e.target.closest("[data-act]");
    if (!act || !state.verse) return;
    const ref = state.verse;

    switch (act.dataset.act) {
      case "bookmark": {
        const added = toggleIn(KEYS.bookmarks, ref);
        Site.toast(added ? `Bookmarked ${ref} — find it in My Study.` : `Bookmark removed from ${ref}.`);
        renderVerse();
        break;
      }
      case "highlight": {
        const added = toggleIn(KEYS.highlights, ref);
        Site.toast(added ? `Highlighted ${ref}.` : `Highlight removed.`);
        renderVerse();
        break;
      }
      case "note": {
        const wrap = $("[data-note-wrap]");
        wrap.hidden = !wrap.hidden;
        if (!wrap.hidden) wrap.querySelector("textarea").focus();
        break;
      }
      case "save-note": {
        const notes = load(KEYS.notes, {});
        const text = $("#verse-note").value.trim();
        if (text) { notes[ref] = text; save(KEYS.notes, notes); Site.toast(`Reflection saved for ${ref}.`); }
        else { delete notes[ref]; save(KEYS.notes, notes); }
        renderVerse();
        break;
      }
      case "delete-note": {
        const notes = load(KEYS.notes, {});
        delete notes[ref];
        save(KEYS.notes, notes);
        Site.toast("Note deleted.");
        renderVerse();
        break;
      }
      case "share": shareVerse(ref); break;
    }
  }

  /* ---------------- Init ---------------- */

  function init() {
    const countEl = $("[data-verse-count]");
    if (countEl) countEl.textContent = String(Object.keys(window.GITA_VERSES).length);

    renderSidebar();

    const hash = decodeURIComponent(location.hash.slice(1));
    if (/^\d{1,2}\.\d{1,2}$/.test(hash) && window.GITA_VERSES[hash]) {
      state.verse = hash;
      state.chapter = Number(hash.split(".")[0]);
      renderSidebar();
      renderVerse();
    } else if (/^ch(\d{1,2})$/.test(hash)) {
      state.chapter = Math.min(18, Math.max(1, Number(hash.slice(2))));
      renderSidebar();
      renderChapter();
    } else {
      renderChapter();
    }

    document.addEventListener("click", handleClick);

    let debounce = null;
    $("#verse-search").addEventListener("input", (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.query = e.target.value;
        if (state.query.trim().length >= 2) renderSearch();
        else if (!state.query.trim()) { state.verse ? renderVerse() : renderChapter(); }
      }, 220);
    });
  }

  window.Explorer = { init };
})();
