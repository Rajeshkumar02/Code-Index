import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blog-card";
import Link from "next/link";
import { ArrowLeft, User, BookOpen } from "lucide-react";
import {
  safeDecodeURIComponent,
  safeEncodeURIComponent,
} from "@/lib/blog-utils";

interface AuthorPageProps {
  params: {
    author: string;
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

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params;
  const author = safeDecodeURIComponent(resolvedParams?.author);

  // Get all pages and filter by author with optional chaining
  const allPages = source?.getPages?.() || [];
  const authorPosts =
    allPages?.filter?.(
      (page) => page?.data?.author?.toLowerCase?.() === author?.toLowerCase?.()
    ) || [];

  const serializedPosts =
    authorPosts
      ?.map?.(convertToSerializable)
      ?.sort?.(
        (a, b) =>
          new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()
      ) || [];

  if (!authorPosts?.length) {
    notFound();
  }

  // Get author stats
  const totalPosts = serializedPosts?.length || 0;
  const featuredPosts =
    serializedPosts?.filter?.((post) => post?.featured)?.length || 0;
  const categories = Array.from(
    new Set(
      serializedPosts?.map?.((post) => post?.category)?.filter?.(Boolean) || []
    )
  );

  // Get recent posts (last 3)
  const recentPosts = serializedPosts?.slice?.(0, 3) || [];

  // Get most popular categories
  const categoryCounts =
    serializedPosts?.reduce?.((acc, post) => {
      const category = post?.category;
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

  const topCategories =
    Object.entries(categoryCounts)
      ?.sort?.(([, a], [, b]) => b - a)
      ?.slice?.(0, 3) || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background/95 to-muted/20">
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
            {/* Author Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/20 flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {author}
              </h1>
              <p className="text-muted-foreground mb-3">
                Technical writer sharing insights about development and
                programming
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-foreground font-medium">
                  {totalPosts} Articles
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground font-medium">
                  {categories?.length || 0} Topics
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground font-medium">
                  {featuredPosts} Featured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              All Articles ({totalPosts})
            </h2>
            <p className="text-sm text-muted-foreground">Latest first</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serializedPosts?.map?.((post, index) => (
              <BlogCard
                key={post?.url || index}
                post={post}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all authors
export async function generateStaticParams() {
  try {
    const pages = source?.getPages?.() || [];
    const authors = Array.from(
      new Set(
        pages?.map?.((page) => page?.data?.author)?.filter?.(Boolean) || []
      )
    );

    return (
      authors?.map?.((author) => ({
        author: safeEncodeURIComponent(author),
      })) || []
    );
  } catch (error) {
    console.error("Error generating author static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AuthorPageProps) {
  try {
    const resolvedParams = await params;
    const author = safeDecodeURIComponent(resolvedParams?.author);

    const allPages = source?.getPages?.() || [];
    const authorPosts =
      allPages?.filter?.(
        (page) =>
          page?.data?.author?.toLowerCase?.() === author?.toLowerCase?.()
      ) || [];

    return {
      title: `${author} - Author Profile | Code Index`,
      description: `Explore all ${
        authorPosts?.length || 0
      } articles written by ${author}. Discover insights, tutorials, and expertise across various technology topics.`,
      openGraph: {
        title: `${author} - Author | Code Index`,
        description: `Read ${
          authorPosts?.length || 0
        } articles by ${author} on various technology topics.`,
        url: `/author/${safeEncodeURIComponent(author)}`,
      },
      twitter: {
        card: "summary",
        title: `${author} - Author | Code Index`,
        description: `Read ${authorPosts?.length || 0} articles by ${author}.`,
      },
      alternates: {
        canonical: `/author/${safeEncodeURIComponent(author)}`,
      },
    };
  } catch (error) {
    console.error("Error generating author metadata:", error);
    return {
      title: "Author Profile | Code Index",
      description: "Explore articles by author on Code Index.",
    };
  }
}
