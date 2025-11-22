"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock3, CircleUser, ArrowUpRight } from "lucide-react";
import { formatDate, safeEncodeURIComponent } from "@/lib/blog-utils";
import { useRouter } from "next/navigation";
import BlogImageFallback from "@/components/blog-image-fallback";

// Plain object interface for client components
interface BlogPostData {
  url: string;
  title: string;
  description?: string;
  author?: string;
  date?: string | Date;
  category?: string;
  tags?: string[];
  readingTime?: string;
  featured?: boolean;
  image?: string;
}

interface BlogCardProps {
  post: BlogPostData;
  variant?: "default" | "featured" | "minimal";
  priority?: boolean;
}

const BlogCard = ({
  post,
  variant = "default",
  priority = false,
}: BlogCardProps) => {
  const isFeatured = variant === "featured";
  const isMinimal = variant === "minimal";
  const router = useRouter();

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/category/${category}`);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/tag/${safeEncodeURIComponent(tag)}`);
  };

  const handleAuthorClick = (e: React.MouseEvent, author: string) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/author/${safeEncodeURIComponent(author)}`);
  };

  const getCategoryInfo = (category?: string) => {
    const categoryMap: Record<string, { label: string; color: string }> = {
      "web-development": {
        label: "Web Development",
        color: "text-blue-700 bg-blue-100 dark:text-blue-100 dark:bg-blue-900/80",
      },
      "backend-development": {
        label: "Backend",
        color:
          "text-emerald-700 bg-emerald-100 dark:text-emerald-100 dark:bg-emerald-900/80",
      },
      "mobile-development": {
        label: "Mobile Dev",
        color:
          "text-purple-700 bg-purple-100 dark:text-purple-100 dark:bg-purple-900/80",
      },
      "system-design": {
        label: "System Design",
        color:
          "text-orange-700 bg-orange-100 dark:text-orange-100 dark:bg-orange-900/80",
      },
      dsa: {
        label: "DSA",
        color: "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-900/80",
      },
      "cloud-devops": {
        label: "DevOps",
        color: "text-cyan-700 bg-cyan-100 dark:text-cyan-100 dark:bg-cyan-900/80",
      },
      database: {
        label: "Database",
        color:
          "text-yellow-700 bg-yellow-100 dark:text-yellow-100 dark:bg-yellow-900/80",
      },
      "tools-workflow": {
        label: "Tools",
        color:
          "text-indigo-700 bg-indigo-100 dark:text-indigo-100 dark:bg-indigo-900/80",
      },
    };
    return (
      categoryMap[category || ""] || {
        label: "General",
        color: "text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-800/80",
      }
    );
  };

  const categoryInfo = getCategoryInfo(post?.category);

  if (isFeatured) {
    return (
      <article className="group relative">
        <Link href={post.url} className="block">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-border/60 transition-all duration-300">
            {/* Image Section */}
            <div className="aspect-video sm:aspect-2/1 relative overflow-hidden">
              <BlogImageFallback
                src={post.image}
                alt={post.title || "Featured article"}
                title={post.title}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 text-xs font-semibold bg-fd-primary text-fd-primary-foreground rounded-full shadow-lg">
                  Featured
                </span>
              </div>

              {/* Category Badge */}
              <div className="absolute bottom-4 right-4">
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm ${categoryInfo.color} border border-white/20`}
                >
                  {categoryInfo.label}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    <time dateTime={post.date?.toString()}>
                      {formatDate(post.date || new Date())}
                    </time>
                  </div>
                  {post.readingTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4" />
                      <span>{post.readingTime}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
                  {post.title}
                </h2>

                <p className="text-muted-foreground text-base sm:text-lg mb-6 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleUser className="h-5 w-5" />
                  <button
                    onClick={(e) => handleAuthorClick(e, post?.author || "")}
                    className="font-medium hover:text-primary transition-colors text-left"
                  >
                    {post?.author || "Anonymous"}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                  <span>Read Article</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group h-full">
      <Link href={post.url} className="block h-full">
        <div className="h-full bg-card border border-border hover:border-primary/20 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          {/* Image */}
          {!isMinimal && (
            <div className="aspect-16/10 relative overflow-hidden">
              <BlogImageFallback
                src={post.image}
                alt={post.title || "Blog post"}
                title={post.title}
                className="w-full h-full"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-5 flex flex-col h-full">
            {/* Main Content */}
            <div className="flex-1">
              {/* Category & Date */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={(e) =>
                    handleCategoryClick(e, post?.category || "general")
                  }
                  className={`px-2.5 py-1 text-xs font-medium rounded-md ${categoryInfo?.color} hover:scale-105 transition-transform`}
                >
                  {categoryInfo?.label || "General"}
                </button>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <time dateTime={post?.date?.toString?.()}>
                    {formatDate(post?.date || new Date())}
                  </time>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors text-lg leading-snug tracking-tight">
                {post?.title || "Untitled"}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                {post?.description || "No description available."}
              </p>

              {/* Tags */}
              {(post?.tags?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post?.tags?.slice?.(0, 3)?.map?.((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => handleTagClick(e, tag)}
                      className="px-2 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors border border-border/50"
                    >
                      #{tag}
                    </button>
                  )) || []}
                  {(post?.tags?.length || 0) > 3 && (
                    <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
                      +{(post?.tags?.length || 0) - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/40">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {post?.readingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    <span>{post?.readingTime}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                <span>Read more</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
