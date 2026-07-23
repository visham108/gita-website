/* Commerce configuration + money helpers.
   All amounts are integers in paise. The client renders these; the SERVER
   recomputes them — client-supplied prices are never trusted. */

/* Shipping is charged by QUANTITY, which for a single-SKU shop is the same as
   charging by weight: one hardcover is ~1kg, and chargeable weight scales with
   how many go in the box. A second book adds weight to the same parcel, so it
   costs less than the first — hence a base rate plus a smaller per-extra rate.

   Numbers are set from published 2026 surface rate cards (Shiprocket/DTDC
   class), where 1kg runs roughly ₹40–60 local, ₹60–95 metro-to-metro and
   ₹95–150 for the rest of India. A hardcover plus packaging bills in the
   1–1.5kg slab. ₹79 sits mid-range: it over-recovers on nearby deliveries and
   under-recovers on far ones (the north-east and J&K can reach ₹150+), which
   averages out and keeps one honest number on the page instead of a
   pincode-by-pincode quote.

   To go free again, set SHIPPING_FIRST_ITEM_PAISE to 0. To add a free-over-X
   tier, set FREE_SHIPPING_THRESHOLD_PAISE above 0 — but keep it BELOW a
   realistic order value, or it advertises a discount nobody can reach. */
/* Typed as `number`, not the literal, so setting any of these to 0 stays a
   valid one-line change instead of a type error. */
export const SHIPPING_FIRST_ITEM_PAISE: number = 7900;   // ₹79 — first book
export const SHIPPING_EXTRA_ITEM_PAISE: number = 3900;   // ₹39 — each additional book
export const FREE_SHIPPING_THRESHOLD_PAISE: number = 0;  // 0 = no free tier

/** Largest quantity of one edition a customer may buy self-serve. Set at 10
    deliberately: the per-extra-copy shipping rate is a parcel rate, and beyond
    about ten copies the real courier cost outruns it — a 20-copy order would
    cost the seller several hundred rupees out of pocket. Above this we route
    the customer to a direct enquiry so the shipment can be quoted properly. */
export const MAX_ITEM_QTY = 10;

/** Where bulk enquiries go. Kept next to the cap so the two never disagree. */
export const BULK_ENQUIRY_EMAIL = "orders@vrnda.store";

/** Total delivery charge. `itemCount` is the number of physical books, not the
    number of distinct products — two copies weigh twice as much as one. */
export function shippingFor(subtotalPaise: number, itemCount: number): number {
  if (subtotalPaise === 0 || itemCount <= 0) return 0;
  if (SHIPPING_FIRST_ITEM_PAISE === 0) return 0;
  if (FREE_SHIPPING_THRESHOLD_PAISE > 0 && subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) return 0;
  return SHIPPING_FIRST_ITEM_PAISE + Math.max(0, itemCount - 1) * SHIPPING_EXTRA_ITEM_PAISE;
}

/** True when nothing is ever charged for delivery — lets the UI say "free
    shipping" plainly instead of quoting a threshold that doesn't exist. */
export const SHIPPING_IS_FREE = SHIPPING_FIRST_ITEM_PAISE === 0;

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
