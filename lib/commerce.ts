/* Commerce configuration + money helpers.
   All amounts are integers in paise. The client renders these; the SERVER
   recomputes them — client-supplied prices are never trusted. */

export const SHIPPING_FLAT_PAISE = 4900;        // ₹49 flat shipping
export const FREE_SHIPPING_THRESHOLD_PAISE = 49900; // free at ₹499+

export function shippingFor(subtotalPaise: number): number {
  if (subtotalPaise === 0) return 0;
  return subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : SHIPPING_FLAT_PAISE;
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
}
