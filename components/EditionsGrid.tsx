"use client";

/* Edition/pricing cards from the live catalog. Physical formats add to
   cart; digital formats show as coming soon. Prices in INR from the DB. */

import { addToCart, openCartDrawer } from "@/lib/cart";
import { moneyINR } from "@/lib/commerce";
import { useCatalog } from "@/components/CatalogProvider";
import { useToast } from "@/components/Toast";

export default function EditionsGrid() {
  const toast = useToast();
  const products = useCatalog();

  if (!products.length) {
    return <p className="center muted">The catalog is loading — please refresh in a moment.</p>;
  }

  return (
    <div className="grid-4">
      {products.map((p, i) => {
        const purchasable = p.format === "physical" && p.stock_qty > 0;
        const soldOut = p.format === "physical" && p.stock_qty === 0;
        return (
          <article className="card reveal" data-delay={i || undefined} style={{ position: "relative" }} key={p.id}>
            <div className="format-card">
              {p.tag && <span className="format-card__badge">{p.tag}</span>}
              <span className="format-card__type">{p.type}</span>
              <h3 style={{ fontSize: "var(--text-md)", margin: 0 }}>
                Bhagavad-gītā <em>As It Is</em>
              </h3>
              <div className="format-card__price">{moneyINR(p.price_paise)}</div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {purchasable ? (
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
              ) : (
                <button className="btn btn--ghost-light btn--block" type="button" disabled>
                  {soldOut ? "Out of stock" : "Coming soon"}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
