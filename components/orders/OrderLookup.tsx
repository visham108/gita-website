"use client";

/* Order tracking — signed-in customers see their orders automatically (RLS);
   guests look up with order number + email. */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { moneyINR } from "@/lib/commerce";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useStudy } from "@/lib/study/StudyProvider";

interface OrderItem {
  product_id: string;
  title: string;
  qty: number;
  unit_price_paise: number;
}

interface OrderView {
  order_no: number;
  status: string;
  amount_paise: number;
  shipping_paise: number;
  created_at: string;
  paid_at: string | null;
  awb: string | null;
  tracking_url: string | null;
  ship_name: string | null;
  ship_city: string | null;
  order_items: OrderItem[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting payment",
  paid: "Paid — being packed",
  packed: "Packed — awaiting pickup",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function OrderCard({ order }: { order: OrderView }) {
  return (
    <div className="card" style={{ cursor: "default" }}>
      <div className="flex-between mb-4">
        <strong style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)" }}>Order BG-{order.order_no}</strong>
        <span className={"badge" + (["cancelled", "refunded"].includes(order.status) ? "" : " badge--sage")}>
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>
      <table className="summary-table">
        <tbody>
          {order.order_items.map((it) => (
            <tr key={it.product_id}>
              <td>{it.title} × {it.qty}</td>
              <td>{moneyINR(it.unit_price_paise * it.qty)}</td>
            </tr>
          ))}
          <tr><td>Shipping</td><td>{order.shipping_paise === 0 ? "Free" : moneyINR(order.shipping_paise)}</td></tr>
          <tr className="total"><td>Total</td><td>{moneyINR(order.amount_paise)}</td></tr>
        </tbody>
      </table>
      <p className="muted mt-4" style={{ marginBottom: 0 }}>
        Placed {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        {order.ship_city ? ` · ships to ${order.ship_city}` : ""}
        {order.awb ? (
          <>
            {" · AWB "}{order.awb}{" "}
            {order.tracking_url && (
              <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-deep)", fontWeight: 600 }}>
                Track shipment →
              </a>
            )}
          </>
        ) : null}
      </p>
    </div>
  );
}

export default function OrderLookup() {
  const study = useStudy();
  const params = useSearchParams();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [myOrders, setMyOrders] = useState<OrderView[] | null>(null);
  const [lookup, setLookup] = useState<OrderView | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [orderNo, setOrderNo] = useState(params.get("no") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");

  // Signed-in: RLS returns exactly this user's orders.
  useEffect(() => {
    if (!study.user) {
      setMyOrders(null);
      return;
    }
    supabase
      .from("orders")
      .select("order_no, status, amount_paise, shipping_paise, created_at, paid_at, awb, tracking_url, ship_name, ship_city, order_items ( product_id, title, qty, unit_price_paise )")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMyOrders((data as OrderView[]) ?? []));
  }, [study.user, supabase]);

  async function runLookup(no: string, mail: string) {
    setBusy(true);
    setError("");
    setLookup(null);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo: no, email: mail }),
      });
      const j = await res.json();
      if (!res.ok) setError(j.error ?? "Lookup failed.");
      else setLookup(j.order as OrderView);
    } finally {
      setBusy(false);
    }
  }

  // Deep link from the confirmation page: ?no=BG-1001&email=…
  useEffect(() => {
    const no = params.get("no");
    const mail = params.get("email");
    if (no && mail) runLookup(no, mail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main id="main">
      <section className="page-hero" style={{ paddingBottom: "var(--space-6)" }}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Orders</li>
            </ol>
          </nav>
          <h1 style={{ fontSize: "var(--text-2xl)" }}>Your Orders</h1>
          <p className="lede" style={{ marginBottom: 0 }}>
            Track a delivery or review a past order.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          {study.user && myOrders !== null && (
            <div className="stack-4 mb-7">
              <h2 className="display-sm" style={{ margin: 0 }}>Orders on your account</h2>
              {myOrders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet on this account.</p>
                  <Link className="btn btn--gold" href="/book#editions">Browse Editions</Link>
                </div>
              ) : (
                myOrders.map((o) => <OrderCard key={o.order_no} order={o} />)
              )}
            </div>
          )}

          <div className="card" style={{ cursor: "default" }}>
            <h2 className="display-sm">Find an order</h2>
            <p className="muted">Enter the order number from your confirmation and the email you used.</p>
            <form
              className="field-row mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                runLookup(orderNo, email);
              }}
            >
              <div className="field">
                <label htmlFor="lk-no">Order number</label>
                <input id="lk-no" required placeholder="BG-1001" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="lk-email">Email</label>
                <input id="lk-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field" style={{ alignSelf: "end" }}>
                <button className="btn btn--gold" type="submit" disabled={busy}>{busy ? "Searching…" : "Find order"}</button>
              </div>
            </form>
            {error && <p className="muted" style={{ color: "var(--lotus)" }}>{error}</p>}
          </div>

          {lookup && <div className="mt-5"><OrderCard order={lookup} /></div>}
        </div>
      </section>
    </main>
  );
}
