import type { Metadata } from "next";
import MyStudy from "@/components/account/MyStudy";

export const metadata: Metadata = {
  title: "My Study — Bookmarks, Notes & Reading Plans",
  description:
    "Your personal study space for Bhagavad-gītā As It Is: bookmarks, reflections, reading plans and course progress in one place.",
  robots: { index: false },
};

export default function AccountPage() {
  return <MyStudy />;
}
