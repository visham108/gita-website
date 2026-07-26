"use client";

/* Checkout — review → details → pay via Razorpay → confirmation.
   The server (/api/checkout) is the source of truth for prices and stock;
   this component displays, collects the address, and drives the widget. */

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cartSubtotalPaise, clearCart, setQty, useCart } from "@/lib/cart";
import { moneyINR, shippingFor } from "@/lib/commerce";
import { useCatalog } from "@/components/CatalogProvider";
import { useToast } from "@/components/Toast";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

interface Confirmation {
  orderNo: string;
  email: string;
  testMode: boolean;
}

export default function Checkout() {
  const toast = useToast();
  const cart = useCart();
  const products = useCatalog();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [gift, setGift] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const entries = Object.entries(cart)
    .map(([id, qty]) => ({ p: products.find((x) => x.id === id), qty }))
    .filter((l): l is { p: NonNullable<typeof l.p>; qty: number } => !!l.p);

  const subtotal = cartSubtotalPaise(cart, products);
  // Count only books still in the catalogue — matches what the server charges.
  const itemCount = entries.reduce((n, l) => n + l.qty, 0);
  const shipping = shippingFor(subtotal, itemCount);
  const total = subtotal + shipping;

  const goStep = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function pay(form: HTMLFormElement) {
    const val = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement | null)?.value?.trim() ?? "";
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only send items still in the catalogue. A cart saved before an
          // edition was withdrawn would otherwise fail server-side on a line
          // the customer can no longer even see in the drawer.
          items: Object.fromEntries(
            Object.entries(cart).filter(([id]) => products.some((p) => p.id === id))
          ),
          customer: {
            name: `${val("f-first")} ${val("f-last")}`.trim(),
            email: val("f-email"),
            phone: val("f-phone"),
            address: val("f-address"),
            city: val("f-city"),
            state: val("f-state"),
            pincode: val("f-pincode"),
            gift,
            giftNote: (form.querySelector("#f-inscription") as HTMLTextAreaElement | null)?.value?.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Could not start the payment — please try again.");
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        toast("Could not load the payment window — check your connection.");
        return;
      }

      const testMode = String(data.keyId).startsWith("rzp_test_");
      if (testMode) toast("Test mode — no real money moves.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amountPaise,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "Bhagavad-gītā As It Is",
        description: `Order ${data.orderNo}`,
        prefill: { name: data.name, email: data.email, contact: data.phone },
        theme: { color: "#9c430b" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const v = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          const vj = await v.json();
          if (v.ok && vj.ok) {
            clearCart();
            setConfirmation({ orderNo: vj.orderNo, email: vj.email, testMode });
            goStep(3);
            /* `pending` means the bank authorised the payment but it is not
               captured yet. The order is real and the cart is done with, so
               the customer should not be alarmed — but we must not promise it
               is settled. The webhook completes it, usually within seconds. */
            toast(
              vj.pending
                ? "Payment authorised — we're confirming it with the bank. Your confirmation email follows shortly."
                : "Payment received. Hare Kṛṣṇa!"
            );
          } else {
            toast("Payment received but confirmation failed — we will reconcile it; note your order number " + data.orderNo);
          }
        },
        modal: {
          ondismiss: () => toast("Payment not completed — your cart is untouched, try again whenever ready."),
        },
      });
      rzp.open();
    } finally {
      setBusy(false);
    }
  }

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
          <p className="lede" style={{ marginBottom: 0 }}>
            UPI, cards, netbanking and wallets — handled securely by Razorpay.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 1020 }}>
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
                  {entries.length === 0 ? (
                    <div className="empty-state">
                      <p>Your cart is empty.</p>
                      <Link className="btn btn--gold" href="/book#editions">Choose an Edition</Link>
                    </div>
                  ) : (
                    entries.map(({ p, qty }) => (
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
                          <div className="cart-item__price">{moneyINR(p.price_paise * qty)}</div>
                          <button className="cart-item__remove" type="button" onClick={() => setQty(p.id, 0)}>Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="card" style={{ cursor: "default" }}>
                <h2 className="display-sm">Summary</h2>
                <table className="summary-table mt-4">
                  <tbody>
                    <tr><td>Subtotal</td><td>{moneyINR(subtotal)}</td></tr>
                    <tr><td>Shipping</td><td>{shipping === 0 ? "Free" : moneyINR(shipping)}</td></tr>
                    <tr className="total"><td>Total</td><td>{moneyINR(total)}</td></tr>
                  </tbody>
                </table>
                <button
                  className="btn btn--gold btn--block mt-5"
                  type="button"
                  disabled={entries.length === 0}
                  onClick={() => goStep(2)}
                >
                  Continue to Details
                </button>
                <Link className="link-arrow mt-4" href="/book#editions" style={{ justifyContent: "center", display: "flex" }}>← Continue shopping</Link>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS + PAY */}
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
                  if (!entries.length) {
                    toast("Your cart is empty — add an edition first.");
                    goStep(1);
                    return;
                  }
                  pay(form);
                }}
              >
                <h2 className="display-sm mb-5">Shipping details</h2>
                <div className="field-row">
                  <div className="field"><label htmlFor="f-first">First name</label><input id="f-first" required autoComplete="given-name" /></div>
                  <div className="field"><label htmlFor="f-last">Last name</label><input id="f-last" required autoComplete="family-name" /></div>
                </div>
                <div className="field-row">
                  <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" type="email" required autoComplete="email" /></div>
                  <div className="field"><label htmlFor="f-phone">Phone (for delivery updates)</label><input id="f-phone" type="tel" required pattern="[0-9+ -]{10,14}" autoComplete="tel" /></div>
                </div>
                <div className="field"><label htmlFor="f-address">Address</label><input id="f-address" required autoComplete="street-address" /></div>
                <div className="field-row">
                  <div className="field"><label htmlFor="f-city">City</label><input id="f-city" required autoComplete="address-level2" /></div>
                  <div className="field"><label htmlFor="f-state">State</label><input id="f-state" required autoComplete="address-level1" /></div>
                </div>
                <div className="field-row">
                  <div className="field"><label htmlFor="f-pincode">PIN code</label><input id="f-pincode" required pattern="[0-9]{6}" inputMode="numeric" autoComplete="postal-code" /></div>
                  <div className="field" style={{ justifyContent: "end" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: ".6em", fontWeight: 500, cursor: "pointer" }}>
                      {/* Sized in globals.css, not inline: an inline width beats
                          any stylesheet rule, which stopped the touch-target
                          styles from enlarging it on phones. */}
                      <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} /> This is a gift
                    </label>
                  </div>
                </div>
                {gift && (
                  <div className="field">
                    <label htmlFor="f-inscription">Gift inscription</label>
                    <textarea id="f-inscription" rows={2} maxLength={180} placeholder="“May this book be your companion, as it has been mine.”" />
                  </div>
                )}
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                  <button className="btn btn--ghost-light" type="button" onClick={() => goStep(1)}>← Back</button>
                  <button className="btn btn--gold" type="submit" style={{ flex: 1 }} disabled={busy}>
                    {busy ? "Opening secure payment…" : `Pay ${moneyINR(total)}`}
                  </button>
                </div>
              </form>
              <div className="card" style={{ cursor: "default" }}>
                <h2 className="display-sm">Summary</h2>
                <table className="summary-table mt-4">
                  <tbody>
                    <tr><td>Subtotal</td><td>{moneyINR(subtotal)}</td></tr>
                    <tr><td>Shipping</td><td>{shipping === 0 ? "Free" : moneyINR(shipping)}</td></tr>
                    <tr className="total"><td>Total</td><td>{moneyINR(total)}</td></tr>
                  </tbody>
                </table>
                <div className="mt-5" style={{ display: "grid", gap: ".6rem", fontSize: "var(--text-xs)", color: "var(--ink-faint)" }}>
                  <span>Payments processed by Razorpay — cards, UPI, netbanking, wallets.</span>
                  <span>We never see or store your card details.</span>
                  <span>Every order supports the distribution of spiritual literature.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && confirmation && (
            <div className="certificate" style={{ maxWidth: 700, marginInline: "auto" }}>
              <p className="eyebrow" style={{ justifyContent: "center", color: "var(--gold-bright)" }}>Order Confirmed</p>
              <h2 style={{ fontSize: "var(--text-2xl)" }}>Thank you!</h2>
              <p style={{ color: "var(--moon-soft)", maxWidth: "46ch", marginInline: "auto" }}>
                Payment received for order{" "}
                <strong style={{ color: "var(--gold-bright)" }}>{confirmation.orderNo}</strong>
                {" "}— a confirmation is on its way to {confirmation.email}. We pack with care and
                ship promptly; tracking follows by email.
                {confirmation.testMode && (
                  <em style={{ display: "block", marginTop: "1em", color: "var(--moon-faint)" }}>
                    (Test mode — this was a simulated payment; no money moved.)
                  </em>
                )}
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap", marginTop: "var(--space-5)" }}>
                <Link className="btn btn--gold" href={`/orders?no=${encodeURIComponent(confirmation.orderNo)}&email=${encodeURIComponent(confirmation.email)}`}>Track Your Order</Link>
                <Link className="btn btn--ghost-dark" href="/course">Join the Free Live Course</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
