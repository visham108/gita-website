import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyPaymentSignature } from "@/lib/razorpay";

/** Called by the browser after the Razorpay widget reports success.
    The signature proves the payment is genuine (HMAC with our secret);
    mark_order_paid is atomic + idempotent, so a webhook arriving first
    (or twice) is harmless. */
export async function POST(request: Request) {
  let body: { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });

  const valid = await verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!valid) return NextResponse.json({ error: "Signature verification failed" }, { status: 403 });

  const admin = supabaseAdmin();
  await admin.rpc("mark_order_paid", {
    p_rzp_order_id: razorpay_order_id,
    p_payment_id: razorpay_payment_id,
  });

  const { data: order } = await admin
    .from("orders")
    .select("order_no, status, email")
    .eq("razorpay_order_id", razorpay_order_id)
    .single();

  if (!order || order.status !== "paid")
    return NextResponse.json({ error: "Order not found or unpaid" }, { status: 409 });

  return NextResponse.json({ ok: true, orderNo: `BG-${order.order_no}`, email: order.email });
}
