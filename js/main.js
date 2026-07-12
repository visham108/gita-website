/* ==========================================================================
   Shared site behavior. The header and footer are baked into each page at
   build time (node build.js) — this script only adds behavior: cart store
   and drawer, toasts, mobile nav, reveal-on-scroll. Pages call
   Site.init({ page: "home" }).
   ========================================================================== */

(function () {
  "use strict";

  const CART_KEY = "bgaii_cart_v1";

  const ICONS = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

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

  /* ---------------- Cart drawer & toast markup (behavior-only UI) ---------------- */

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
        <a class="btn btn--gold btn--block" href="checkout.html" data-cart-checkout>Review Order — Preview</a>
        <p class="muted" style="text-align:center;margin:0">Online ordering opens soon — your cart is saved on this device.</p>
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
  }

  /* ---------------- Drawer with focus trap ---------------- */

  let lastFocus = null;

  function drawerFocusables() {
    const d = document.querySelector("[data-cart-drawer]");
    return d ? [...d.querySelectorAll("a[href], button:not([disabled]), select, input")]
      .filter((el) => el.offsetParent !== null) : [];
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    const items = drawerFocusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openCart() {
    const d = document.querySelector("[data-cart-drawer]");
    const b = document.querySelector("[data-cart-backdrop]");
    if (!d) return;
    lastFocus = document.activeElement;
    d.hidden = false; b.hidden = false;
    requestAnimationFrame(() => { d.classList.add("is-open"); b.classList.add("is-open"); });
    d.querySelector("[data-cart-close]").focus();
    d.addEventListener("keydown", trapFocus);
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    const d = document.querySelector("[data-cart-drawer]");
    const b = document.querySelector("[data-cart-backdrop]");
    if (!d || !d.classList.contains("is-open")) return;
    d.classList.remove("is-open"); b.classList.remove("is-open");
    d.removeEventListener("keydown", trapFocus);
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

  /* ---------------- Reveal on scroll (progressive enhancement) ---------------- */

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

  function init() {
    document.body.insertAdjacentHTML("beforeend", drawerHTML());

    // Header scroll state (header is baked into the page)
    const header = document.querySelector("[data-header]");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Mobile nav
    const navToggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("site-nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.innerHTML = open ? ICONS.close : ICONS.menu;
      });
      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          nav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.innerHTML = ICONS.menu;
        }
      });
    }

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
