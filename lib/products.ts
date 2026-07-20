import type { DbProduct } from "@/lib/commerce";

export const CATALOG_TAG = "catalog";

/** Public catalog, read server-side with the anon key (RLS: active rows only).
    Cached for 5 minutes AND tagged, so an admin price/stock save can purge it
    instantly (see /api/admin/products) instead of waiting out the window. */
export async function getProducts(): Promise<DbProduct[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/products?select=*&active=eq.true&order=format.desc,price_paise.desc`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        next: { revalidate: 300, tags: [CATALOG_TAG] },
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as DbProduct[];
  } catch {
    return [];
  }
}
