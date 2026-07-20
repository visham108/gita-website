import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifyOrderShipped } from "@/lib/email";

/* Fulfillment state machine. Every transition is guarded by the current
   status in the WHERE clause, so a stale dashboard tab can't double-apply
   an action — the second attempt matches zero rows and 409s. */

type Action = "packed" | "shipped" | "delivered" | "cancel";

const ALLOWED_FROM: Record<Action, string[]> = {
  packed: ["paid"],
  shipped: ["paid", "packed"], // seller may skip the packed step
  delivered: ["shipped"],
  cancel: ["pending", "paid", "packed"],
};

/* Object.hasOwn, not `in` — `in` walks the prototype chain, so "__proto__"
   and "toString" would pass as valid actions and then blow up downstream. */
function isAction(v: unknown): v is Action {
  return typeof v === "string" && Object.hasOwn(ALLOWED_FROM, v);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 404 });

  let body: { orderId?: string; action?: Action; awb?: string; trackingUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { orderId, action } = body;
  if (typeof orderId !== "string" || !orderId || !isAction(action))
    return NextResponse.json({ error: "Missing orderId or unknown action" }, { status: 400 });

  const admin = supabaseAdmin();

  if (action === "cancel") {
    // Atomic in the DB: status flip + restock (if stock was decremented) in
    // one transaction, replay-safe like mark_order_paid.
    const { data: ok, error } = await admin.rpc("cancel_order", { p_order_id: orderId });
    if (error) return NextResponse.json({ error: "Cancel failed" }, { status: 500 });
    if (ok !== true)
      return NextResponse.json({ error: "Order can no longer be cancelled" }, { status: 409 });
    return NextResponse.json({ ok: true, status: "cancelled" });
  }

  // 'cancel' returned above, so `action` is already the literal target status.
  const patch: Record<string, string> = { status: action };
  if (action === "shipped") {
    const awb = (body.awb ?? "").trim();
    if (!awb) return NextResponse.json({ error: "AWB / tracking number is required" }, { status: 400 });
    patch.awb = awb;
    const trackingUrl = (body.trackingUrl ?? "").trim();
    if (trackingUrl) {
      if (!/^https:\/\//.test(trackingUrl))
        return NextResponse.json({ error: "Tracking URL must start with https://" }, { status: 400 });
      patch.tracking_url = trackingUrl;
    }
  }

  const { data: updated, error } = await admin
    .from("orders")
    .update(patch)
    .eq("id", orderId)
    .in("status", ALLOWED_FROM[action])
    .select("id, status");

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  if (!updated || updated.length === 0)
    return NextResponse.json({ error: "Order is not in a state that allows this action" }, { status: 409 });

  if (action === "shipped") await notifyOrderShipped(admin, orderId);

  return NextResponse.json({ ok: true, status: updated[0].status });
}
