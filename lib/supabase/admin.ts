import { createClient } from "@supabase/supabase-js";

/* Service-role client — SERVER ONLY. Bypasses RLS; used by the checkout API,
   webhook and (later) admin routes. Never import from client components. */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}
