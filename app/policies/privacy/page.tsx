import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy" updated="August 2026">
      <h2>What we collect</h2>
      <p>
        <strong>Orders:</strong> your name, email, phone number and shipping address — the
        minimum needed to deliver books and send order updates.{" "}
        <strong>Accounts (optional):</strong> your email, and your name if you give one.{" "}
        <strong>Course sign-ups:</strong> your email, and your name if you give one.{" "}
        <strong>Payments:</strong> handled entirely by Razorpay; we never see or store your
        card, UPI or banking details.
      </p>

      <h2>What we do with it</h2>
      <p>
        Fulfil orders, run your account, and send the emails you ask for (order updates;
        course announcements if you sign up). We do not sell your data,
        and we share it only with the services that make the site work.
      </p>

      <h2>Who processes it for us</h2>
      <ul>
        <li><strong>Cloudflare</strong> — hosts and serves the site. All traffic passes through it, and it keeps standard request logs and aggregate traffic counts.</li>
        <li><strong>Supabase</strong> — the database and sign-in system. Orders, sign-ups and account details are stored here.</li>
        <li><strong>Razorpay</strong> — takes the payment. Card, UPI and banking details go to them directly and never reach us.</li>
        <li><strong>Resend</strong> — delivers our email, so it handles your address and the message contents.</li>
        <li><strong>Shipping carriers</strong> — receive your name, address and phone, for delivery only.</li>
        <li>
          <strong>Meta (Facebook)</strong> — we advertise the free session on Facebook and
          Instagram, and the Meta Pixel on this site reports back which pages were viewed
          and whether a course sign-up was completed, so the advertising reaches people
          likely to be interested. It receives the page address, your IP address and
          browser details. Where you enter details into the course sign-up form, the pixel
          also sends Meta a <em>scrambled</em> (one-way hashed) version of your email
          address and name, which Meta uses to tell whether you are the same person who
          saw the advertisement. We never send your details to Meta in readable form.
          {" "}
          <strong>
            The pixel does not run on checkout, your orders, or your account
          </strong>{" "}
          — nothing you type when buying a book, including your address and phone number,
          is seen by it.
        </li>
      </ul>
      <p>
        Apart from that advertising measurement, we run no third-party analytics on
        this site. We do not sell your data to anyone.
      </p>

      <h2>How long we keep it</h2>
      <p>
        <strong>Orders</strong> are kept for as long as tax and accounting rules require,
        which is at least six years. <strong>Sign-up records</strong> are kept until you
        unsubscribe, at which
        point the record is deleted outright. <strong>Account details</strong> are kept for
        as long as your account exists, and go when the account goes.
      </p>

      <h2>Your data, your rights</h2>
      <p>
        Whatever is stored against your account is private to it — it is technically
        impossible for other users to read it. You may request a copy or deletion of everything we hold about you
        at any time via the <a href="/policies/contact">Contact page</a>; deletion is
        permanent and completed within 30 days. Order records we are legally required to
        retain are the one exception, and we will tell you if that applies.
      </p>

      <h2>Email you can stop</h2>
      <p>
        Every course email carries an unsubscribe link, and one click ends
        it — no account or reply needed. Order confirmations and shipping updates are
        separate: they relate to something you bought, so they keep arriving for as long as
        the order is live.
      </p>

      <h2>Cookies and what is stored on your device</h2>
      <p>
        We set one <strong>cookie of our own</strong>, and only when you sign in: the
        session that keeps you signed in.
      </p>
      <p>
        The <strong>Meta Pixel</strong> described above also sets its own cookies, which
        it uses to recognise a browser across visits and to measure whether an
        advertisement led to a sign-up. Blocking third-party cookies in your browser, or
        using any of the common ad-blocking extensions, stops the pixel loading and has
        no effect on your ability to sign up, order, or use any part of this site.
      </p>
      <p>
        Your <strong>cart</strong> is held in your browser&apos;s local storage rather than in
        a cookie. That means it stays on your own device and is never sent to us until you
        place an order. Clearing your browser data clears it.
      </p>
    </PolicyPage>
  );
}
