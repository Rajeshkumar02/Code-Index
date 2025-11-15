import { source } from "@/lib/source";
import { BLOG_CONFIG, SITE_CONFIG } from "@/lib/seo-constants";
import type { MetadataRoute } from "next";
import { safeEncodeURIComponent } from "@/lib/blog-utils";

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    const pages = source?.getPages?.() ?? [];

    // Blog posts with defensive programming and optional chaining
    const blogPosts =
      pages
        ?.map?.((page) => {
          try {
            return {
              url: `${SITE_CONFIG?.url ?? ""}/${
                page?.slugs?.join?.("/") ?? ""
              }`.replace(/\/$/, ""),
              lastModified: new Date(page?.data?.date ?? new Date()),
              changeFrequency:
                BLOG_CONFIG?.changeFrequency ?? ("weekly" as const),
              priority: 0.8,
            };
          } catch {
            console.error("Error processing blog post for sitemap:", page);
            return null;
          }
        })
        ?.filter?.((post) => post !== null) ?? [];

    // Generate category pages with optional chaining
    const categories = Array.from(
      new Set(
        pages?.map?.((page) => page?.data?.category)?.filter?.(Boolean) ?? []
      )
    );

    const categoryPages =
      categories?.map?.((category) => ({
        url: `${SITE_CONFIG?.url ?? ""}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })) ?? [];

    // Generate tag pages with optional chaining
    const allTags = new Set<string>();
    pages?.forEach?.((page) => {
      if (page?.data?.tags) {
        page?.data?.tags?.forEach?.((tag: string) => {
          if (tag) {
            allTags.add(tag?.toLowerCase?.() || "");
          }
        });
      }
    });

    const tagPages =
      Array.from(allTags)?.map?.((tag) => ({
        url: `${SITE_CONFIG?.url ?? ""}/tag/${safeEncodeURIComponent(tag)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })) ?? [];

    // Generate author pages with optional chaining
    const authors = Array.from(
      new Set(
        pages?.map?.((page) => page?.data?.author)?.filter?.(Boolean) ?? []
      )
    );

    const authorPages =
      authors?.map?.((author) => ({
        url: `${SITE_CONFIG?.url ?? ""}/author/${safeEncodeURIComponent(
          author
        )}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })) ?? [];

    // Static pages
    const staticPages = [
      {
        url: SITE_CONFIG?.url ?? "",
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
    ];

    return [
      ...staticPages,
      ...blogPosts,
      ...categoryPages,
      ...tagPages,
      ...authorPages,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback: return at least the home page
    return [
      {
        url: SITE_CONFIG?.url ?? "",
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
    ];
  }
}
