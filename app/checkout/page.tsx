import type { Metadata } from "next";
import Checkout from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Secure checkout for Bhagavad-gītā As It Is. Pay by UPI, card or netbanking. Shipped across India.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
