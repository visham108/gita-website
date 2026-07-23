import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Course-interest and newsletter sign-ups, newest first. 404 to non-admins —
    this is a list of people's names and email addresses. */
export async function GET() {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 404 });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("signups")
    .select("id, kind, name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) return NextResponse.json({ error: "Query failed" }, { status: 500 });
  return NextResponse.json({ signups: data ?? [] });
}

/** Remove someone from a list — needed to honour an unsubscribe request. */
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 404 });

  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof body.id !== "string" || !body.id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = supabaseAdmin();
  const { error } = await admin.from("signups").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
