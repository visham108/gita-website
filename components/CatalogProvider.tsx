"use client";

/* Makes the server-fetched catalog available to client components
   (cart drawer, editions grid, checkout) without each refetching. */

import { createContext, useContext } from "react";
import type { DbProduct } from "@/lib/commerce";

const CatalogContext = createContext<DbProduct[]>([]);

export function useCatalog(): DbProduct[] {
  return useContext(CatalogContext);
}

export function CatalogProvider({ products, children }: { products: DbProduct[]; children: React.ReactNode }) {
  return <CatalogContext.Provider value={products}>{children}</CatalogContext.Provider>;
}
