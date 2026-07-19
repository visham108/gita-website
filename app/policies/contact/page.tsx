import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <PolicyPage title="Contact Us" updated="July 2026">
      <h2>Orders & support</h2>
      <p>
        Email <strong>[SUPPORT EMAIL]</strong> with your order number and we will reply
        within 1 business day. For delivery status, the{" "}
        <a href="/orders">Orders page</a> has live tracking.
      </p>

      <h2>Business details</h2>
      <p>
        <strong>[REGISTERED BUSINESS NAME]</strong><br />
        <strong>[REGISTERED ADDRESS]</strong><br />
        Phone: <strong>[PHONE]</strong>
      </p>

      <h2>Grievance officer</h2>
      <p>
        <strong>[NAME]</strong> · <strong>[EMAIL]</strong> — per the Consumer Protection
        (E-Commerce) Rules, 2020.
      </p>

      <h2>Bulk & sponsorship</h2>
      <p>
        For sets for schools, libraries, prisons and events (10–10,000 copies), write to{" "}
        <strong>[SUPPORT EMAIL]</strong> with &ldquo;Bulk&rdquo; in the subject.
      </p>
    </PolicyPage>
  );
}
