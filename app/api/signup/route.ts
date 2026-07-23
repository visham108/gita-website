import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { adminEmails } from "@/lib/admin";
import { sendEmail, courseSignupEmail, newsletterSignupEmail, signupAlertEmail } from "@/lib/email";

/** Free-course interest and newsletter subscriptions.

    Public and unauthenticated, so it is deliberately narrow: only two list
    names are accepted, and the (kind, email) unique constraint means a repeated
    submit inserts nothing and — importantly — sends nothing. That stops the
    same address being used to pump out mail. */

const KINDS = ["course", "newsletter"] as const;
type Kind = (typeof KINDS)[number];

function isKind(v: unknown): v is Kind {
  return typeof v === "string" && (KINDS as readonly string[]).includes(v);
}

export async function POST(request: Request) {
  let body: { kind?: unknown; email?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

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
      const conf = body.kind === "course" ? courseSignupEmail(name) : newsletterSignupEmail();
      await sendEmail(email, conf.subject, conf.html);
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
      ? body.kind === "course"
        ? "You're on the list — check your email for confirmation."
        : "Subscribed. Your first verse arrives this week."
      : "You're already on this list — nothing more to do.",
  });
}
