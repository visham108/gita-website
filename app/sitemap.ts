import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1.0 },
    { url: `${SITE_URL}/book`, priority: 0.9 },
    { url: `${SITE_URL}/course`, priority: 0.9 },
    { url: `${SITE_URL}/resources`, priority: 0.7 },
  ];
}
