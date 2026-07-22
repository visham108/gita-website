import type { Metadata } from "next";
import Course from "@/components/course/Course";

export const metadata: Metadata = {
  title: "Reading Plan — A Free Path Through the Gītā",
  description:
    "A free 18-week reading plan for Bhagavad-gītā As It Is: six stages, what to read at each, the key concepts, and how they apply to study, work and daily life.",
};

export default function CoursePage() {
  return <Course />;
}
