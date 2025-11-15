import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blog-card";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";
import {
  formatTagName,
  safeDecodeURIComponent,
  safeEncodeURIComponent,
} from "@/lib/blog-utils";

interface TagPageProps {
  params: {
    tag: string;
  };
}

// Convert blog post data to serializable format with optional chaining
const convertToSerializable = (page: any) => ({
  url: page?.url || "",
  title: page?.data?.title || "Untitled",
  description: page?.data?.description || "",
  author: page?.data?.author || "Anonymous",
  date: page?.data?.date || new Date().toISOString(),
  category: page?.data?.category || "uncategorized",
  tags: page?.data?.tags || [],
  readingTime: page?.data?.readingTime || "5 min read",
  featured: page?.data?.featured || false,
  image: page?.data?.image || "",
});

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const tag = safeDecodeURIComponent(resolvedParams?.tag);

  // Get all pages and filter by tag with optional chaining
  const allPages = source?.getPages?.() || [];
  const tagPosts =
    allPages?.filter?.((page) =>
      page?.data?.tags?.some?.(
        (t: string) => t?.toLowerCase?.() === tag?.toLowerCase?.()
      )
    ) || [];

  const serializedPosts =
    tagPosts
      ?.map?.(convertToSerializable)
      ?.sort?.(
        (a, b) =>
          new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()
      ) || [];

  if (!tagPosts?.length) {
    notFound();
  }

  // Format tag name for display
  const tagName = formatTagName(tag);

  // Get related tags (tags that appear together with this tag)
  const relatedTags = Array.from(
    new Set(
      serializedPosts
        ?.flatMap?.((post) => post?.tags || [])
        ?.filter?.((t) => t?.toLowerCase?.() !== tag?.toLowerCase?.()) || []
    )
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Navigation */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Compact Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-6 mb-6">
            {/* Tag Icon */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/20 flex items-center justify-center">
              <Hash className="h-7 w-7 text-primary" />
            </div>

            {/* Tag Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                #{tagName}
              </h1>
              <p className="text-muted-foreground mb-3">
                Articles and insights tagged with "{tagName}"
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-foreground font-medium">
                  {serializedPosts?.length || 0} Articles
                </span>
                {relatedTags?.length > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-foreground font-medium">
                      {relatedTags.length} Related Tags
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Tagged Articles ({serializedPosts?.length || 0})
            </h2>
            <p className="text-sm text-muted-foreground">Latest first</p>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serializedPosts?.map?.((post, index) => (
              <BlogCard
                key={post?.url || index}
                post={post}
                variant="default"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all tags
export async function generateStaticParams() {
  try {
    const pages = source?.getPages?.() || [];
    const allTags = new Set<string>();

    pages?.forEach?.((page) => {
      if (page?.data?.tags) {
        page?.data?.tags?.forEach?.((tag: string) => {
          if (tag) {
            allTags.add(tag?.toLowerCase?.());
          }
        });
      }
    });

    return (
      Array.from(allTags)?.map?.((tag) => ({
        tag: safeEncodeURIComponent(tag),
      })) || []
    );
  } catch (error) {
    console.error("Error generating tag static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TagPageProps) {
  try {
    const resolvedParams = await params;
    const tag = safeDecodeURIComponent(resolvedParams?.tag);
    const tagName = formatTagName(tag);

    const allPages = source?.getPages?.() || [];
    const tagPosts =
      allPages?.filter?.((page) =>
        page?.data?.tags?.some?.(
          (t: string) => t?.toLowerCase?.() === tag?.toLowerCase?.()
        )
      ) || [];

    return {
      title: `#${tagName} - Tag Archive | Code Index`,
      description: `Explore all ${
        tagPosts?.length || 0
      } posts tagged with "${tagName}". Articles covering various topics and technologies related to ${tagName?.toLowerCase?.()}.`,
      openGraph: {
        title: `#${tagName} Posts | Code Index`,
        description: `Discover ${
          tagPosts?.length || 0
        } posts tagged with "${tagName}".`,
        url: `/tag/${safeEncodeURIComponent(tag)}`,
      },
      twitter: {
        card: "summary",
        title: `#${tagName} Posts | Code Index`,
        description: `Discover ${
          tagPosts?.length || 0
        } posts tagged with "${tagName}".`,
      },
      alternates: {
        canonical: `/tag/${safeEncodeURIComponent(tag)}`,
      },
    };
  } catch (error) {
    console.error("Error generating tag metadata:", error);
    return {
      title: "Tag Archive | Code Index",
      description: "Explore articles by tag on Code Index.",
    };
  }
}
