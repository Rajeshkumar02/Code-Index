"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowUpRight } from "lucide-react";
import { formatDate, safeEncodeURIComponent } from "@/lib/blog-utils";
import { useRouter } from "next/navigation";

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
        color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
      },
      "backend-development": {
        label: "Backend",
        color:
          "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
      },
      "mobile-development": {
        label: "Mobile Dev",
        color:
          "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
      },
      "system-design": {
        label: "System Design",
        color:
          "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950",
      },
      dsa: {
        label: "DSA",
        color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
      },
      "cloud-devops": {
        label: "DevOps",
        color: "text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950",
      },
      database: {
        label: "Database",
        color:
          "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950",
      },
      "tools-workflow": {
        label: "Tools",
        color:
          "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950",
      },
    };
    return (
      categoryMap[category || ""] || {
        label: "General",
        color: "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950",
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
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title || "Featured article"}
                  fill
                  priority={priority}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary/20 mb-2">
                      CODE
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">
                      {categoryInfo.label}
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full shadow-lg">
                  Featured
                </span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm ${categoryInfo.color} border border-white/20`}
                >
                  {categoryInfo.label}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date?.toString()}>
                    {formatDate(post.date || new Date())}
                  </time>
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime}</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg mb-6 line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
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
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title || "Blog post"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-muted via-muted/50 to-background flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground/30 mb-1">
                      {}
                    </div>
                    <div className="text-xs text-muted-foreground/60 uppercase tracking-wide">
                      {categoryInfo.label}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4 flex flex-col h-full">
            {/* Main Content */}
            <div className="flex-1">
              {/* Category & Date */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={(e) =>
                    handleCategoryClick(e, post?.category || "general")
                  }
                  className={`px-2.5 py-1 text-xs font-medium rounded-md ${categoryInfo?.color} hover:scale-105 transition-transform`}
                >
                  {categoryInfo?.label || "General"}
                </button>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={post?.date?.toString?.()}>
                    {formatDate(post?.date || new Date())}
                  </time>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors text-lg leading-tight">
                {post?.title || "Untitled"}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-3 line-clamp-3 leading-relaxed">
                {post?.description || "No description available."}
              </p>

              {/* Tags */}
              {(post?.tags?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post?.tags?.slice?.(0, 3)?.map?.((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => handleTagClick(e, tag)}
                      className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      #{tag}
                    </button>
                  )) || []}
                  {(post?.tags?.length || 0) > 3 && (
                    <span className="px-2 py-1 text-xs text-muted-foreground">
                      +{(post?.tags?.length || 0) - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {post?.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post?.readingTime}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                <span>Read more</span>
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
