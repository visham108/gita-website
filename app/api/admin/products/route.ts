import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CATALOG_TAG } from "@/lib/products";

/** GET: the full catalog (inactive rows included — the public read policy
    only exposes active ones). POST: patch price / stock / tag / active. */
export async function GET() {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 404 });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .select("id, type, title, price_paise, tag, format, active, stock_qty")
    .order("price_paise", { ascending: false });

  if (error) return NextResponse.json({ error: "Query failed" }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 404 });

  let body: { id?: string; price_paise?: unknown; stock_qty?: unknown; tag?: unknown; active?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof body.id !== "string" || !body.id)
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (body.price_paise !== undefined) {
    if (!Number.isInteger(body.price_paise) || (body.price_paise as number) < 0)
      return NextResponse.json({ error: "price_paise must be a non-negative integer" }, { status: 400 });
    patch.price_paise = body.price_paise;
  }
  if (body.stock_qty !== undefined) {
    if (!Number.isInteger(body.stock_qty) || (body.stock_qty as number) < 0)
      return NextResponse.json({ error: "stock_qty must be a non-negative integer" }, { status: 400 });
    patch.stock_qty = body.stock_qty;
  }
  if (body.tag !== undefined) {
    if (body.tag !== null && typeof body.tag !== "string")
      return NextResponse.json({ error: "tag must be a string or null" }, { status: 400 });
    patch.tag = body.tag === "" ? null : body.tag;
  }
  if (body.active !== undefined) {
    if (typeof body.active !== "boolean")
      return NextResponse.json({ error: "active must be a boolean" }, { status: 400 });
    patch.active = body.active;
  }
  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .update(patch)
    .eq("id", body.id)
    .select("id, type, title, price_paise, tag, format, active, stock_qty")
    .single();

  if (error || !data) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  // Purge the cached catalog so the new price/stock is live immediately —
  // a seller correcting a wrong price can't be made to wait out the window.
  revalidateTag(CATALOG_TAG);

  return NextResponse.json({ ok: true, product: data });
}
