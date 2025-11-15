import { SITE_CONFIG } from "@/lib/seo-constants";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  try {
    const siteUrl = SITE_CONFIG?.url ?? "https://example.com";

    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/admin/", "/.next/", "/public/"],
        },
        {
          userAgent: "Googlebot",
          allow: "/",
          crawlDelay: 0,
        },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
      host: siteUrl,
    };
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    // Fallback robots.txt
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
      sitemap: "https://example.com/sitemap.xml",
      host: "https://example.com",
    };
  }
}
