"use client";

import { useState } from "react";
import Link from "next/link";

/* A confirm button, not an automatic opt-out on page load.

   Mail clients and security scanners routinely GET every link in a message to
   pre-render or check it. If merely opening the URL unsubscribed you, a
   scanner would quietly remove people who never asked. The action therefore
   needs a POST the person has to click. */
export default function UnsubscribeForm({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");

  if (!id)
    return (
      <p>
        That link is incomplete. Reply to any of our emails and we&apos;ll take you off the
        list by hand.
      </p>
    );

  if (state === "done")
    return (
      <>
        <p><strong>Done — you&apos;re unsubscribed.</strong> You won&apos;t hear from us about the course again.</p>
        <p style={{ color: "var(--ink-soft)" }}>
          Order confirmations and shipping updates are separate, and still arrive for
          anything you buy.
        </p>
        <p><Link href="/" className="btn btn--gold">Back to the site</Link></p>
      </>
    );

  return (
    <>
      <p>Confirm you&apos;d like to stop receiving emails about the free live course.</p>
      <p>
        <button
          type="button"
          className="btn btn--gold"
          disabled={state === "working"}
          onClick={async () => {
            setState("working");
            try {
              const res = await fetch("/api/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
              });
              setState(res.ok ? "done" : "error");
            } catch {
              setState("error");
            }
          }}
        >
          {state === "working" ? "Unsubscribing…" : "Unsubscribe me"}
        </button>
      </p>
      {state === "error" && (
        <p role="alert" style={{ color: "var(--flame)" }}>
          That didn&apos;t go through. Try once more, or reply to any of our emails and
          we&apos;ll remove you by hand.
        </p>
      )}
    </>
  );
}
