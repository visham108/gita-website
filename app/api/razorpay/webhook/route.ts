import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { notifyOrderPaid, notifyOrderRefunded } from "@/lib/email";
import { REFUNDABLE_STATUSES } from "@/lib/commerce";

/** Razorpay webhook — the authoritative record of payment events, covering
    cases the browser callback misses (tab closed mid-payment, flaky network).
    Signature is HMAC over the RAW body; unsigned or tampered requests are
    rejected. mark_order_paid is idempotent, so replays are no-ops. */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  const valid = await verifyWebhookSignature(rawBody, signature);
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 403 });

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string; error_description?: string } } };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const admin = supabaseAdmin();

  switch (event.event) {
    case "payment.captured": {
      if (payment?.order_id && payment.id) {
        const { data: firstCapture } = await admin.rpc("mark_order_paid", {
          p_rzp_order_id: payment.order_id,
          p_payment_id: payment.id,
        });
        if (firstCapture === true) await notifyOrderPaid(admin, payment.order_id);
      }
      break;
    }
    case "payment.failed": {
      // Keep the order pending — the customer may retry from the same order.
      // Failures are visible in the Razorpay dashboard; nothing to change here.
      break;
    }
    case "refund.processed": {
      if (payment?.order_id) {
        // .select() reveals whether THIS event did the transition — replays
        // match zero rows, so the refund email goes out exactly once.
        const { data: transitioned } = await admin
          .from("orders")
          .update({ status: "refunded" })
          .eq("razorpay_order_id", payment.order_id)
          .in("status", [...REFUNDABLE_STATUSES])
          .select("id");
        if (transitioned && transitioned.length > 0)
          await notifyOrderRefunded(admin, payment.order_id);
      }
      break;
    }
  }

  // Always 200 for verified events so Razorpay doesn't retry forever.
  return NextResponse.json({ ok: true });
}
