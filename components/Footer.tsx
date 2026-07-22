"use client";

import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/Toast";

export default function Footer() {
  const toast = useToast();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <p className="footer-brandline">
              <Image src="/images/prabhupada-badge.png" alt="" width={125} height={125} />
              <span>Bhagavad-gītā <em>As It Is</em></span>
            </p>
            <p>The world&rsquo;s most widely read edition of the timeless classic — complete with the original Sanskrit, word-for-word meanings, translations and full purports by His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda.</p>
          </div>
          <div>
            <h4>Discover</h4>
            <ul>
              <li><Link href="/book">About the Book</Link></li>
              <li><Link href="/explorer">Verse Explorer</Link></li>
              <li><Link href="/course">Reading Plan</Link></li>
              <li><Link href="/resources">Resource Library</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get the Book</h4>
            <ul>
              <li><Link href="/book#editions">Hardcover</Link></li>
              <li><Link href="/book#editions">Paperback</Link></li>
              <li><Link href="/orders">Track Your Order</Link></li>
              <li><Link href="/policies/shipping">Shipping Policy</Link></li>
              <li><Link href="/policies/refunds">Refunds &amp; Cancellation</Link></li>
            </ul>
          </div>
          <div>
            <h4>Study</h4>
            <ul>
              <li><Link href="/account">My Study</Link></li>
              <li><Link href="/account#plans">Reading Plans</Link></li>
              <li><Link href="/book#faq">FAQ</Link></li>
              <li><Link href="/resources">Lectures &amp; Articles</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            Bhagavad-gītā As It Is © Bhaktivedanta Book Trust; verse study renderings are placeholders pending BBT license.{" "}
            <Link href="/policies/terms">Terms</Link> · <Link href="/policies/privacy">Privacy</Link> · <Link href="/policies/contact">Contact</Link>
          </p>
          <label>
            <span className="visually-hidden">Language</span>
            <select
              className="lang-select"
              defaultValue="English"
              onChange={() => toast("Full localization ships with the production build — 89 languages planned.")}
            >
              <option>English</option><option>हिन्दी</option><option>Español</option>
              <option>Português</option><option>Русский</option><option>中文</option>
            </select>
          </label>
        </div>
      </div>
    </footer>
  );
}
