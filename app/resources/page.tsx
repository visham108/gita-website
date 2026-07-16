import type { Metadata } from "next";
import ResourceLibrary from "@/components/resources/ResourceLibrary";

export const metadata: Metadata = {
  title: "Resource Library — Articles, Lectures & Study Materials",
  description:
    "Articles, lectures, study aids and downloads that surround Bhagavad-gītā As It Is and support your journey through it.",
};

export default function ResourcesPage() {
  return <ResourceLibrary />;
}
