import type { Metadata } from "next";
import { Suspense } from "react";
import OrderLookup from "@/components/orders/OrderLookup";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "Track a delivery or review a past order of Bhagavad-gītā As It Is.",
  robots: { index: false },
};

export default function OrdersPage() {
  return (
    <Suspense>
      <OrderLookup />
    </Suspense>
  );
}
