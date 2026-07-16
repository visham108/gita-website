import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { ToastProvider } from "@/components/Toast";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bhagavad-gītā As It Is — The Timeless Classic by Śrīla Prabhupāda",
    template: "%s — Bhagavad-gītā As It Is",
  },
  description:
    "Discover Bhagavad-gītā As It Is by His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda — the world's most widely read edition of the Gītā. Read the verse of the day, study all 18 chapters, and get your copy.",
  icons: { icon: "/images/prabhupada-badge.png", apple: "/images/prabhupada-badge.png" },
  openGraph: {
    siteName: "Bhagavad-gītā As It Is",
    type: "website",
    images: ["/images/og-card.png"],
  },
  twitter: { card: "summary_large_image" },
};

const PRELOAD_FONTS = [
  "/fonts/fraunces-latin-normal.woff2",
  "/fonts/fraunces-latin-ext-normal.woff2",
  "/fonts/inter-latin-normal.woff2",
  "/fonts/tiro-devanagari-normal.woff2",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below intentionally adds the
    // "js" class to <html> before hydration (reveal-on-scroll gate).
    <html lang="en" suppressHydrationWarning>
      <body>
        {PRELOAD_FONTS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        {/* reveal-on-scroll is gated on html.js so content is never hidden without JS */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <ToastProvider>
          <SiteChrome />
          {children}
          <Footer />
        </ToastProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
