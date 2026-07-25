import type { Metadata } from "next";
import MyStudy from "@/components/account/MyStudy";

export const metadata: Metadata = {
  title: "My Study — Your Account",
  description:
    "Your account for Bhagavad-gītā As It Is: today's verse, the free live course, and your orders in one place.",
  robots: { index: false },
};

export default function AccountPage() {
  return <MyStudy />;
}
