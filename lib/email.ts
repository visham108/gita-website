import { moneyINR } from "@/lib/commerce";
import { adminEmails } from "@/lib/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

/* Transactional email via Resend's REST API (Workers-safe fetch, no SDK).
   Until RESEND_API_KEY is set, every send is a logged no-op — checkout and
   admin flows work identically, they just don't email anyone yet. */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const FROM = process.env.EMAIL_FROM ?? "Bhagavad-gītā As It Is <onboarding@resend.dev>";

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email skipped — RESEND_API_KEY not set] to=${to} subject="${subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok) console.error(`[email failed] ${res.status} ${(await res.text()).slice(0, 200)}`);
    return res.ok;
  } catch (err) {
    console.error("[email failed]", err);
    return false;
  }
}

/* ---------------------------------------------------------------- templates */

interface OrderRow {
  order_no: number;
  email: string;
  phone: string | null;
  amount_paise: number;
  shipping_paise: number;
  awb: string | null;
  tracking_url: string | null;
  gift: boolean;
  gift_note: string | null;
  ship_name: string | null;
  ship_address: string | null;
  ship_city: string | null;
  ship_state: string | null;
  ship_pincode: string | null;
  order_items: { title: string; qty: number; unit_price_paise: number }[];
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function orderNoOf(o: OrderRow): string {
  return `BG-${o.order_no}`;
}

function trackLink(o: OrderRow): string {
  return `${SITE_URL}/orders?no=${orderNoOf(o)}&email=${encodeURIComponent(o.email)}`;
}

function itemsTable(o: OrderRow): string {
  const rows = o.order_items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee2d0;">${esc(i.title)} × ${i.qty}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee2d0;text-align:right;">${moneyINR(i.unit_price_paise * i.qty)}</td>
      </tr>`
    )
    .join("");
  const shipping = o.shipping_paise === 0 ? "Free" : moneyINR(o.shipping_paise);
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">
    ${rows}
    <tr><td style="padding:8px 0;color:#77624e;">Shipping</td><td style="padding:8px 0;text-align:right;color:#77624e;">${shipping}</td></tr>
    <tr><td style="padding:8px 0;font-weight:bold;">Total paid</td><td style="padding:8px 0;text-align:right;font-weight:bold;">${moneyINR(o.amount_paise)}</td></tr>
  </table>`;
}

function addressBlock(o: OrderRow): string {
  const lines = [o.ship_name, o.ship_address, [o.ship_city, o.ship_state, o.ship_pincode].filter(Boolean).join(", ")]
    .filter(Boolean)
    .map((l) => esc(l as string));
  return `<p style="color:#4a3826;line-height:1.6;margin:4px 0 16px;">${lines.join("<br/>")}</p>`;
}

function shell(title: string, body: string, footer?: string): string {
  return `<div style="background:#faf6ef;padding:24px;font-family:Georgia,serif;color:#2b2118;">
    <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #eee2d0;border-radius:8px;padding:32px;">
      <h1 style="color:#9c430b;font-size:22px;margin:0 0 16px;">${title}</h1>
      ${body}
      <p style="color:#77624e;font-size:13px;margin-top:24px;border-top:1px solid #eee2d0;padding-top:16px;">
        ${footer ?? "Bhagavad-gītā <em>As It Is</em> — questions? Just reply to this email."}
      </p>
    </div>
  </div>`;
}

/** Gift inscription block. The seller has to hand-write this card, so it must
    travel with the order alert — not sit only in the dashboard. */
function giftBlock(o: OrderRow): string {
  if (!o.gift) return "";
  const note = o.gift_note?.trim();
  return `<div style="background:#faefdf;border-left:3px solid #9c430b;padding:12px 16px;margin:16px 0;">
    <strong style="color:#9c430b;">🎁 Gift order</strong>
    ${note ? `<p style="margin:6px 0 0;line-height:1.6;font-style:italic;">“${esc(note)}”</p>`
           : `<p style="margin:6px 0 0;color:#77624e;">No inscription requested.</p>`}
  </div>`;
}

export function orderConfirmedEmail(o: OrderRow): { subject: string; html: string } {
  return {
    subject: `Order ${orderNoOf(o)} confirmed — thank you`,
    html: shell(
      `Your order is confirmed 🙏`,
      `<p style="line-height:1.6;">Order <strong>${orderNoOf(o)}</strong> is paid and being prepared.
       We'll email you again the moment it ships.</p>
       ${itemsTable(o)}
       ${giftBlock(o)}
       <h3 style="color:#9c430b;font-size:15px;margin:16px 0 4px;">Shipping to</h3>
       ${addressBlock(o)}
       <p><a href="${trackLink(o)}" style="color:#9c430b;">Track your order</a></p>`
    ),
  };
}

export function orderShippedEmail(o: OrderRow): { subject: string; html: string } {
  const tracking = o.tracking_url
    ? `<p><a href="${esc(o.tracking_url)}" style="display:inline-block;background:#9c430b;color:#fffdf8;padding:10px 20px;border-radius:6px;text-decoration:none;">Track shipment</a></p>`
    : "";
  const awb = o.awb ? `<p style="line-height:1.6;">Tracking number (AWB): <strong>${esc(o.awb)}</strong></p>` : "";
  return {
    subject: `Order ${orderNoOf(o)} has shipped 📦`,
    html: shell(
      `Your Gītā is on its way`,
      `<p style="line-height:1.6;">Order <strong>${orderNoOf(o)}</strong> has been handed to the courier.</p>
       ${awb}${tracking}
       <h3 style="color:#9c430b;font-size:15px;margin:16px 0 4px;">Shipping to</h3>
       ${addressBlock(o)}
       <p><a href="${trackLink(o)}" style="color:#9c430b;">Order status page</a></p>`
    ),
  };
}

export function orderRefundedEmail(o: OrderRow): { subject: string; html: string } {
  return {
    subject: `Order ${orderNoOf(o)} refunded`,
    html: shell(
      `Your refund is on its way`,
      `<p style="line-height:1.6;">Order <strong>${orderNoOf(o)}</strong> has been refunded in full
       (${moneyINR(o.amount_paise)}). Razorpay typically credits your original payment method
       within 5–7 working days.</p>`
    ),
  };
}

export function newOrderSellerEmail(o: OrderRow): { subject: string; html: string } {
  return {
    subject: `🛎️ New order ${orderNoOf(o)} — ${moneyINR(o.amount_paise)}`,
    html: shell(
      `New paid order`,
      `<p style="line-height:1.6;"><strong>${orderNoOf(o)}</strong> from ${esc(o.ship_name ?? o.email)}</p>
       ${itemsTable(o)}
       ${giftBlock(o)}
       <h3 style="color:#9c430b;font-size:15px;margin:16px 0 4px;">Ship to</h3>
       ${addressBlock(o)}
       <p style="margin:0 0 4px;">${esc(o.email)}${o.phone ? ` · ${esc(o.phone)}` : ""}</p>
       <p><a href="${SITE_URL}/admin" style="color:#9c430b;">Open the admin dashboard</a></p>`,
      "Seller notification — Bhagavad-gītā <em>As It Is</em>."
    ),
  };
}

/* ------------------------------------------------------------ notifications */

const ORDER_SELECT = `order_no, email, phone, amount_paise, shipping_paise, awb, tracking_url,
  gift, gift_note, ship_name, ship_address, ship_city, ship_state, ship_pincode,
  order_items ( title, qty, unit_price_paise )`;

async function fetchOrder(admin: SupabaseClient, col: string, val: string): Promise<OrderRow | null> {
  const { data } = await admin.from("orders").select(ORDER_SELECT).eq(col, val).single();
  return (data as unknown as OrderRow) ?? null;
}

/** Customer confirmation + seller alert, sent exactly once per order (callers
    gate on mark_order_paid returning true). Failures never break payment flow. */
export async function notifyOrderPaid(admin: SupabaseClient, rzpOrderId: string): Promise<void> {
  try {
    const o = await fetchOrder(admin, "razorpay_order_id", rzpOrderId);
    if (!o) return;
    const c = orderConfirmedEmail(o);
    await sendEmail(o.email, c.subject, c.html);
    const seller = adminEmails()[0];
    if (seller) {
      const s = newOrderSellerEmail(o);
      await sendEmail(seller, s.subject, s.html);
    }
  } catch (err) {
    console.error("[notifyOrderPaid]", err);
  }
}

export async function notifyOrderShipped(admin: SupabaseClient, orderId: string): Promise<void> {
  try {
    const o = await fetchOrder(admin, "id", orderId);
    if (!o) return;
    const t = orderShippedEmail(o);
    await sendEmail(o.email, t.subject, t.html);
  } catch (err) {
    console.error("[notifyOrderShipped]", err);
  }
}

export async function notifyOrderRefunded(admin: SupabaseClient, rzpOrderId: string): Promise<void> {
  try {
    const o = await fetchOrder(admin, "razorpay_order_id", rzpOrderId);
    if (!o) return;
    const t = orderRefundedEmail(o);
    await sendEmail(o.email, t.subject, t.html);
  } catch (err) {
    console.error("[notifyOrderRefunded]", err);
  }
}
