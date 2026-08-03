import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Keeps the Supabase session cookie fresh on every request so server code
    always sees a valid user. Static assets are excluded via the matcher. */
export async function middleware(request: NextRequest) {
  /* Signed-out visitors have no token to refresh, so building a Supabase
     client and running the auth path for them is pure cost — and on Workers,
     CPU time per request is the binding constraint. Nearly all traffic is
     signed out, so this skips the work for nearly all traffic. */
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  if (!hasAuthCookie) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the token if expired — required for Server Components.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|fonts/|images/|robots.txt|sitemap.xml).*)",
  ],
};
