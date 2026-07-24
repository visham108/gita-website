import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { readJsonObject } from "@/lib/http";

/** Self-serve opt-out from the newsletter or course list.

    Public and unauthenticated by necessity — someone who no longer wants our
    mail should not have to make an account to say so. The signup row's primary
    key is a random v4 UUID, which is the whole credential: unguessable, and
    carrying no email address in the URL.

    The response is uniform whether or not the row existed. A stale link (say,
    the person already unsubscribed) must read as success, not as "no such
    subscriber" — that would both confuse the customer and turn this into an
    oracle for testing whether a given id is on a list. */
export async function POST(request: Request) {
  /* Two callers, two shapes.

     1. Our own confirm page, posting JSON.
     2. Gmail/Outlook honouring RFC 8058 One-Click, which posts
        `List-Unsubscribe=One-Click` as form data to the URL in the
        List-Unsubscribe header — so the id has to be readable from the query
        string, and the body must not be required to be JSON. */
  const queryId = new URL(request.url).searchParams.get("id");
  let id = queryId?.trim() ?? "";

  if (!id) {
    const body = await readJsonObject<{ id?: unknown }>(request);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    id = typeof body.id === "string" ? body.id.trim() : "";
  }
  // Shape-check before touching Postgres: a non-uuid would be a type error.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
    return NextResponse.json({ ok: true });

  const admin = supabaseAdmin();
  const { error } = await admin.from("signups").delete().eq("id", id);
  if (error) {
    console.error("[unsubscribe]", error.message);
    return NextResponse.json({ error: "Could not complete that — please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
