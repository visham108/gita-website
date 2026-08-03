import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nothing gained by announcing the framework and its version to scanners.
  poweredByHeader: false,

  /* No Cloudflare Images binding is configured, so the /_next/image route
     already can't resize anything — it just fetches the original file and
     passes it straight through. Skipping that route entirely means one fewer
     Worker invocation per <Image>, which matters on the Workers CPU-time cap. */
  images: { unoptimized: true },

  // Old static-site URLs (*.html) permanently redirect to their new routes so
  // existing links, bookmarks and search results keep working.
  async redirects() {
    const pages = ["book", "course", "resources", "account", "checkout"];
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...pages.map((p) => ({
        source: `/${p}.html`,
        destination: `/${p}`,
        permanent: true,
      })),
      /* The Verse Explorer was removed — VedaBase does that job better, and
         hosting the text without a licence meant no translation. Old links,
         bookmarks and search results land on the course instead of a 404. */
      { source: "/explorer", destination: "/course", permanent: true },
      { source: "/explorer.html", destination: "/course", permanent: true },
      /* The reading-plan PDF was reframed as a study companion when the
         self-study plan came off the site. Anyone holding the old link keeps
         getting the file. */
      {
        source: "/downloads/gita-reading-plan.pdf",
        destination: "/downloads/gita-study-companion.pdf",
        permanent: true,
      },
    ];
  },

  /* Security headers. The site had none — no clickjacking protection, no
     MIME-sniffing protection, no referrer policy.

     The CSP is deliberately Report-Only for now. This site takes real money
     through Razorpay's widget, and an over-tight policy would break checkout
     silently; report-only lets us see what it *would* block before enforcing.
     Switch the header name to "Content-Security-Policy" once the reports are
     clean. */
  async headers() {
    const csp = [
      "default-src 'self'",
      /* Next.js injects inline bootstrap scripts; Razorpay's widget is remote.
         cdn.razorpay.com is required too — checkout.js pulls their risk-detection
         bundle from it, which a report-only run caught being blocked. */
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // Supabase (auth + data) and Razorpay (order creation) are called from the browser.
      "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://cdn.razorpay.com",
      // Razorpay renders its payment sheet in an iframe it owns.
      "frame-src https://api.razorpay.com https://checkout.razorpay.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
