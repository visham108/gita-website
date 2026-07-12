/* ==========================================================================
   Homepage behavior: the verse of the day (opens from the hero book as a
   centered page over a backdrop), the anatomy-of-a-verse layer tabs, and
   the chapter ribbon. Data comes from js/data.js (GITA_VERSES, GITA_CHAPTERS).
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);

  /* ---------------- Verse of the day ---------------- */

  // Ordered corpus: every verse in data.js, chapter.verse ascending. One per
  // day, sequentially — tomorrow is always the next verse.
  const VERSES = Object.entries(window.GITA_VERSES || {})
    .map(([ref, v]) => ({ ref, t: v.t, r: v.r }))
    .sort((a, b) => {
      const [ac, av] = a.ref.split(".").map(Number);
      const [bc, bv] = b.ref.split(".").map(Number);
      return ac - bc || av - bv;
    });

  let vodIndex = 0;

  function renderVod() {
    const v = VERSES[vodIndex];
    if (!v) return;
    $("[data-vod-ref]").textContent = v.ref;
    $("[data-vod-iast]").innerHTML = v.t.replace(/\n/g, "<br>");
    $("[data-vod-trans]").textContent = v.r;
    $("[data-vod-count]").textContent = (vodIndex + 1) + " of " + VERSES.length;
  }

  /* ---------------- Open / close ---------------- */

  function initBook() {
    const book = $("#book");
    const backdrop = $("[data-book-backdrop]");
    const page = $("[data-verse-page]");
    if (!book || !backdrop || !page) return;

    function setOpen(open) {
      if (open) {
        backdrop.hidden = false;
        page.hidden = false;
        requestAnimationFrame(() => {
          backdrop.classList.add("is-on");
          page.classList.add("is-on");
        });
        document.body.style.overflow = "hidden";
        $("[data-vod-close]", page).focus();
      } else {
        backdrop.classList.remove("is-on");
        page.classList.remove("is-on");
        setTimeout(() => { backdrop.hidden = true; page.hidden = true; }, 400);
        document.body.style.overflow = "";
        book.focus();
      }
      book.setAttribute("aria-expanded", String(open));
    }

    book.addEventListener("click", () => setOpen(true));
    $("[data-vod-close]", page).addEventListener("click", () => setOpen(false));
    backdrop.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !page.hidden) setOpen(false);
    });

    $("[data-vod-prev]").addEventListener("click", () => {
      vodIndex = (vodIndex - 1 + VERSES.length) % VERSES.length;
      renderVod();
    });
    $("[data-vod-next]").addEventListener("click", () => {
      vodIndex = (vodIndex + 1) % VERSES.length;
      renderVod();
    });
  }

  /* ---------------- Anatomy layer tabs ---------------- */

  function initAnatomy() {
    const tabs = [...document.querySelectorAll(".layer-btn")];
    const panels = [...document.querySelectorAll("[data-panel]")];
    if (!tabs.length) return;
    tabs.forEach((tab, i) => tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      panels.forEach((p, j) => p.classList.toggle("is-active", i === j));
    }));
  }

  /* ---------------- Chapter ribbon ---------------- */

  function initRibbon() {
    const scroller = $("[data-ribbon] .ribbon__scroll");
    if (!scroller || !window.GITA_CHAPTERS) return;
    scroller.innerHTML = window.GITA_CHAPTERS.map((ch) =>
      `<a href="explorer.html#ch${ch.n}"><i>${ch.n}</i><b>${ch.en}<span class="muted-row">${ch.verses} verses</span></b></a>`
    ).join("");
  }

  /* ---------------- Init ---------------- */

  function init() {
    vodIndex = VERSES.length ? Math.floor(Date.now() / 864e5) % VERSES.length : 0;
    initBook();
    initAnatomy();
    initRibbon();
    renderVod();
  }

  window.Home = { init };
})();
