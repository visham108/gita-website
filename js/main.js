/* ==========================================================================
   Shared site behavior: chrome (header/footer/cart), cart store, toasts,
   reveal-on-scroll. Each page calls Site.init({ page: "home" }).
   ========================================================================== */

(function () {
  "use strict";

  const CART_KEY = "bgaii_cart_v1";

  const ICONS = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2.2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.2L20 8H6"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c1.3-3.4 3.8-5 7-5s5.7 1.6 7 5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  const NAV = [
    { href: "index.html", label: "Home", id: "home" },
    { href: "book.html", label: "The Book", id: "book" },
    { href: "explorer.html", label: "Verse Explorer", id: "explorer" },
    { href: "course.html", label: "Course", id: "course" },
    { href: "resources.html", label: "Resources", id: "resources" }
  ];

  /* ---------------- Cart store ---------------- */

  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }
  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartUI();
  }
  function cartCount(cart) {
    return Object.values(cart || readCart()).reduce((a, b) => a + b, 0);
  }
  function cartTotal(cart) {
    const c = cart || readCart();
    return Object.entries(c).reduce((sum, [id, qty]) => {
      const p = window.PRODUCTS.find((x) => x.id === id);
      return p ? sum + p.price * qty : sum;
    }, 0);
  }
  function addToCart(id, qty = 1) {
    const cart = readCart();
    cart[id] = (cart[id] || 0) + qty;
    writeCart(cart);
    const p = window.PRODUCTS.find((x) => x.id === id);
    toast(`Added to cart — ${p ? p.type : "item"}`);
    openCart();
  }
  function setQty(id, qty) {
    const cart = readCart();
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    writeCart(cart);
  }

  const money = (n) => "$" + n.toFixed(2);

  /* ---------------- Chrome templates ---------------- */

  function headerHTML(page, dark) {
    const links = NAV.map((item) =>
      `<a href="${item.href}"${item.id === page ? ' aria-current="page"' : ""}>${item.label}</a>`
    ).join("");
    return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header${dark ? " site-header--dark" : ""}" data-header>
      <div class="container container--wide site-header__inner">
        <a class="brand" href="index.html" aria-label="Bhagavad-gītā As It Is — home">
          <span class="brand__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.6c2 3 2 7 0 10.4-2-3.4-2-7.4 0-10.4Zm-5.6 3.6c3 .8 4.8 3.4 5.2 6.8-3.4-.8-5.6-3.4-5.2-6.8Zm11.2 0c.4 3.4-1.8 6-5.2 6.8.4-3.4 2.2-6 5.2-6.8ZM6 16.4c1.8 1.8 3.8 2.6 6 2.6s4.2-.8 6-2.6c-1 3-3.4 4.4-6 4.4s-5-1.4-6-4.4Z"/></svg></span>
          <span>Bhagavad-gītā <em style="font-style:italic">As It Is</em>
            <span class="brand__sub">Śrīla Prabhupāda</span>
          </span>
        </a>
        <nav class="nav" id="site-nav" aria-label="Primary">${links}
          <a href="account.html"${page === "account" ? ' aria-current="page"' : ""}>My Study</a>
        </nav>
        <div class="header-actions">
          <a class="icon-btn" href="account.html" aria-label="My account">${ICONS.user}</a>
          <button class="icon-btn" type="button" data-cart-open aria-label="Open cart">
            ${ICONS.cart}<span class="cart-count" data-cart-count></span>
          </button>
          <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu" data-nav-toggle>${ICONS.menu}</button>
        </div>
      </div>
    </header>`;
  }

  function footerHTML() {
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a class="brand" href="index.html" style="margin-bottom:1.2rem">
              <span class="brand__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.6c2 3 2 7 0 10.4-2-3.4-2-7.4 0-10.4Zm-5.6 3.6c3 .8 4.8 3.4 5.2 6.8-3.4-.8-5.6-3.4-5.2-6.8Zm11.2 0c.4 3.4-1.8 6-5.2 6.8.4-3.4 2.2-6 5.2-6.8ZM6 16.4c1.8 1.8 3.8 2.6 6 2.6s4.2-.8 6-2.6c-1 3-3.4 4.4-6 4.4s-5-1.4-6-4.4Z"/></svg></span>
              <span style="color:var(--moon)">Bhagavad-gītā <em style="font-style:italic">As It Is</em></span>
            </a>
            <p>The world's most widely read edition of the timeless classic — complete with the original Sanskrit, word-for-word meanings, translations and full purports by His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda.</p>
          </div>
          <div>
            <h4>Discover</h4>
            <ul>
              <li><a href="book.html">About the Book</a></li>
              <li><a href="explorer.html">Verse Explorer</a></li>
              <li><a href="course.html">Gītā Course</a></li>
              <li><a href="resources.html">Resource Library</a></li>
            </ul>
          </div>
          <div>
            <h4>Get the Book</h4>
            <ul>
              <li><a href="book.html#editions">Hardcover</a></li>
              <li><a href="book.html#editions">Paperback</a></li>
              <li><a href="book.html#editions">eBook</a></li>
              <li><a href="book.html#editions">Audiobook</a></li>
            </ul>
          </div>
          <div>
            <h4>Study</h4>
            <ul>
              <li><a href="account.html">My Study</a></li>
              <li><a href="account.html#plans">Reading Plans</a></li>
              <li><a href="book.html#faq">FAQ</a></li>
              <li><a href="resources.html">Lectures &amp; Articles</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p style="margin:0">Bhagavad-gītā As It Is © Bhaktivedanta Book Trust. This site is a design prototype created in devotion, for study purposes.</p>
          <label>
            <span class="visually-hidden">Language</span>
            <select class="lang-select" data-lang>
              <option>English</option><option>हिन्दी</option><option>Español</option>
              <option>Português</option><option>Русский</option><option>中文</option>
            </select>
          </label>
        </div>
      </div>
    </footer>`;
  }

  function drawerHTML() {
    return `
    <div class="drawer-backdrop" data-cart-backdrop hidden></div>
    <aside class="cart-drawer" data-cart-drawer role="dialog" aria-modal="true" aria-label="Shopping cart" hidden>
      <div class="cart-drawer__head">
        <h2>Your Cart</h2>
        <button class="icon-btn" type="button" data-cart-close aria-label="Close cart">${ICONS.close}</button>
      </div>
      <div class="cart-drawer__body" data-cart-items></div>
      <div class="cart-drawer__foot">
        <div class="cart-total"><span>Total</span><span data-cart-total>$0.00</span></div>
        <a class="btn btn--gold btn--block" href="checkout.html" data-cart-checkout>Proceed to Checkout</a>
        <p class="muted" style="text-align:center;margin:0">Free worldwide shipping on orders over $35</p>
      </div>
    </aside>
    <div class="toast" data-toast role="status" aria-live="polite"></div>`;
  }

  /* ---------------- Cart UI ---------------- */

  function renderCartUI() {
    const cart = readCart();
    const count = cartCount(cart);
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = count > 0 ? String(count) : "";
      if (count > 0) el.removeAttribute("data-zero");
      else el.setAttribute("data-zero", "");
    });

    const box = document.querySelector("[data-cart-items]");
    if (!box) return;

    const entries = Object.entries(cart);
    if (!entries.length) {
      box.innerHTML = `<div class="cart-empty">
        <p>Your cart is empty.</p>
        <a class="link-arrow" href="book.html#editions">Browse editions <span aria-hidden="true">→</span></a>
      </div>`;
    } else {
      box.innerHTML = entries.map(([id, qty]) => {
        const p = window.PRODUCTS.find((x) => x.id === id);
        if (!p) return "";
        return `<div class="cart-item">
          <div class="cart-item__thumb" aria-hidden="true"><img src="images/bgaii-cover.jpg" alt="" /></div>
          <div class="cart-item__meta">
            <strong>${p.type}</strong>
            <span>Bhagavad-gītā As It Is</span>
            <div class="qty" aria-label="Quantity for ${p.type}">
              <button type="button" data-qty="${id}:-1" aria-label="Decrease">−</button>
              <span>${qty}</span>
              <button type="button" data-qty="${id}:1" aria-label="Increase">+</button>
            </div>
          </div>
          <div>
            <div class="cart-item__price">${money(p.price * qty)}</div>
            <button class="cart-item__remove" type="button" data-remove="${id}">Remove</button>
          </div>
        </div>`;
      }).join("");
    }

    const totalEl = document.querySelector("[data-cart-total]");
    if (totalEl) totalEl.textContent = money(cartTotal(cart));
    const checkoutBtn = document.querySelector("[data-cart-checkout]");
    if (checkoutBtn) checkoutBtn.classList.toggle("btn--gold", entries.length > 0);
  }

  let lastFocus = null;
  function openCart() {
    const d = document.querySelector("[data-cart-drawer]");
    const b = document.querySelector("[data-cart-backdrop]");
    if (!d) return;
    lastFocus = document.activeElement;
    d.hidden = false; b.hidden = false;
    requestAnimationFrame(() => { d.classList.add("is-open"); b.classList.add("is-open"); });
    d.querySelector("[data-cart-close]").focus();
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    const d = document.querySelector("[data-cart-drawer]");
    const b = document.querySelector("[data-cart-backdrop]");
    if (!d) return;
    d.classList.remove("is-open"); b.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { d.hidden = true; b.hidden = true; }, 450);
    if (lastFocus) lastFocus.focus();
  }

  /* ---------------- Toast ---------------- */

  let toastTimer = null;
  function toast(msg) {
    const el = document.querySelector("[data-toast]");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ---------------- Reveal on scroll ---------------- */

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- Init ---------------- */

  function init(opts) {
    const { page = "", darkHeader = true } = opts || {};

    document.body.insertAdjacentHTML("afterbegin", headerHTML(page, darkHeader));
    document.body.insertAdjacentHTML("beforeend", footerHTML() + drawerHTML());

    // Header scroll state
    const header = document.querySelector("[data-header]");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile nav
    const navToggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("site-nav");
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.innerHTML = open ? ICONS.close : ICONS.menu;
    });

    // Delegated clicks: cart open/close, qty, remove, add-to-cart
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-cart-open],[data-cart-close],[data-cart-backdrop],[data-qty],[data-remove],[data-add]");
      if (!t) return;
      if (t.matches("[data-cart-open]")) openCart();
      else if (t.matches("[data-cart-close]") || t.matches("[data-cart-backdrop]")) closeCart();
      else if (t.dataset.qty) {
        const [id, delta] = t.dataset.qty.split(":");
        setQty(id, (readCart()[id] || 0) + Number(delta));
      }
      else if (t.dataset.remove) setQty(t.dataset.remove, 0);
      else if (t.dataset.add) addToCart(t.dataset.add);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCart();
    });

    // Newsletter / demo forms
    document.querySelectorAll("[data-demo-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        toast(form.dataset.demoForm || "Thank you — you are subscribed. Hare Kṛṣṇa!");
        form.reset();
      });
    });

    const langSel = document.querySelector("[data-lang]");
    if (langSel) langSel.addEventListener("change", () =>
      toast("Full localization ships with the production build — 89 languages planned."));

    renderCartUI();
    initReveal();
  }

  /* Render the edition/pricing cards into a container. */
  function renderProducts(selector) {
    const box = document.querySelector(selector);
    if (!box) return;
    box.innerHTML = window.PRODUCTS.map((p, i) => `
      <article class="card reveal" data-delay="${i}" style="position:relative">
        <div class="format-card">
          ${p.tag ? `<span class="format-card__badge">${p.tag}</span>` : ""}
          <span class="format-card__type">${p.type}</span>
          <h3 style="font-size:var(--text-md);margin:0">Bhagavad-gītā <em>As It Is</em></h3>
          <div class="format-card__price">${money(p.price)} <small>USD</small></div>
          <ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
          <button class="btn btn--gold btn--block" type="button" data-add="${p.id}">Add to Cart</button>
        </div>
      </article>`).join("");
  }

  window.Site = { init, addToCart, readCart, setQty, cartTotal, cartCount, money, toast, renderProducts };
})();
