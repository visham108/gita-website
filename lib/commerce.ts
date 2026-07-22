/* Commerce configuration + money helpers.
   All amounts are integers in paise. The client renders these; the SERVER
   recomputes them — client-supplied prices are never trusted. */

/* Shipping is FREE on every order — the courier cost is absorbed into the book
   price rather than charged separately. To start charging again, set
   SHIPPING_FLAT_PAISE to the amount (e.g. 4900 for ₹49) and, if you want a
   free-over-X tier, set FREE_SHIPPING_THRESHOLD_PAISE above 0. The customer-
   facing copy in CartDrawer and the shipping policy reads from these, so it
   follows automatically. */
export const SHIPPING_FLAT_PAISE = 0;
export const FREE_SHIPPING_THRESHOLD_PAISE = 0;

export function shippingFor(subtotalPaise: number): number {
  if (subtotalPaise === 0 || SHIPPING_FLAT_PAISE === 0) return 0;
  return FREE_SHIPPING_THRESHOLD_PAISE > 0 && subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE
    ? 0
    : SHIPPING_FLAT_PAISE;
}

/** True when nothing is ever charged for delivery — lets the UI say "free
    shipping" plainly instead of quoting a threshold that doesn't exist. */
export const SHIPPING_IS_FREE = SHIPPING_FLAT_PAISE === 0;

/* Any order whose payment was captured can be refunded, INCLUDING after it has
   shipped or been delivered — that is precisely when most refund requests
   arrive (the customer has the book in hand and wants to return it). Only
   'pending' (nothing captured) and 'refunded' (already done) are excluded.
   Shared so the API guard, the webhook and the dashboard can't drift apart. */
export const REFUNDABLE_STATUSES = ["paid", "packed", "shipped", "delivered", "cancelled"] as const;

export function isRefundable(status: string): boolean {
  return (REFUNDABLE_STATUSES as readonly string[]).includes(status);
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

/** ₹ formatting from paise: whole rupees stay clean (₹399), fractions show. */
export function moneyINR(paise: number): string {
  const rupees = paise / 100;
  return Number.isInteger(rupees) ? inr.format(rupees) : inrPrecise.format(rupees);
}

export interface DbProduct {
  id: string;
  type: string;
  title: string;
  price_paise: number;
  tag: string | null;
  features: string[];
  format: "physical" | "digital";
  active: boolean;
  stock_qty: number;
  /** false = made to order: stock never gates the sale, never moves. */
  track_stock: boolean;
}

/** Can a customer buy this right now? Digital is not on sale yet; tracked
    products need stock; made-to-order products are always available. */
export function isPurchasable(p: DbProduct): boolean {
  if (!p.active || p.format !== "physical") return false;
  return p.track_stock ? p.stock_qty > 0 : true;
}

/** Only true for a tracked product that has actually run out — a made-to-order
    product is never "sold out". */
export function isSoldOut(p: DbProduct): boolean {
  return p.active && p.format === "physical" && p.track_stock && p.stock_qty <= 0;
}
