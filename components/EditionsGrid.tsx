"use client";

/* The edition/pricing cards (shared by home and book pages) — port of
   Site.renderProducts. Add to Cart updates the store, toasts, and slides
   the drawer open. */

import { PRODUCTS } from "@/lib/data";
import { addToCart, money, openCartDrawer } from "@/lib/cart";
import { useToast } from "@/components/Toast";

export default function EditionsGrid() {
  const toast = useToast();

  return (
    <div className="grid-4">
      {PRODUCTS.map((p, i) => (
        <article className="card reveal" data-delay={i || undefined} style={{ position: "relative" }} key={p.id}>
          <div className="format-card">
            {p.tag && <span className="format-card__badge">{p.tag}</span>}
            <span className="format-card__type">{p.type}</span>
            <h3 style={{ fontSize: "var(--text-md)", margin: 0 }}>
              Bhagavad-gītā <em>As It Is</em>
            </h3>
            <div className="format-card__price">
              {money(p.price)} <small>USD</small>
            </div>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              className="btn btn--gold btn--block"
              type="button"
              onClick={() => {
                addToCart(p.id);
                toast(`Added to cart — ${p.type}`);
                openCartDrawer();
              }}
            >
              Add to Cart
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
