/* Razorpay via plain REST + Web Crypto — no Node SDK, so every call runs
   identically on Node and Cloudflare Workers. Server-side only. */

const API = "https://api.razorpay.com/v1";

function authHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new Error("Razorpay keys not configured");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createRazorpayOrder(amountPaise: number, receipt: string): Promise<RazorpayOrder> {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Razorpay order failed: ${JSON.stringify(json.error ?? json).slice(0, 200)}`);
  return json as RazorpayOrder;
}

export async function refundPayment(paymentId: string, amountPaise?: number): Promise<{ id: string; status: string }> {
  const res = await fetch(`${API}/payments/${paymentId}/refund`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(amountPaise ? { amount: amountPaise } : {}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Razorpay refund failed: ${JSON.stringify(json.error ?? json).slice(0, 200)}`);
  return json;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Checkout-handler verification: HMAC(order_id|payment_id, key_secret). */
export async function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = await hmacSha256Hex(secret, `${orderId}|${paymentId}`);
  return timingSafeEqualHex(expected, signature);
}

/** Webhook verification: HMAC(raw body, webhook secret). */
export async function verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = await hmacSha256Hex(secret, rawBody);
  return timingSafeEqualHex(expected, signature);
}
