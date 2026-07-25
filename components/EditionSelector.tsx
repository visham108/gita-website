"use client";

/* Bhagavad-gītā edition picker. One product, many editions: choose a language,
   then a binding where more than one exists. Price and features come live from
   the catalog (INR from the DB); add-to-cart targets the specific SKU, which is
   all the cart, checkout, emails and admin need — they key off product id. */

import { useState } from "react";
import Image from "next/image";
import { addToCart, openCartDrawer } from "@/lib/cart";
import { moneyINR } from "@/lib/commerce";
import { useCatalog } from "@/components/CatalogProvider";
import { useToast } from "@/components/Toast";

type Binding = "standard" | "deluxe";

// English and Hindi lead (the flagship editions); the rest run alphabetically.
const LANG_LEAD = ["English", "Hindi"];
function orderLanguages(langs: string[]): string[] {
  const rest = langs.filter((l) => !LANG_LEAD.includes(l)).sort((a, b) => a.localeCompare(b));
  return [...LANG_LEAD.filter((l) => langs.includes(l)), ...rest];
}

export default function EditionSelector() {
  const toast = useToast();
  const catalog = useCatalog();
  const editions = catalog.filter(
    (p) => p.book === "bhagavad-gita" && p.format === "physical" && p.active
  );

  const languages = orderLanguages([...new Set(editions.map((p) => p.language ?? ""))].filter(Boolean));

  const [language, setLanguage] = useState<string>("English");
  const [binding, setBinding] = useState<Binding>("standard");

  if (!editions.length) {
    return <p className="center muted">The catalogue is loading — please refresh in a moment.</p>;
  }

  // Fall back gracefully if the chosen language isn't loaded yet, or the chosen
  // binding doesn't exist for it (only English and Hindi have Deluxe).
  const activeLanguage = languages.includes(language) ? language : languages[0];
  const forLang = editions.filter((p) => p.language === activeLanguage);
  const hasDeluxe = forLang.some((p) => p.binding === "deluxe");
  const activeBinding: Binding = binding === "deluxe" && hasDeluxe ? "deluxe" : "standard";
  const selected = forLang.find((p) => p.binding === activeBinding) ?? forLang[0];
  if (!selected) return null;

  return (
    <div className="edition-selector">
      <div className="edition-selector__cover book-scene" aria-hidden="true">
        <div className="book book--static">
          <Image src="/images/bgaii-cover.jpg" alt="" width={241} height={413} />
        </div>
      </div>

      <div className="edition-selector__panel card">
        {selected.tag && <span className="format-card__badge">{selected.tag}</span>}
        <h3 style={{ fontSize: "var(--text-lg)", margin: "0 0 var(--space-2)" }}>
          Bhagavad-gītā <em>As It Is</em>
        </h3>
        <p className="muted" style={{ margin: "0 0 var(--space-5)" }}>
          {languages.length} languages · standard &amp; deluxe bindings
        </p>

        <label className="field-label" htmlFor="edition-language">Language</label>
        <select
          id="edition-language"
          className="edition-select"
          value={activeLanguage}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {hasDeluxe && (
          <>
            <span className="field-label" style={{ marginTop: "var(--space-4)" }}>Binding</span>
            <div className="edition-bindings" role="group" aria-label="Binding">
              {(["standard", "deluxe"] as Binding[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  className={"chip" + (activeBinding === b ? " is-active" : "")}
                  aria-pressed={activeBinding === b}
                  onClick={() => setBinding(b)}
                >
                  {b === "standard" ? "Standard" : "Deluxe"}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="format-card__price" style={{ marginTop: "var(--space-5)" }}>
          {moneyINR(selected.price_paise)}
        </div>

        <ul className="edition-features">
          {selected.features.map((f) => <li key={f}>{f}</li>)}
        </ul>

        <button
          className="btn btn--gold btn--block"
          type="button"
          onClick={() => {
            addToCart(selected.id);
            toast(`Added to cart — ${selected.type}`);
            openCartDrawer();
          }}
        >
          Add to Cart — {moneyINR(selected.price_paise)}
        </button>
        <p className="muted" style={{ textAlign: "center", margin: "var(--space-3) 0 0", fontSize: "var(--text-xs)" }}>
          Made to order · ships across India
        </p>
      </div>
    </div>
  );
}
