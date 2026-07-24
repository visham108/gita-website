import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyPaymentSignature, fetchPayment } from "@/lib/razorpay";
import { notifyOrderPaid } from "@/lib/email";
import { readJsonObject } from "@/lib/http";

/** Called by the browser after the Razorpay widget reports success.

    Two checks, not one. The signature proves the identifiers came from
    Razorpay (HMAC with our secret). It does *not* prove the money moved — a
    payment can be `authorized` (a hold on the card) without ever being
    captured. So we also read the payment back from Razorpay's API and require
    it to be captured, for this order, for the exact amount.

    An authorized-but-uncaptured payment leaves the order `pending`: the
    customer sees a confirmation, the seller does not see a shippable order,
    and the `payment.captured` webhook completes it when the money settles.

    mark_order_paid is atomic + idempotent, so the webhook arriving first (or
    twice) is harmless. */
export async function POST(request: Request) {
  const body = await readJsonObject<{
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  }>(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });

  const valid = await verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!valid) return NextResponse.json({ error: "Signature verification failed" }, { status: 403 });

  const admin = supabaseAdmin();

  // Read the order first — its amount is what the payment has to match.
  const { data: order } = await admin
    .from("orders")
    .select("order_no, status, email, amount_paise")
    .eq("razorpay_order_id", razorpay_order_id)
    .single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  /* If Razorpay is unreachable we must not guess. Leaving the order pending is
     the safe failure: the webhook still settles it, and nothing ships early. */
  let payment;
  try {
    payment = await fetchPayment(razorpay_payment_id);
  } catch {
    return NextResponse.json(
      { ok: true, pending: true, orderNo: `BG-${order.order_no}`, email: order.email },
      { status: 202 }
    );
  }

  // The payment must belong to this order, and be for exactly what we charged.
  if (
    payment.order_id !== razorpay_order_id ||
    payment.amount !== order.amount_paise ||
    payment.currency !== "INR"
  )
    return NextResponse.json({ error: "Payment does not match this order" }, { status: 409 });

  if (payment.status !== "captured")
    return NextResponse.json(
      { ok: true, pending: true, orderNo: `BG-${order.order_no}`, email: order.email },
      { status: 202 }
    );

  const { data: firstCapture } = await admin.rpc("mark_order_paid", {
    p_rzp_order_id: razorpay_order_id,
    p_payment_id: razorpay_payment_id,
  });
  if (firstCapture === true) await notifyOrderPaid(admin, razorpay_order_id);

  const { data: settled } = await admin
    .from("orders")
    .select("order_no, status, email")
    .eq("razorpay_order_id", razorpay_order_id)
    .single();

  if (!settled || settled.status !== "paid")
    return NextResponse.json({ error: "Order not found or unpaid" }, { status: 409 });

  return NextResponse.json({ ok: true, orderNo: `BG-${settled.order_no}`, email: settled.email });
}
