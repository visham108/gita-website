import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old static-site URLs (*.html) permanently redirect to their new routes so
  // existing links, bookmarks and search results keep working.
  async redirects() {
    const pages = ["book", "explorer", "course", "resources", "account", "checkout"];
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...pages.map((p) => ({
        source: `/${p}.html`,
        destination: `/${p}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
