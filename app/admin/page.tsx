import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

/* Metadata is resolved even when the component calls notFound(), so a static
   title would announce the dashboard's existence on the 404 page. Mirror the
   not-found title for everyone who isn't the seller. */
export async function generateMetadata(): Promise<Metadata> {
  const admin = await requireAdmin();
  return {
    title: admin ? "Seller Dashboard" : "Page Not Found",
    robots: { index: false, follow: false },
  };
}

// Auth lives in cookies — never cache this page.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) notFound(); // outsiders see a plain 404, not a login wall

  return <AdminDashboard adminEmail={admin.email} />;
}
