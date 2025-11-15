import { source } from "@/lib/source";
import { SITE_CONFIG } from "@/lib/seo-constants";

/**
 * RSS Feed Route Handler (Alternative endpoint)
 * Available at: /rss or /rss.xml
 */

function escapeXml(unsafe: string): string {
  return (unsafe ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const pages = source?.getPages?.() ?? [];

    // Sort posts by date (newest first)
    const sortedPosts = pages
      .sort((a, b) => {
        const dateA = new Date(a?.data?.date ?? 0).getTime();
        const dateB = new Date(b?.data?.date ?? 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 20); // Latest 20 posts

    // Build RSS items
    const items = sortedPosts
      .map((post) => {
        try {
          const postUrl = `${SITE_CONFIG?.url}/${post?.slugs?.join?.("/") ?? ""}`;
          const title = escapeXml(post?.data?.title ?? "Untitled");
          const description = escapeXml(post?.data?.description ?? "");
          const author = escapeXml(post?.data?.author ?? SITE_CONFIG?.author ?? "");
          const pubDate = new Date(post?.data?.date ?? new Date()).toUTCString();
          const category = escapeXml(post?.data?.category ?? "");

          return `
    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${description}</description>
      <author>${author}</author>
      <pubDate>${pubDate}</pubDate>
      ${category ? `<category>${category}</category>` : ""}
      ${
        post?.data?.tags && post.data.tags.length > 0
          ? post.data.tags.map((tag: string) => `      <category>${escapeXml(tag)}</category>`).join("\n")
          : ""
      }
    </item>`;
        } catch (error) {
          console.error("Error processing post for RSS:", post, error);
          return "";
        }
      })
      .filter((item) => item.length > 0)
      .join("\n");

    // Build RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_CONFIG?.name ?? "Blog")}</title>
    <link>${SITE_CONFIG?.url}</link>
    <description>${escapeXml(SITE_CONFIG?.description ?? "")}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_CONFIG?.url}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_CONFIG?.url}${SITE_CONFIG?.image}</url>
      <title>${escapeXml(SITE_CONFIG?.name ?? "Blog")}</title>
      <link>${SITE_CONFIG?.url}</link>
    </image>
${items}
  </channel>
</rss>`;

    // Return as XML
    return new Response(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);

    // Fallback RSS feed
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_CONFIG?.name ?? "Blog")}</title>
    <link>${SITE_CONFIG?.url}</link>
    <description>${escapeXml(SITE_CONFIG?.description ?? "")}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

    return new Response(fallbackRss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
      status: 200,
    });
  }
}
