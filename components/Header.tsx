"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cartCount, useCart } from "@/lib/cart";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/book", label: "The Book" },
  { href: "/explorer", label: "Verse Explorer" },
  { href: "/course", label: "Reading Plan" },
  { href: "/resources", label: "Resources" },
  { href: "/account", label: "My Study" },
];

export default function Header({ onCartOpen }: { onCartOpen: () => void }) {
  const pathname = usePathname();
  const cart = useCart();
  const count = cartCount(cart);
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setNavOpen(false), [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={"site-header site-header--dark" + (scrolled ? " is-scrolled" : "")}>
        <div className="container container--wide site-header__inner">
          <Link className="brand" href="/" aria-label="Bhagavad-gītā As It Is — home">
            <span className="brand__mark">
              <Image src="/images/prabhupada-badge.png" alt="Śrīla Prabhupāda" width={125} height={125} priority />
            </span>
            <span>
              Bhagavad-gītā <em style={{ fontStyle: "italic" }}>As It Is</em>
              <span className="brand__sub">Śrīla Prabhupāda</span>
            </span>
          </Link>
          <nav className={"nav" + (navOpen ? " is-open" : "")} id="site-nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="icon-btn" href="/account" aria-label="My account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6" /><path d="M5 20c1.3-3.4 3.8-5 7-5s5.7 1.6 7 5" /></svg>
            </Link>
            <button className="icon-btn" type="button" onClick={onCartOpen} aria-label="Open cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2.2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.2L20 8H6" /></svg>
              <span className="cart-count" {...(count === 0 ? { "data-zero": "" } : {})}>
                {count > 0 ? String(count) : ""}
              </span>
            </button>
            <button
              className="icon-btn nav-toggle"
              type="button"
              aria-expanded={navOpen}
              aria-controls="site-nav"
              aria-label="Menu"
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
