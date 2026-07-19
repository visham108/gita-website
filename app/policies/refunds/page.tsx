import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Refund & Cancellation Policy" };

export default function RefundPolicy() {
  return (
    <PolicyPage title="Refund & Cancellation Policy" updated="July 2026">
      <h2>Cancelling an order</h2>
      <p>
        You may cancel any order free of charge until it ships. Contact us via the{" "}
        <a href="/policies/contact">Contact page</a> with your order number, or reply to your
        confirmation email. Once an order has shipped it can no longer be cancelled, but it
        can be returned (below).
      </p>

      <h2>Returns</h2>
      <p>
        If a book arrives damaged, misprinted, or is not what you ordered, tell us within
        7 days of delivery and we will arrange a replacement or full refund including
        shipping. For change-of-mind returns, contact us within 7 days of delivery: the book
        must be unused and in its original condition, and return shipping is borne by the
        customer.
      </p>

      <h2>How refunds are paid</h2>
      <p>
        Refunds are issued to the original payment method through Razorpay, normally within
        5–7 business days of approval. You will receive an email when the refund is
        initiated.
      </p>
    </PolicyPage>
  );
}
