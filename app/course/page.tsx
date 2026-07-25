import type { Metadata } from "next";
import Course from "@/components/course/Course";

export const metadata: Metadata = {
  title: "Free Live Course — The Bhagavad-gītā for Everyday Life",
  description:
    "A free, live, instructor-led course on Bhagavad-gītā As It Is. Eight sessions on pressure, anger, duty, comparison and loss — taught in real time, open to complete beginners.",
};

export default function CoursePage() {
  return <Course />;
}
