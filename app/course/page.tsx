import type { Metadata } from "next";
import Course from "@/components/course/Course";

export const metadata: Metadata = {
  title: "The Gītā Course — Free 18-Week Guided Study",
  description:
    "Gītā Foundations: a free 18-week guided journey through every chapter of Bhagavad-gītā As It Is — 27 lessons, reflections, quizzes and a certificate.",
};

export default function CoursePage() {
  return <Course />;
}
