import type { Metadata } from "next";
import { source } from "@/lib/source";
import {
  SITE_CONFIG,
  SOCIAL_CONFIG,
  generateOgImageUrl,
  generateBlogUrl,
} from "@/lib/seo-constants";

export const generateBlogPostMetadata = async (
  slug: string
): Promise<Metadata> => {
  try {
    const slugParts = slug.split("/");
    const page = source?.getPage?.(slugParts);

    if (!page) return {};

    const ogImageUrl = generateOgImageUrl(slugParts);
    const pageUrl = generateBlogUrl(slugParts);

    return {
      title: `${page?.data?.title ?? "Article"} | ${SITE_CONFIG?.name}`,
      description: page?.data?.description ?? "",
      keywords: [
        ...(page?.data?.tags ?? []),
        page?.data?.category ?? "",
      ].filter(Boolean),
      authors: [{ name: page?.data?.author ?? "Unknown" }],
      creator: SITE_CONFIG?.creator,
      publisher: SITE_CONFIG?.name,
      openGraph: {
        type: "article",
        locale: SITE_CONFIG?.locale,
        url: pageUrl,
        title: page?.data?.title ?? "Article",
        description: page?.data?.description ?? "",
        siteName: SITE_CONFIG?.name,
        publishedTime: new Date(page?.data?.date ?? new Date()).toISOString(),
        authors: [page?.data?.author ?? "Unknown"],
        tags: page?.data?.tags ?? [],
        images: [
          {
            url: `${SITE_CONFIG?.url}${ogImageUrl}`,
            width: 1200,
            height: 630,
            alt: page?.data?.title ?? "Article",
          },
        ],
      },
      twitter: {
        card: SOCIAL_CONFIG?.twitter?.card,
        creator: SOCIAL_CONFIG?.twitter?.handle,
        title: page?.data?.title ?? "Article",
        description: page?.data?.description ?? "",
        images: [`${SITE_CONFIG?.url}${ogImageUrl}`],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {};
  }
};
