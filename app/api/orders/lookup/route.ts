import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { readJsonObject } from "@/lib/http";

/** Guest order lookup: order number + the email it was placed with.
    Requiring both prevents enumeration; responses are sanitized. */
export async function POST(request: Request) {
  const body = await readJsonObject<{ orderNo?: string; email?: string }>(request);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const no = Number(String(body.orderNo ?? "").replace(/^bg-/i, "").trim());
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!Number.isInteger(no) || !email)
    return NextResponse.json({ error: "Order number and email are required." }, { status: 400 });

  const admin = supabaseAdmin();
  const { data: order } = await admin
    .from("orders")
    .select("order_no, status, amount_paise, shipping_paise, created_at, paid_at, awb, tracking_url, ship_name, ship_city, order_items ( product_id, title, qty, unit_price_paise )")
    .eq("order_no", no)
    .eq("email", email)
    .maybeSingle();

  if (!order)
    return NextResponse.json({ error: "No order found for that number and email." }, { status: 404 });

  return NextResponse.json({ order });
}
