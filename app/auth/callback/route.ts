import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** Magic-link landing: exchanges the PKCE code for a session cookie,
    then returns the visitor to My Study. */
/* `next` arrives in the URL, so it is attacker-controllable. Passed straight
   to new URL() a value like "//evil.example" resolves to another origin, and
   the redirect would fire at the most trusted moment there is — immediately
   after a genuine sign-in. Only same-origin paths are accepted:
     "/orders"      → allowed
     "//evil.com"   → protocol-relative, rejected
     "/\evil.com"   → some parsers read \ as /, rejected
     "https://…"    → absolute, rejected (no leading /) */
function safePath(next: string | null): string {
  if (!next || !next.startsWith("/")) return "/account";
  if (next.startsWith("//") || next.includes("\\")) return "/account";
  return next;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safePath(url.searchParams.get("next"));

  if (code) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/account?auth_error=1", url.origin));
}
