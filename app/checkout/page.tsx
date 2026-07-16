import type { Metadata } from "next";
import Checkout from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Preview the checkout for Bhagavad-gītā As It Is. Online ordering opens soon — your cart is saved on this device.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
