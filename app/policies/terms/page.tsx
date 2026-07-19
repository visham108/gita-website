import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <PolicyPage title="Terms of Service" updated="July 2026">
      <p>
        This website is operated by <strong>[REGISTERED BUSINESS NAME]</strong>{" "}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;), registered at{" "}
        <strong>[REGISTERED ADDRESS]</strong>. By placing an order you agree to these terms.
      </p>

      <h2>Products and pricing</h2>
      <p>
        All prices are shown in Indian Rupees and include any applicable taxes (printed
        books currently attract 0% GST in India). The price charged is the price shown at
        checkout at the moment of payment. We do our best to keep stock information
        accurate; if an item becomes unavailable after you order, we will refund it in full.
      </p>

      <h2>Orders and payment</h2>
      <p>
        Payment is collected at the time of order through Razorpay. An order is confirmed
        only when payment is verified, at which point you receive an order number and
        confirmation email. Shipping and refunds are governed by our{" "}
        <a href="/policies/shipping">Shipping Policy</a> and{" "}
        <a href="/policies/refunds">Refund &amp; Cancellation Policy</a>.
      </p>

      <h2>Content and study tools</h2>
      <p>
        The Sanskrit text of the Bhagavad-gītā (Devanagari and transliteration) is in the
        public domain. English translations and purports of <em>Bhagavad-gītā As It Is</em>{" "}
        are © The Bhaktivedanta Book Trust. Site content, including original study notes,
        may not be reproduced commercially without permission. Study accounts are free; you
        are responsible for the accuracy of the email address on your account.
      </p>

      <h2>Grievances</h2>
      <p>
        In accordance with the Consumer Protection (E-Commerce) Rules, 2020, complaints may
        be addressed to our grievance officer: <strong>[NAME]</strong>,{" "}
        <strong>[EMAIL]</strong>. We acknowledge complaints within 48 hours and resolve them
        within one month.
      </p>

      <h2>Jurisdiction</h2>
      <p>These terms are governed by the laws of India. Courts at <strong>[CITY]</strong> have exclusive jurisdiction.</p>
    </PolicyPage>
  );
}
