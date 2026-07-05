/* ==========================================================================
   My Study — dashboard aggregating bookmarks, notes, course progress,
   reading plan and daily verse. All state from localStorage (device-local
   in this prototype; account-synced in production).
   ========================================================================== */

(function () {
  "use strict";

  const KEYS = {
    bookmarks: "bgaii_bookmarks_v1",
    notes: "bgaii_notes_v1",
    lastRead: "bgaii_lastread_v1",
    course: "bgaii_course_v1",
    plan: "bgaii_plan_v1",
    profile: "bgaii_profile_v1"
  };

  const load = (k, fallback) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; }
    catch { return fallback; }
  };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const $ = (s) => document.querySelector(s);

  const esc = (s) => s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const PLAN_NAMES = {
    pilgrim: "The Pilgrim's Path — one chapter a week for 18 weeks.",
    essence: "The Essence First — chapters 2, 9 and 18 in two weeks.",
    daily: "A Verse a Day — 700 mornings with the Gītā."
  };

  function renderGreeting() {
    const profile = load(KEYS.profile, {});
    if (profile.name) {
      $("[data-greeting]").textContent = `Hare Kṛṣṇa, ${profile.name}`;
      $("#profile-name").value = profile.name;
    }
  }

  function renderStats() {
    const bookmarks = load(KEYS.bookmarks, []);
    const notes = load(KEYS.notes, {});
    const course = load(KEYS.course, { done: {} });
    const total = window.COURSE.flatMap((m) => m.lessons).length;
    const done = Object.values(course.done || {}).filter(Boolean).length;

    $("[data-stat-bookmarks]").textContent = String(bookmarks.length);
    $("[data-stat-notes]").textContent = String(Object.keys(notes).length);
    $("[data-stat-course]").textContent = Math.round((done / total) * 100) + "%";
  }

  function renderContinue() {
    const last = load(KEYS.lastRead, null);
    if (!last || !window.GITA_VERSES[last.ref]) return;
    const v = window.GITA_VERSES[last.ref];
    $("[data-continue-body]").innerHTML = `
      <p class="verse-card__ref" style="margin-bottom:.6rem">Bhagavad-gītā ${last.ref}</p>
      <p style="color:var(--moon-soft); font-size:var(--text-sm); margin-bottom:var(--space-4)">${esc(v.r)}</p>
      <a class="btn btn--gold" href="explorer.html#${last.ref}">Resume at ${last.ref}</a>`;
  }

  function renderDaily() {
    // Deterministic daily verse: rotate through the collection by day-of-year.
    const refs = Object.keys(window.GITA_VERSES).sort();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    const ref = refs[dayOfYear % refs.length];
    const v = window.GITA_VERSES[ref];
    $("[data-daily-verse]").textContent = `“${v.r}”`;
    $("[data-daily-ref]").textContent = `Bhagavad-gītā ${ref}`;
    $("[data-daily-link]").setAttribute("href", `explorer.html#${ref}`);
  }

  function renderPlan() {
    const plan = load(KEYS.plan, null);
    if (plan && PLAN_NAMES[plan]) {
      const input = document.querySelector(`[data-plans] input[value="${plan}"]`);
      if (input) input.checked = true;
      $("[data-plan-status]").textContent = "Active plan: " + PLAN_NAMES[plan];
    } else {
      $("[data-plan-status]").textContent = "No plan selected yet.";
    }
  }

  function renderBookmarks() {
    const bookmarks = load(KEYS.bookmarks, []);
    const box = $("[data-bookmark-list]");
    if (!bookmarks.length) {
      box.innerHTML = `<div class="empty-state">
        <p>No bookmarks yet. Star the verses that speak to you in the
        <a href="explorer.html" style="color:var(--gold-deep); font-weight:600">Verse Explorer</a>.</p>
      </div>`;
      return;
    }
    box.innerHTML = bookmarks.map((ref) => {
      const v = window.GITA_VERSES[ref];
      if (!v) return "";
      return `<div class="card" style="display:grid; grid-template-columns:auto 1fr auto; gap:var(--space-4); align-items:center; padding:var(--space-4) var(--space-5)">
        <span class="verse-row__ref">${ref}</span>
        <span class="verse-row__text">${esc(v.r)}</span>
        <span style="display:flex; gap:.4rem">
          <a class="btn btn--ghost-light btn--sm" href="explorer.html#${ref}">Open</a>
          <button class="btn btn--ghost-light btn--sm" type="button" data-unbookmark="${ref}" aria-label="Remove bookmark ${ref}">✕</button>
        </span>
      </div>`;
    }).join("");
  }

  function renderNotes() {
    const notes = load(KEYS.notes, {});
    const entries = Object.entries(notes);
    $("[data-note-count]").textContent = entries.length ? `${entries.length} saved` : "";
    const box = $("[data-note-list]");
    if (!entries.length) {
      box.innerHTML = `<div class="empty-state">
        <p>No reflections yet. Open any verse and choose <strong>Note</strong> — your thoughts
        become your own commentary over time.</p>
      </div>`;
      return;
    }
    box.innerHTML = entries.map(([ref, text]) => `
      <div class="card" style="padding:var(--space-4) var(--space-5)">
        <div class="flex-between mb-2" style="margin-bottom:.5rem">
          <span class="verse-row__ref">${ref}</span>
          <a class="link-arrow" href="explorer.html#${ref}" style="font-size:var(--text-xs)">Edit <span aria-hidden="true">→</span></a>
        </div>
        <p style="font-size:var(--text-sm); color:var(--ink-soft); margin:0">${esc(text)}</p>
      </div>`).join("");
  }

  function init() {
    renderGreeting();
    renderStats();
    renderContinue();
    renderDaily();
    renderPlan();
    renderBookmarks();
    renderNotes();

    document.querySelector("[data-name-form]").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#profile-name").value.trim();
      save(KEYS.profile, { name });
      renderGreeting();
      Site.toast(name ? `Welcome, ${name}. Your study space is ready.` : "Name cleared.");
    });

    document.querySelector("[data-plans]").addEventListener("change", (e) => {
      if (e.target.name === "plan") {
        save(KEYS.plan, e.target.value);
        renderPlan();
        Site.toast("Reading plan saved. See you tomorrow.");
      }
    });

    document.addEventListener("click", (e) => {
      const un = e.target.closest("[data-unbookmark]");
      if (un) {
        const arr = load(KEYS.bookmarks, []).filter((r) => r !== un.dataset.unbookmark);
        save(KEYS.bookmarks, arr);
        renderBookmarks();
        renderStats();
        Site.toast("Bookmark removed.");
      }
    });
  }

  window.Account = { init };
})();
