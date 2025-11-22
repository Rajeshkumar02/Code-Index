"use client";

import Link from "next/link";
import { ArrowRight, Clock3, CalendarDays } from "lucide-react";

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

interface PostSuggestionsProps {
  currentPost: BlogPostData;
  allPosts: BlogPostData[];
  maxSuggestions?: number;
}

interface SuggestedPost extends BlogPostData {
  reason?: string;
}

const PostSuggestions = ({
  currentPost,
  allPosts = [],
  maxSuggestions = 3,
}: PostSuggestionsProps) => {
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  const getSuggestedPosts = (): SuggestedPost[] => {
    // Filter out current post
    const otherPosts =
      allPosts?.filter((post) => post?.url !== currentPost?.url) || [];

    // Get posts from same category first
    const sameCategoryPosts =
      otherPosts?.filter(
        (post) => post?.category && post?.category === currentPost?.category
      ) || [];

    // Get posts with similar tags
    const currentTags = currentPost?.tags || [];
    const similarTagsPosts =
      otherPosts?.filter((post) => {
        if (!post?.tags || currentTags?.length === 0) return false;
        return post?.tags?.some((tag: string) => currentTags?.includes(tag));
      }) || [];

    // Get recent posts as fallback
    const recentPosts =
      otherPosts?.sort((a, b) => {
        const dateA = new Date(a?.date || 0).getTime();
        const dateB = new Date(b?.date || 0).getTime();
        return dateB - dateA;
      }) || [];

    // Combine and deduplicate suggestions with priority:
    // 1. Same category posts
    // 2. Similar tags posts
    // 3. Recent posts
    const suggestions = new Map<string, SuggestedPost>();

    // Add same category posts first
    sameCategoryPosts?.slice(0, maxSuggestions)?.forEach((post) => {
      if (post?.url) {
        suggestions.set(post.url, { ...post, reason: "Same category" });
      }
    });

    // Add similar tags posts if we need more
    if (suggestions.size < maxSuggestions) {
      similarTagsPosts
        ?.slice(0, maxSuggestions - suggestions.size)
        ?.forEach((post) => {
          if (post?.url && !suggestions.has(post.url)) {
            suggestions.set(post.url, { ...post, reason: "Similar topics" });
          }
        });
    }

    // Fill remaining with recent posts
    if (suggestions.size < maxSuggestions) {
      recentPosts
        ?.slice(0, maxSuggestions - suggestions.size)
        ?.forEach((post) => {
          if (post?.url && !suggestions.has(post.url)) {
            suggestions.set(post.url, { ...post, reason: "Recent" });
          }
        });
    }

    return Array.from(suggestions.values())?.slice(0, maxSuggestions) || [];
  };

  const suggestedPosts = getSuggestedPosts();

  if (!suggestedPosts?.length) {
    return null;
  }

  return (
    <section className="mt-16 pt-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Continue Reading
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Explore more articles that might interest you
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suggestedPosts?.map((post, index) => (
          <Link
            key={post?.url || index}
            href={post?.url || "#"}
            className="group block"
          >
            <article className="h-full bg-background border border-border/50 rounded-xl p-4 sm:p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              {/* Header with Badge */}
              <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">
                  {post?.reason || "Related"}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-lg leading-snug">
                  {post?.title || "Untitled"}
                </h3>

                {post?.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                )}

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2">
                  <time
                    dateTime={post?.date?.toString()}
                    className="flex items-center gap-1"
                  >
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(post?.date || new Date())}
                  </time>

                  {post?.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {post.readingTime}
                    </span>
                  )}

                  {post?.category && (
                    <span className="px-2 py-0.5 bg-muted/50 rounded text-xs font-medium capitalize">
                      {post.category.replace("-", " ")}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {post?.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {post.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-muted/30 text-muted-foreground rounded border border-border/30"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs text-muted-foreground/70">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* View More */}
      {(allPosts?.length || 0) > maxSuggestions + 1 && (
        <div className="text-center mt-8 pt-6 border-t border-border/30">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 rounded-lg transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default PostSuggestions;
