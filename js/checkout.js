/* ==========================================================================
   Checkout — 3-step demo flow: order review → details → confirmation.
   No payment is collected in the prototype (Stripe in production).
   ========================================================================== */

(function () {
  "use strict";

  const FREE_SHIP_THRESHOLD = 35;
  const SHIPPING = 4.95;

  const $ = (s) => document.querySelector(s);

  function lines() {
    const cart = Site.readCart();
    return Object.entries(cart)
      .map(([id, qty]) => ({ p: window.PRODUCTS.find((x) => x.id === id), qty }))
      .filter((l) => l.p);
  }

  function totals() {
    const sub = Site.cartTotal();
    const ship = sub === 0 || sub >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING;
    return { sub, ship, total: sub + ship };
  }

  function renderOrder() {
    const ls = lines();
    const box = $("[data-order-items]");
    if (!ls.length) {
      box.innerHTML = `<div class="empty-state">
        <p>Your cart is empty.</p>
        <a class="btn btn--gold" href="book.html#editions">Choose an Edition</a>
      </div>`;
    } else {
      box.innerHTML = ls.map(({ p, qty }) => `
        <div class="cart-item">
          <div class="cart-item__thumb" aria-hidden="true"><img src="images/bgaii-cover.jpg" alt="" /></div>
          <div class="cart-item__meta">
            <strong>${p.type}</strong>
            <span>Bhagavad-gītā As It Is</span>
            <div class="qty" aria-label="Quantity for ${p.type}">
              <button type="button" data-qty="${p.id}:-1" aria-label="Decrease">−</button>
              <span>${qty}</span>
              <button type="button" data-qty="${p.id}:1" aria-label="Increase">+</button>
            </div>
          </div>
          <div>
            <div class="cart-item__price">${Site.money(p.price * qty)}</div>
            <button class="cart-item__remove" type="button" data-remove="${p.id}">Remove</button>
          </div>
        </div>`).join("");
    }
    renderSummary();

    const btn = document.querySelector('[data-to-step="2"]');
    if (btn) btn.disabled = !ls.length;
  }

  function renderSummary() {
    const { sub, ship, total } = totals();
    const rows = `
      <tr><td>Subtotal</td><td>${Site.money(sub)}</td></tr>
      <tr><td>Shipping</td><td>${ship === 0 ? "Free" : Site.money(ship)}</td></tr>
      ${sub > 0 && sub < FREE_SHIP_THRESHOLD ? `<tr><td colspan="2" style="color:var(--gold-deep); font-size:var(--text-xs)">Add ${Site.money(FREE_SHIP_THRESHOLD - sub)} more for free worldwide shipping</td></tr>` : ""}
      <tr class="total"><td>Total</td><td>${Site.money(total)}</td></tr>`;
    const s1 = $("[data-summary]");
    const s2 = $("[data-summary-2]");
    if (s1) s1.innerHTML = rows;
    if (s2) s2.innerHTML = rows;
  }

  function goStep(n) {
    document.querySelectorAll("[data-step]").forEach((el) => {
      el.hidden = el.dataset.step !== String(n);
    });
    document.querySelectorAll("[data-step-ind]").forEach((el) => {
      const i = Number(el.dataset.stepInd);
      el.classList.toggle("is-active", i === n);
      el.classList.toggle("is-done", i < n);
      if (i < n) el.querySelector(".step__dot").textContent = "✓";
      else el.querySelector(".step__dot").textContent = String(i);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function init() {
    renderOrder();

    // Re-render on cart mutations (qty buttons handled by main.js delegate)
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-qty],[data-remove]")) {
        // main.js updates the store first (same listener order), then we redraw
        setTimeout(renderOrder, 0);
      }
      const to = e.target.closest("[data-to-step]");
      if (to && !to.disabled) goStep(Number(to.dataset.toStep));
    });

    const gift = $("#f-gift");
    if (gift) gift.addEventListener("change", () => {
      $("[data-gift-field]").hidden = !gift.checked;
    });

    $("[data-details-form]").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (!lines().length) {
        Site.toast("Your cart is empty — add an edition first.");
        goStep(1);
        return;
      }
      const first = $("#f-first").value.trim();
      const email = $("#f-email").value.trim();
      const ref = "BG-" + String(Math.floor(100000 + Math.random() * 900000));
      $("[data-order-ref]").textContent = ref;
      $("[data-confirm-title]").textContent = first ? `Thank you, ${first}!` : "Thank you!";
      $("[data-confirm-email]").textContent = email ? ` — a confirmation is headed to ${email}` : "";
      localStorage.removeItem("bgaii_cart_v1");
      document.querySelectorAll("[data-cart-count]").forEach((el) => {
        el.textContent = "";
        el.setAttribute("data-zero", "");
      });
      goStep(3);
      Site.toast("Order placed (demo). Hare Kṛṣṇa!");
    });
  }

  window.Checkout = { init };
})();
