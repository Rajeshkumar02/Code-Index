import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blog-card";
import Link from "next/link";
import { ChevronLeft, FolderOpen } from "lucide-react";
import { formatCategoryName, safeEncodeURIComponent } from "@/lib/blog-utils";

interface CategoryPageProps {
  params: {
    category: string;
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams?.category || "";

  // Get all pages and filter by category with optional chaining
  const allPages = source?.getPages?.() || [];
  const categoryPosts =
    allPages?.filter?.((page) => page?.data?.category === category) || [];

  const serializedPosts =
    categoryPosts
      ?.map?.(convertToSerializable)
      ?.sort?.(
        (a, b) =>
          new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()
      ) || [];

  if (!categoryPosts?.length) {
    notFound();
  }

  // Format category name for display
  const categoryName = formatCategoryName(category);

  // Get authors in this category
  const authors = Array.from(
    new Set(
      serializedPosts?.map?.((post) => post?.author)?.filter?.(Boolean) || []
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Navigation */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Compact Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-6 mb-6">
            {/* Category Icon */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/20 flex items-center justify-center">
              <FolderOpen className="h-7 w-7 text-primary" />
            </div>

            {/* Category Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {categoryName}
              </h1>
              <p className="text-muted-foreground mb-3">
                Guides, tutorials, and insights covering{" "}
                {categoryName?.toLowerCase?.()} development
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-foreground font-medium">
                  {serializedPosts?.length || 0} Articles
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground font-medium">
                  {authors?.length || 0} Contributors
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Latest Articles ({serializedPosts?.length || 0})
            </h2>
            <p className="text-sm text-muted-foreground">Latest first</p>
          </div>

          {/* Posts Grid */}
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

// Generate static params for all categories
export async function generateStaticParams() {
  try {
    const pages = source?.getPages?.() || [];
    const categories = Array.from(
      new Set(
        pages?.map?.((page) => page?.data?.category)?.filter?.(Boolean) || []
      )
    );

    return (
      categories?.map?.((category) => ({
        category: category || "",
      })) || []
    );
  } catch (error) {
    console.error("Error generating category static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const resolvedParams = await params;
    const category = resolvedParams?.category || "";
    const categoryName = formatCategoryName(category);

    const allPages = source?.getPages?.() || [];
    const categoryPosts =
      allPages?.filter?.((page) => page?.data?.category === category) || [];

    return {
      title: `${categoryName} - Blog Category | Code Index`,
      description: `Explore ${
        categoryPosts?.length || 0
      } ${categoryName?.toLowerCase?.()} articles covering various topics and technologies.`,
      openGraph: {
        title: `${categoryName} Articles | Code Index`,
        description: `Discover ${
          categoryPosts?.length || 0
        } ${categoryName?.toLowerCase?.()} posts covering various topics and technologies.`,
        url: `/category/${category}`,
      },
      twitter: {
        card: "summary",
        title: `${categoryName} Articles | Code Index`,
        description: `Discover ${
          categoryPosts?.length || 0
        } ${categoryName?.toLowerCase?.()} posts.`,
      },
      alternates: {
        canonical: `/category/${category}`,
      },
    };
  } catch (error) {
    console.error("Error generating category metadata:", error);
    return {
      title: "Category | Code Index",
      description: "Explore articles by category on Code Index.",
    };
  }
}
