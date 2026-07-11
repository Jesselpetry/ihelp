import type { MetadataRoute } from "next";

// Keep this in sync with SITE_URL in app/layout.tsx.
const SITE_URL = "https://pscp.chatan.in.th";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
