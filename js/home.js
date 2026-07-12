/* ==========================================================================
   Homepage behavior: the verse-of-the-day book (peeks on arrival, lifts to
   center stage when opened), the anatomy-of-a-verse layer tabs, and the
   chapter ribbon. Data comes from js/data.js (GITA_VERSES, GITA_CHAPTERS).
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
  let bookInside = null;
  let bookTrans = null;

  function renderVod() {
    const v = VERSES[vodIndex];
    if (!v) return;
    $("[data-vod-ref]").textContent = v.ref;
    $("[data-vod-iast]").innerHTML = v.t.replace(/\n/g, "<br>");
    $("[data-vod-trans]").textContent = v.r;
    $("[data-vod-count]").textContent = (vodIndex + 1) + " of " + VERSES.length;
    fitVerse();
  }

  // Auto-fit: shrink the page's type until verse, translation and buttons all
  // fit inside the open page — no clipping at any screen size.
  function fitVerse() {
    if (!bookInside) return;
    let fit = 1;
    bookInside.style.setProperty("--fit", fit);
    for (let i = 0; i < 8; i++) {
      const overflows =
        bookInside.scrollHeight > bookInside.clientHeight + 1 ||
        bookTrans.scrollHeight > bookTrans.clientHeight + 1;
      if (!overflows || fit <= 0.7) break;
      fit = +(fit - 0.06).toFixed(2);
      bookInside.style.setProperty("--fit", fit);
    }
  }

  /* ---------------- The book: peek, open, close ---------------- */

  function initBook() {
    const book = $("#book");
    const backdrop = $("[data-book-backdrop]");
    const hero = $(".hero");
    if (!book || !backdrop || !hero) return;

    bookInside = $(".book__inside", book);
    bookTrans = $("[data-vod-trans]", book);

    function setOpen(open) {
      if (open) {
        const r = book.getBoundingClientRect();
        const W = book.offsetWidth;
        const cx = r.left + r.width / 2;
        // The book's layout box grows (never transform scale — scale blurs
        // text); its center stays put in the scene, so centering is a pure
        // translate.
        let Wopen, tx;
        if (window.innerWidth < 640) {
          // phones: center the reading page; the folded cover peeks off-canvas
          Wopen = Math.min(window.innerWidth * 0.88, 420);
          tx = window.innerWidth / 2 - cx;
        } else {
          // wide screens: center the full two-page spread
          Wopen = Math.min(window.innerWidth * 0.46, 430, window.innerHeight * 0.5);
          tx = window.innerWidth / 2 - cx + Wopen / 2;
        }
        book.style.width = Wopen + "px";
        book.style.setProperty("--tx", tx + "px");
        book.style.setProperty("--ty", (window.innerHeight / 2 - (r.top + r.height / 2)) + "px");
        hero.classList.add("book-open");
        backdrop.hidden = false;
        requestAnimationFrame(() => backdrop.classList.add("is-on"));
        document.body.style.overflow = "hidden";
      } else {
        hero.classList.remove("book-open");
        backdrop.classList.remove("is-on");
        setTimeout(() => { backdrop.hidden = true; }, 500);
        document.body.style.overflow = "";
        book.style.width = "";
      }
      book.classList.toggle("is-open", open);
      book.classList.remove("is-peek");
      book.setAttribute("aria-expanded", String(open));
      fitVerse(); // page layout may have changed size
    }

    book.addEventListener("click", (e) => {
      if (e.target.closest(".bi-nav")) return;
      setOpen(!book.classList.contains("is-open"));
    });
    book.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(!book.classList.contains("is-open"));
      }
    });
    backdrop.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && book.classList.contains("is-open")) setOpen(false);
    });
    window.addEventListener("resize", () => {
      if (book.classList.contains("is-open")) setOpen(false);
      fitVerse();
    });

    $("[data-vod-prev]").addEventListener("click", () => {
      vodIndex = (vodIndex - 1 + VERSES.length) % VERSES.length;
      renderVod();
    });
    $("[data-vod-next]").addEventListener("click", () => {
      vodIndex = (vodIndex + 1) % VERSES.length;
      renderVod();
    });

    // Self-opening peek when the hero comes into view.
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
      const peekIO = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) {
          peekIO.disconnect();
          setTimeout(() => { if (!book.classList.contains("is-open")) book.classList.add("is-peek"); }, 900);
          setTimeout(() => book.classList.remove("is-peek"), 3600);
        }
      }, { threshold: 0.5 });
      peekIO.observe(book);
    }
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
