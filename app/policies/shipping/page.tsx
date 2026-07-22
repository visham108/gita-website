import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { moneyINR, FREE_SHIPPING_THRESHOLD_PAISE, SHIPPING_FLAT_PAISE, SHIPPING_IS_FREE } from "@/lib/commerce";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicy() {
  return (
    <PolicyPage title="Shipping Policy" updated="July 2026">
      <h2>Where we ship</h2>
      <p>We currently ship across India. International shipping is planned for a future release.</p>

      <h2>Charges</h2>
      {SHIPPING_IS_FREE ? (
        <p>
          Shipping is <strong>free on every order</strong> — the delivery cost is included in
          the price of the book. The total you see at checkout is the total you pay; there are
          no charges added at the end.
        </p>
      ) : (
        <p>
          Shipping is a flat {moneyINR(SHIPPING_FLAT_PAISE)} per order
          {FREE_SHIPPING_THRESHOLD_PAISE > 0 && <>, and free for orders of{" "}
          {moneyINR(FREE_SHIPPING_THRESHOLD_PAISE)} or more</>}. The exact charge is always
          shown at checkout before you pay.
        </p>
      )}

      <h2>Timelines</h2>
      <p>
        Orders are packed and handed to the courier within 2 business days of payment.
        Delivery typically takes 3–7 business days depending on your location. You will
        receive a tracking link by email as soon as your order ships, and you can check
        status any time on the <a href="/orders">Orders page</a>.
      </p>

      <h2>Damaged or lost parcels</h2>
      <p>
        Books are packed to survive the journey. If your parcel arrives damaged or does not
        arrive at all, contact us within 7 days of the expected delivery date via the{" "}
        <a href="/policies/contact">Contact page</a> and we will send a replacement or a full
        refund — your choice.
      </p>
    </PolicyPage>
  );
}
