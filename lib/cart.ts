"use client";

/* Cart store — same localStorage key and shape as the static prototype
   ({ productId: qty } under "bgaii_cart_v1") so existing visitors' carts
   survive the migration. Prices are looked up from PRODUCTS for display;
   the server recomputes all money at checkout (Phase 3). */

import { useSyncExternalStore } from "react";
import { PRODUCTS } from "@/lib/data";

const CART_KEY = "bgaii_cart_v1";
const CART_EVENT = "bgaii:cart";
export const CART_OPEN_EVENT = "bgaii:cart-open";

/** Ask the site chrome to slide the cart drawer open (e.g. after add-to-cart). */
export function openCartDrawer() {
  window.dispatchEvent(new Event(CART_OPEN_EVENT));
}

export type Cart = Record<string, number>;

export function readCart(): Cart {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "{}") || {};
  } catch {
    return {};
  }
}

function writeCart(cart: Cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(id: string, qty = 1) {
  const cart = readCart();
  cart[id] = (cart[id] || 0) + qty;
  writeCart(cart);
}

export function setQty(id: string, qty: number) {
  const cart = readCart();
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  writeCart(cart);
}

export function clearCart() {
  writeCart({});
}

export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

export function cartTotal(cart: Cart): number {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? sum + p.price * qty : sum;
  }, 0);
}

export const money = (n: number) => "$" + n.toFixed(2);

/* React binding: re-renders subscribers whenever the cart changes
   (in this tab via CART_EVENT, in other tabs via the storage event). */

let cache: { json: string; cart: Cart } = { json: "{}", cart: {} };

function getSnapshot(): Cart {
  const json = typeof window === "undefined" ? "{}" : localStorage.getItem(CART_KEY) ?? "{}";
  if (json !== cache.json) {
    let cart: Cart = {};
    try { cart = JSON.parse(json) || {}; } catch { /* keep empty */ }
    cache = { json, cart };
  }
  return cache.cart;
}

const emptyCart: Cart = {};
function getServerSnapshot(): Cart {
  return emptyCart;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CART_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CART_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useCart(): Cart {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
