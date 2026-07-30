import type { Metadata } from "next";
import Course from "@/components/course/Course";

export const metadata: Metadata = {
  title: "Free Live Session — The Bhagavad-gītā in the Modern World",
  description:
    "A free one-hour live session on Saturday 15 August, 8–9pm IST: what the Bhagavad-gītā says about pressure, anger, difficult decisions and identity. Open to everyone, no background needed.",
};

export default function CoursePage() {
  return <Course />;
}
