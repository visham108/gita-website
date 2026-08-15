"use client";

/* Real sign-up form — posts to /api/signup, which stores the row and sends a
   confirmation. Replaces the old DemoForm, which only fired a toast. */

import { useState } from "react";
import { useToast } from "@/components/Toast";
import { trackLead } from "@/components/MetaPixel";

export default function SignupForm({
  kind,
  idPrefix,
  placeholder,
  cta,
  withName = false,
  dark = false,
}: {
  kind: "course";
  idPrefix: string;
  placeholder: string;
  cta: string;
  /** Ask for a name too — worth it when a teacher will be greeting people. */
  withName?: boolean;
  /** Sitting on a dark panel: labels and helper text need light colours. */
  dark?: boolean;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (id: string) =>
      (form.querySelector(`#${id}`) as HTMLInputElement | null)?.value?.trim() ?? "";

    setBusy(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          email: val(`${idPrefix}-email`),
          name: withName ? val(`${idPrefix}-name`) : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(json.error ?? "Something went wrong — please try again.");
        return;
      }
      /* Only a genuinely new row is a conversion. Re-submitting an address that
         is already on the list creates nothing and sends nothing, so counting
         it would teach the ad campaign to chase people it already has. */
      if (!json.alreadySubscribed) trackLead();
      toast(json.message ?? "You're signed up.");
      setDone(true);
      form.reset();
    } catch {
      toast("Network problem — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p
        style={{
          margin: 0,
          fontWeight: 650,
          color: dark ? "var(--gold-bright)" : "var(--gold-deep)",
        }}
      >
        ✓ You&rsquo;re on the list — check your inbox.
      </p>
    );
  }

  return (
    <form className={withName ? "signup-form" : "input-inline"} style={{ marginInline: "auto" }} onSubmit={submit}>
      {withName && (
        <>
          <label className="visually-hidden" htmlFor={`${idPrefix}-name`}>Your name</label>
          <input id={`${idPrefix}-name`} type="text" autoComplete="name" placeholder="Your name (optional)" />
        </>
      )}
      <label className="visually-hidden" htmlFor={`${idPrefix}-email`}>Email address</label>
      <input id={`${idPrefix}-email`} type="email" required autoComplete="email" placeholder={placeholder} />
      <button className="btn btn--gold" type="submit" disabled={busy}>
        {busy ? "Signing up…" : cta}
      </button>
    </form>
  );
}
