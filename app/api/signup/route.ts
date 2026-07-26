import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { adminEmails } from "@/lib/admin";
import {
  sendEmail, courseSignupEmail, signupAlertEmail,
  unsubscribeUrl, unsubscribePostUrl,
} from "@/lib/email";
import { readJsonObject } from "@/lib/http";

/** Free-course interest.

    Public and unauthenticated, so it is deliberately narrow: only one list name
    is accepted, and the (kind, email) unique constraint means a repeated submit
    inserts nothing and — importantly — sends nothing. That stops the same
    address being used to pump out mail.

    A "newsletter" list used to live here too. It was removed: nothing ever sent
    the weekly verse it promised, and a subscription that never arrives earns
    spam complaints against the domain that also carries order confirmations. */

const KINDS = ["course"] as const;
type Kind = (typeof KINDS)[number];

function isKind(v: unknown): v is Kind {
  return typeof v === "string" && (KINDS as readonly string[]).includes(v);
}

export async function POST(request: Request) {
  const body = await readJsonObject<{ kind?: unknown; email?: unknown; name?: unknown }>(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  if (!isKind(body.kind))
    return NextResponse.json({ error: "Unknown list" }, { status: 400 });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200)
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  const name =
    typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 80) : null;

  const admin = supabaseAdmin();
  // ignoreDuplicates: an existing signup returns zero rows, which is how we
  // know not to re-send the confirmation.
  const { data, error } = await admin
    .from("signups")
    .upsert({ kind: body.kind, email, name }, { onConflict: "kind,email", ignoreDuplicates: true })
    .select("id");

  if (error) {
    console.error("[signup]", error.message);
    return NextResponse.json({ error: "Could not save that just now — please try again." }, { status: 500 });
  }

  const isNew = Array.isArray(data) && data.length > 0;

  if (isNew) {
    // Email failures must not fail the signup — the row is already saved.
    try {
      const unsub = unsubscribeUrl(data[0].id);
      const conf = courseSignupEmail(unsub, name);
      /* RFC 8058: Gmail and Outlook render their own unsubscribe control from
         these headers, which is what keeps people from reaching for "report
         spam" instead — a complaint would harm the domain that also carries
         order confirmations. One-Click needs the URL to accept a bare POST. */
      await sendEmail(email, conf.subject, conf.html, {
        "List-Unsubscribe": `<${unsubscribePostUrl(data[0].id)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      });
      const seller = adminEmails()[0];
      if (seller) {
        const alert = signupAlertEmail(body.kind, email, name);
        await sendEmail(seller, alert.subject, alert.html);
      }
    } catch (err) {
      console.error("[signup email]", err);
    }
  }

  return NextResponse.json({
    ok: true,
    alreadySubscribed: !isNew,
    message: isNew
      ? "You're on the list — check your email for confirmation."
      : "You're already on this list — nothing more to do.",
  });
}
