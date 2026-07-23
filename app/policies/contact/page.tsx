import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <PolicyPage title="Contact Us" updated="July 2026">
      <h2>Orders & support</h2>
      <p>
        Email <a href="mailto:orders@vrnda.store">orders@vrnda.store</a> with your order
        number and we will reply within 1 business day. For delivery status, the{" "}
        <a href="/orders">Orders page</a> has live tracking.
      </p>

      <h2>Business details</h2>
      <p>
        <strong>Visham Singh Rawat</strong><br />
        42/1 Ganesh Nagar, Vadgaon Sheri<br />
        Pune, Maharashtra 411014<br />
        India<br />
        Phone: <a href="tel:+919717348679">+91 97173 48679</a>
      </p>

      <h2>Grievance officer</h2>
      <p>
        <strong>Visham Singh Rawat</strong> ·{" "}
        <a href="mailto:visham.rawat@gmail.com">visham.rawat@gmail.com</a> — per the
        Consumer Protection (E-Commerce) Rules, 2020.
      </p>

      <h2>Bulk & sponsorship</h2>
      <p>
        Up to 10 copies you can order directly on the site. For larger sets — schools,
        libraries, temples, prisons and events — write to{" "}
        <a href="mailto:orders@vrnda.store?subject=Bulk%20order%20enquiry">orders@vrnda.store</a>{" "}
        with &ldquo;Bulk&rdquo; in the subject and we&rsquo;ll quote pricing and shipping for
        your quantity.
      </p>
    </PolicyPage>
  );
}
