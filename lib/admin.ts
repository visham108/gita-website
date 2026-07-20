import { supabaseServer } from "@/lib/supabase/server";

/* Admin gate — the seller's email(s) live in ADMIN_EMAILS (comma-separated).
   Server-side only: call at the top of every /admin page and /api/admin route.
   Returns the admin's email, or null (callers should 404, not 403 — the admin
   area shouldn't advertise its existence). */

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(): Promise<{ email: string } | null> {
  const admins = adminEmails();
  if (admins.length === 0) return null;
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();
  if (!email || !admins.includes(email)) return null;
  return { email };
}
