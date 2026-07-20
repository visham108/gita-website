import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Full order list for the seller dashboard. 404 (not 403) to non-admins —
    the admin area does not advertise its existence. */
export async function GET() {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 404 });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("orders")
    .select(
      `id, order_no, email, phone, status, amount_paise, shipping_paise,
       razorpay_order_id, razorpay_payment_id, awb, tracking_url, gift, gift_note,
       ship_name, ship_address, ship_city, ship_state, ship_pincode, created_at, paid_at,
       order_items ( product_id, title, qty, unit_price_paise )`
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) return NextResponse.json({ error: "Query failed" }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}
