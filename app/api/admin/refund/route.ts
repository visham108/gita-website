import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { refundPayment } from "@/lib/razorpay";
import { isRefundable, REFUNDABLE_STATUSES } from "@/lib/commerce";
import { notifyOrderRefunded } from "@/lib/email";

/** Full refund via Razorpay. Money moves only if Razorpay accepts the refund;
    we then flip status optimistically (guarded, so the refund.processed
    webhook replay is a no-op and the customer is emailed exactly once). */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 404 });

  let body: { orderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof body.orderId !== "string" || !body.orderId)
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  const admin = supabaseAdmin();
  const { data: order } = await admin
    .from("orders")
    .select("id, status, razorpay_order_id, razorpay_payment_id")
    .eq("id", body.orderId)
    .single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!order.razorpay_payment_id)
    return NextResponse.json({ error: "Order has no captured payment to refund" }, { status: 409 });
  if (!isRefundable(order.status))
    return NextResponse.json({ error: `Cannot refund an order in status "${order.status}"` }, { status: 409 });

  try {
    await refundPayment(order.razorpay_payment_id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Refund failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const { data: transitioned } = await admin
    .from("orders")
    .update({ status: "refunded" })
    .eq("id", order.id)
    .in("status", [...REFUNDABLE_STATUSES])
    .select("id");
  if (transitioned && transitioned.length > 0 && order.razorpay_order_id)
    await notifyOrderRefunded(admin, order.razorpay_order_id);

  return NextResponse.json({ ok: true, status: "refunded" });
}
