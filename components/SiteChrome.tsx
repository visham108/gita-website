"use client";

/* Header + cart drawer share the "drawer open" state; pages stay server-rendered. */

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { CART_OPEN_EVENT } from "@/lib/cart";

export default function SiteChrome() {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const open = () => setCartOpen(true);
    window.addEventListener(CART_OPEN_EVENT, open);
    return () => window.removeEventListener(CART_OPEN_EVENT, open);
  }, []);
  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
