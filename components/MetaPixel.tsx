"use client";

/* Meta (Facebook) Pixel.

   Exists for one reason: the ad campaign optimises toward whoever is likely to
   sign up, and it can only learn that if sign-ups are reported back. Without a
   conversion signal Meta optimises for link clicks, which is a proxy that costs
   money and buys the wrong people.

   Loads only when NEXT_PUBLIC_META_PIXEL_ID is set. Unset, this renders nothing
   and trackLead() is a no-op, so a build without the ID carries no tracker at
   all — same contract as RESEND_API_KEY on the email side.

   NOTE: NEXT_PUBLIC_* is inlined at BUILD time, not read at runtime. Setting it
   as a Worker secret does nothing; it has to be present when `next build` runs.

   Deliberately minimal: PageView and Lead only. No Advanced Matching, so no
   email address — hashed or otherwise — is ever handed to Meta. Everything this
   sends is described in the privacy policy; extending it means updating that
   page in the same change. */

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void };
    _fbq?: unknown;
  }
}

/** Fires the Lead conversion. Safe to call when the pixel is absent or still
    loading — fbq queues calls made before the script finishes, and when no
    pixel is configured this does nothing at all. */
export function trackLead(): void {
  if (!PIXEL_ID) return;
  try {
    window.fbq?.("track", "Lead");
  } catch {
    /* Ad blockers remove fbq entirely. A blocked tracker must never break a
       sign-up that has already succeeded. */
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  /* The base snippet fires the first PageView itself. Without this guard the
     landing page would report two. */
  const firstRender = useRef(true);

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    /* Next.js navigates without a document load, so the pixel would otherwise
       only ever see the page someone arrived on. */
    try {
      window.fbq?.("track", "PageView");
    } catch {
      /* blocked — nothing to do */
    }
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(PIXEL_ID)});
fbq('track', 'PageView');
        `.trim(),
      }}
    />
  );
}
