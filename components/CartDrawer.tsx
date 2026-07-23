"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { cartSubtotalPaise, setQty, useCart } from "@/lib/cart";
import { moneyINR, SHIPPING_IS_FREE, SHIPPING_FIRST_ITEM_PAISE, SHIPPING_EXTRA_ITEM_PAISE, FREE_SHIPPING_THRESHOLD_PAISE, MAX_ITEM_QTY, BULK_ENQUIRY_EMAIL } from "@/lib/commerce";
import { useCatalog } from "@/components/CatalogProvider";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const products = useCatalog();
  const drawerRef = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const entries = Object.entries(cart);

  // Focus management + trap + escape + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>("[data-cart-close]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !drawer) return;
      const items = [...drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), select, input")]
        .filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocus.current?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={"drawer-backdrop" + (open ? " is-open" : "")}
        hidden={!open}
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        className={"cart-drawer" + (open ? " is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        hidden={!open}
      >
        <div className="cart-drawer__head">
          <h2>Your Cart</h2>
          <button className="icon-btn" type="button" data-cart-close onClick={onClose} aria-label="Close cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="cart-drawer__body">
          {entries.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty.</p>
              <Link className="link-arrow" href="/book#editions" onClick={onClose}>
                Browse editions <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            entries.map(([id, qty]) => {
              const p = products.find((x) => x.id === id);
              if (!p) return null;
              return (
                <div className="cart-item" key={id}>
                  <div className="cart-item__thumb" aria-hidden="true">
                    <Image src="/images/bgaii-cover.jpg" alt="" width={58} height={82} />
                  </div>
                  <div className="cart-item__meta">
                    <strong>{p.type}</strong>
                    <span>Bhagavad-gītā As It Is</span>
                    {/* Typable quantity — a bulk buyer wanting 50 copies should
                        not have to press "+" fifty times. */}
                    <div className="qty" aria-label={`Quantity for ${p.type}`}>
                      <button type="button" onClick={() => setQty(id, qty - 1)} aria-label="Decrease">−</button>
                      <input
                        type="number"
                        className="qty__input"
                        min={1}
                        max={MAX_ITEM_QTY}
                        value={qty}
                        aria-label={`Quantity of ${p.type}`}
                        onChange={(e) => {
                          const n = parseInt(e.target.value, 10);
                          if (Number.isFinite(n)) setQty(id, Math.min(Math.max(n, 0), MAX_ITEM_QTY));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setQty(id, Math.min(qty + 1, MAX_ITEM_QTY))}
                        aria-label="Increase"
                        disabled={qty >= MAX_ITEM_QTY}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="cart-item__price">{moneyINR(p.price_paise * qty)}</div>
                    <button className="cart-item__remove" type="button" onClick={() => setQty(id, 0)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-drawer__foot">
          <div className="cart-total"><span>Subtotal</span><span>{moneyINR(cartSubtotalPaise(cart, products))}</span></div>
          <Link className="btn btn--gold btn--block" href="/checkout" onClick={onClose}>
            Checkout
          </Link>
          <p className="muted" style={{ textAlign: "center", margin: 0 }}>
            {SHIPPING_IS_FREE
              ? "Free shipping on every order."
              : FREE_SHIPPING_THRESHOLD_PAISE > 0
                ? `Free shipping on orders of ${moneyINR(FREE_SHIPPING_THRESHOLD_PAISE)} or more.`
                : `Shipping ${moneyINR(SHIPPING_FIRST_ITEM_PAISE)}, plus ${moneyINR(SHIPPING_EXTRA_ITEM_PAISE)} per extra copy.`}
          </p>
          {/* Surface the bulk route as they approach the cap, rather than
              letting them hit it and bounce. */}
          {entries.some(([, q]) => q >= MAX_ITEM_QTY) && (
            <p className="muted" style={{ textAlign: "center", margin: ".6rem 0 0", fontSize: "var(--text-xs)" }}>
              Need more than {MAX_ITEM_QTY}?{" "}
              <a href={`mailto:${BULK_ENQUIRY_EMAIL}?subject=Bulk%20order%20enquiry`} style={{ color: "var(--gold-deep)", fontWeight: 600 }}>
                Email us for bulk pricing
              </a>{" "}
              — schools, temples, libraries and gifting.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
