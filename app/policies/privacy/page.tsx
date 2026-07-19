import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy" updated="July 2026">
      <h2>What we collect</h2>
      <p>
        <strong>Orders:</strong> your name, email, phone number and shipping address — the
        minimum needed to deliver books and send order updates.{" "}
        <strong>Accounts (optional):</strong> your email, and the study data you create —
        bookmarks, highlights, reflections, course progress and reading plan.{" "}
        <strong>Payments:</strong> handled entirely by Razorpay; we never see or store your
        card, UPI or banking details.
      </p>

      <h2>What we do with it</h2>
      <p>
        Fulfil orders, provide the study features, and send the emails you ask for
        (order updates; a weekly verse if you subscribe). We do not sell or share your data
        with anyone except the services that make the site work: Razorpay (payments),
        Supabase (secure data storage), and our shipping carriers (name, address and phone,
        for delivery only).
      </p>

      <h2>Your data, your rights</h2>
      <p>
        Your study data is private to your account — it is technically impossible for other
        users to read it. You may request a copy or deletion of everything we hold about you
        at any time via the <a href="/policies/contact">Contact page</a>; deletion is
        permanent and completed within 30 days.
      </p>

      <h2>Cookies</h2>
      <p>
        We use only functional cookies: your session when signed in, and your cart. No
        advertising trackers, no third-party analytics cookies.
      </p>
    </PolicyPage>
  );
}
