"use client";

/* Checkout — 3-step preview flow: order review → details → confirmation.
   No payment is collected yet; Phase 3 replaces the confirmation step with a
   server-created order + Razorpay Checkout. */

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PRODUCTS } from "@/lib/data";
import { clearCart, money, setQty, useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";

const FREE_SHIP_THRESHOLD = 35;
const SHIPPING = 4.95;

export default function Checkout() {
  const toast = useToast();
  const cart = useCart();
  const [step, setStep] = useState(1);
  const [gift, setGift] = useState(false);
  const [confirm, setConfirm] = useState<{ ref: string; first: string; email: string } | null>(null);

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id), qty }))
    .filter((l): l is { p: (typeof PRODUCTS)[number]; qty: number } => !!l.p);

  const sub = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const ship = sub === 0 || sub >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING;
  const total = sub + ship;

  const goStep = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Summary = () => (
    <table className="summary-table mt-4">
      <tbody>
        <tr><td>Subtotal</td><td>{money(sub)}</td></tr>
        <tr><td>Shipping (estimated)</td><td>{ship === 0 ? "Free" : money(ship)}</td></tr>
        <tr className="total"><td>Total (preview)</td><td>{money(total)}</td></tr>
      </tbody>
    </table>
  );

  return (
    <main id="main">
      <section className="page-hero" style={{ paddingBottom: "var(--space-6)" }}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/book#editions">Editions</Link></li>
              <li aria-current="page">Checkout</li>
            </ol>
          </nav>
          <h1 style={{ fontSize: "var(--text-2xl)" }}>Checkout</h1>
          <p className="lede" style={{ marginBottom: 0 }}>A preview of the ordering experience — payments arrive with the production build.</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 1020 }}>

          <div className="preview-note" role="note">
            <strong>Preview.</strong>
            <span>Online ordering opens soon. No payment is collected and nothing ships yet — your
              cart and this walkthrough are saved on this device only.</span>
          </div>

          <div className="steps">
            {[1, 2, 3].map((i) => (
              <span key={i} style={{ display: "contents" }}>
                {i > 1 && <span className="steps__line" />}
                <div className={"step" + (i === step ? " is-active" : "") + (i < step ? " is-done" : "")}>
                  <span className="step__dot">{i < step ? "✓" : i}</span> {["Order", "Details", "Confirmation"][i - 1]}
                </div>
              </span>
            ))}
          </div>

          {/* STEP 1: ORDER REVIEW */}
          {step === 1 && (
            <div className="grid-2" style={{ alignItems: "start", gap: "var(--space-6)" }}>
              <div className="card" style={{ cursor: "default" }}>
                <h2 className="display-sm">Your order</h2>
                <div className="stack-4 mt-5">
                  {lines.length === 0 ? (
                    <div className="empty-state">
                      <p>Your cart is empty.</p>
                      <Link className="btn btn--gold" href="/book#editions">Choose an Edition</Link>
                    </div>
                  ) : (
                    lines.map(({ p, qty }) => (
                      <div className="cart-item" key={p.id}>
                        <div className="cart-item__thumb" aria-hidden="true">
                          <Image src="/images/bgaii-cover.jpg" alt="" width={58} height={82} />
                        </div>
                        <div className="cart-item__meta">
                          <strong>{p.type}</strong>
                          <span>Bhagavad-gītā As It Is</span>
                          <div className="qty" aria-label={`Quantity for ${p.type}`}>
                            <button type="button" onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease">−</button>
                            <span>{qty}</span>
                            <button type="button" onClick={() => setQty(p.id, qty + 1)} aria-label="Increase">+</button>
                          </div>
                        </div>
                        <div>
                          <div className="cart-item__price">{money(p.price * qty)}</div>
                          <button className="cart-item__remove" type="button" onClick={() => setQty(p.id, 0)}>Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="card" style={{ cursor: "default" }}>
                <h2 className="display-sm">Summary</h2>
                <Summary />
                <button className="btn btn--gold btn--block mt-5" type="button" disabled={!lines.length} onClick={() => goStep(2)}>
                  Continue to Details
                </button>
                <Link className="link-arrow mt-4" href="/book#editions" style={{ justifyContent: "center", display: "flex" }}>← Continue shopping</Link>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="grid-2" style={{ alignItems: "start", gap: "var(--space-6)" }}>
              <form
                className="card"
                style={{ cursor: "default" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                  }
                  if (!lines.length) {
                    toast("Your cart is empty — add an edition first.");
                    goStep(1);
                    return;
                  }
                  const first = (form.querySelector("#f-first") as HTMLInputElement).value.trim();
                  const email = (form.querySelector("#f-email") as HTMLInputElement).value.trim();
                  const ref = "BG-" + String(Math.floor(100000 + Math.random() * 900000));
                  setConfirm({ ref, first, email });
                  clearCart();
                  goStep(3);
                  toast("Order placed (demo). Hare Kṛṣṇa!");
                }}
              >
                <h2 className="display-sm mb-5">Shipping details</h2>
                <div className="field-row">
                  <div className="field"><label htmlFor="f-first">First name</label><input id="f-first" required autoComplete="given-name" /></div>
                  <div className="field"><label htmlFor="f-last">Last name</label><input id="f-last" required autoComplete="family-name" /></div>
                </div>
                <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" type="email" required autoComplete="email" /></div>
                <div className="field"><label htmlFor="f-address">Address</label><input id="f-address" required autoComplete="street-address" /></div>
                <div className="field-row">
                  <div className="field"><label htmlFor="f-city">City</label><input id="f-city" required autoComplete="address-level2" /></div>
                  <div className="field"><label htmlFor="f-country">Country</label>
                    <select id="f-country" required autoComplete="country-name" defaultValue="">
                      <option value="">Select…</option><option>India</option><option>United States</option>
                      <option>United Kingdom</option><option>Canada</option><option>Australia</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label style={{ display: "flex", alignItems: "center", gap: ".6em", fontWeight: 500, cursor: "pointer" }}>
                    <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} style={{ width: "auto" }} /> This is a gift — include wrap &amp; inscription card
                  </label>
                </div>
                {gift && (
                  <div className="field">
                    <label htmlFor="f-inscription">Gift inscription</label>
                    <textarea id="f-inscription" rows={2} maxLength={180} placeholder="“May this book be your companion, as it has been mine.”" />
                  </div>
                )}
                <div className="card" style={{ background: "var(--cream)", boxShadow: "none", cursor: "default", padding: "var(--space-4) var(--space-5)", marginBottom: "var(--space-4)" }}>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)", margin: 0 }}>
                    <strong>Payment · demo mode.</strong> This prototype does not collect payment.
                    The production build integrates Razorpay (UPI, cards, netbanking) with hosted
                    payment fields at this step.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                  <button className="btn btn--ghost-light" type="button" onClick={() => goStep(1)}>← Back</button>
                  <button className="btn btn--gold" type="submit" style={{ flex: 1 }}>Place Order (Demo)</button>
                </div>
              </form>
              <div className="card" style={{ cursor: "default" }}>
                <h2 className="display-sm">Summary</h2>
                <Summary />
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && confirm && (
            <div className="certificate" style={{ maxWidth: 700, marginInline: "auto" }}>
              <p className="eyebrow" style={{ justifyContent: "center", color: "var(--gold-bright)" }}>Order Confirmed</p>
              <h2 style={{ fontSize: "var(--text-2xl)" }}>{confirm.first ? `Thank you, ${confirm.first}!` : "Thank you!"}</h2>
              <p style={{ color: "var(--moon-soft)", maxWidth: "46ch", marginInline: "auto" }}>
                This completes the checkout preview{confirm.email ? ` — a confirmation is headed to ${confirm.email}` : ""} —
                reference <strong style={{ color: "var(--gold-bright)" }}>{confirm.ref}</strong>.
                No payment was taken and nothing ships yet; when ordering opens, this is
                where your Gītā&rsquo;s journey to you will begin.
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap", marginTop: "var(--space-5)" }}>
                <Link className="btn btn--gold" href="/course">Start the Free Course While You Wait</Link>
                <Link className="btn btn--ghost-dark" href="/explorer">Read Verses Now</Link>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
