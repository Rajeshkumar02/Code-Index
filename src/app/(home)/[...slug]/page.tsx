import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { source } from "@/lib/source";
import { generateBlogPostingSchema } from "@/lib/seo-constants";
import { generateBlogPostMetadata } from "@/lib/metadata-generator";
import PostSuggestions from "@/components/post-suggestions";
import SeriesPlaylist from "@/components/series-playlist";
import SeriesNavigation from "@/components/series-navigation";
import { getSeriesInfo } from "@/lib/series";

// Convert MDX page data to plain objects for client components
function convertToPlainData(post: any) {
  return {
    url: post.url,
    title: post.data.title,
    description: post.data.description,
    author: post.data.author,
    date: post.data.date,
    category: post.data.category,
    tags: post.data.tags,
    readingTime: post.data.readingTime,
    featured: post.data.featured,
    image: post.data.image,
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  try {
    const params = await props?.params;
    const page = source?.getPage?.(params?.slug);

    if (!page) notFound();
    const Mdx = page?.data?.body;

    // Get series information for this post
    const seriesInfo = getSeriesInfo(page);

    // Get all posts for suggestions
    const allPosts = source.getPages();
    const plainAllPosts = allPosts?.map(convertToPlainData) || [];
    const plainCurrentPost = convertToPlainData(page);

    // Generate structured data for the blog post
    const schemaData = generateBlogPostingSchema({
      title: page?.data?.title ?? "Untitled",
      description: page?.data?.description ?? "",
      author: page?.data?.author ?? "Unknown",
      date: page?.data?.date ?? new Date(),
      slug: params?.slug ?? [""],
      image: (page?.data?.image as string | undefined) ?? undefined,
    });

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* Article Header Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {page?.data?.title ?? "Untitled"}
          </h1>

          {/* Meta + Category Inline */}
          <dl className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-1">
              <dt className="sr-only">Author</dt>
              <dd className="font-medium text-foreground">
                {page?.data?.author ?? "Unknown"}
              </dd>
            </div>

            <span aria-hidden="true">•</span>

            {/* Published Date */}
            <div className="flex items-center gap-1">
              <dt className="sr-only">Published on</dt>
              <dd>
                {new Date(page?.data?.date ?? new Date()).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </dd>
            </div>

            {/* Reading Time */}
            {page?.data?.readingTime && (
              <>
                <span aria-hidden="true">•</span>
                <div className="flex items-center gap-1">
                  <dt className="sr-only">Reading time</dt>
                  <dd>{page.data.readingTime}</dd>
                </div>
              </>
            )}

            {/* Category Badge inline */}
            {page?.data?.category && (
              <>
                <span aria-hidden="true">•</span>
                <div className="flex items-center gap-1">
                  <dt className="sr-only">Category</dt>
                  <dd>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {page.data.category.charAt(0).toUpperCase() +
                        page.data.category.slice(1).replace("-", " ")}
                    </span>
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Cover Image Section */}
        {page?.data?.image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <img
                src={page.data.image as string}
                alt={page?.data?.title ?? ""}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        )}

        <article className="container mx-auto px-4 py-12">
          {/* Main Content with Optimal Reading Width */}
          <div className="max-w-3xl mx-auto">
            {/* Series Playlist - Show before content if part of series */}
            {seriesInfo && (
              <SeriesPlaylist seriesInfo={seriesInfo} />
            )}
            
            {/* Article Content with Standard Typography */}
            <div className="prose ">
              <Mdx components={getMDXComponents()} />
            </div>

            {/* Series Navigation - Show after content if part of series */}
            {seriesInfo && (
              <SeriesNavigation seriesInfo={seriesInfo} />
            )}
          </div>

          {/* Post Suggestions with Standard Width */}
          <div className="max-w-5xl mx-auto mt-16">
            <PostSuggestions
              currentPost={plainCurrentPost}
              allPosts={plainAllPosts}
              maxSuggestions={3}
            />
          </div>
        </article>
      </>
    );
  } catch (error) {
    console.error("Error rendering blog post:", error);
    notFound();
  }
}

export function generateStaticParams(): { slug: string[] }[] {
  try {
    const pages = source?.getPages?.() ?? [];
    return pages
      ?.map((page) => ({
        slug: page?.slugs ?? [],
      }))
      ?.filter((item) => item.slug.length > 0);
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props?.params;
  return generateBlogPostMetadata(params?.slug?.join("/") ?? "");
}
