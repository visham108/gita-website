import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { shippingFor, type DbProduct } from "@/lib/commerce";

interface CheckoutBody {
  items: Record<string, number>; // productId -> qty (client cart; prices ignored)
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state?: string;
    pincode: string;
    gift?: boolean;
    giftNote?: string;
  };
}

/** Creates a pending order. The server is the only source of prices:
    it re-reads the catalog, validates stock, computes totals in paise,
    and opens a matching Razorpay order for the widget. */
export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = Object.entries(body.items ?? {}).filter(([, q]) => Number.isInteger(q) && q > 0 && q <= 20);
  const c = body.customer;
  if (!items.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  if (!c?.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email))
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  if (!c.name?.trim() || !c.address?.trim() || !c.city?.trim() || !/^\d{6}$/.test(c.pincode ?? ""))
    return NextResponse.json({ error: "Please complete the shipping address (6-digit PIN code)." }, { status: 400 });

  const admin = supabaseAdmin();

  // Server-side catalog read — the only trusted prices.
  const ids = items.map(([id]) => id);
  const { data: products, error: prodErr } = await admin
    .from("products").select("*").in("id", ids).eq("active", true);
  if (prodErr) return NextResponse.json({ error: "Catalog unavailable." }, { status: 500 });

  const catalog = new Map((products as DbProduct[]).map((p) => [p.id, p]));
  let subtotal = 0;
  const lines: { product_id: string; qty: number; unit_price_paise: number; title: string }[] = [];
  for (const [id, qty] of items) {
    const p = catalog.get(id);
    if (!p) return NextResponse.json({ error: `"${id}" is not available.` }, { status: 400 });
    if (p.format !== "physical")
      return NextResponse.json({ error: `${p.type} is coming soon — not yet purchasable.` }, { status: 400 });
    if (p.track_stock && p.stock_qty < qty)
      return NextResponse.json({ error: `Only ${p.stock_qty} of ${p.type} in stock.` }, { status: 409 });
    subtotal += p.price_paise * qty;
    lines.push({ product_id: id, qty, unit_price_paise: p.price_paise, title: p.title });
  }
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  // Attach the signed-in user if there is one (guests are fine too).
  const supa = await supabaseServer();
  const { data: { user } } = await supa.auth.getUser();

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email: c.email.trim().toLowerCase(),
      phone: c.phone?.trim() || null,
      amount_paise: total,
      shipping_paise: shipping,
      gift: !!c.gift,
      gift_note: c.gift ? (c.giftNote?.trim() || null) : null,
      ship_name: c.name.trim(),
      ship_address: c.address.trim(),
      ship_city: c.city.trim(),
      ship_state: c.state?.trim() || null,
      ship_pincode: c.pincode,
    })
    .select("id, order_no")
    .single();
  if (orderErr || !order) return NextResponse.json({ error: "Could not create the order." }, { status: 500 });

  const { error: itemsErr } = await admin
    .from("order_items")
    .insert(lines.map((l) => ({ ...l, order_id: order.id })));
  if (itemsErr) {
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Could not create the order." }, { status: 500 });
  }

  try {
    const rzp = await createRazorpayOrder(total, `BG-${order.order_no}`);
    await admin.from("orders").update({ razorpay_order_id: rzp.id }).eq("id", order.id);
    return NextResponse.json({
      orderNo: `BG-${order.order_no}`,
      razorpayOrderId: rzp.id,
      amountPaise: total,
      subtotalPaise: subtotal,
      shippingPaise: shipping,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      name: c.name.trim(),
      email: c.email.trim().toLowerCase(),
      phone: c.phone?.trim() || "",
    });
  } catch {
    await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return NextResponse.json({ error: "Payment gateway unavailable — please try again." }, { status: 502 });
  }
}
