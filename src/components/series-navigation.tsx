"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import type { SeriesInfo } from "@/lib/series";

interface SeriesNavigationProps {
  seriesInfo: SeriesInfo;
}

export default function SeriesNavigation({ seriesInfo }: SeriesNavigationProps) {
  const { previousPost, nextPost, posts, currentPostIndex } = seriesInfo;

  // Don't show navigation if there's only one post
  if (posts.length <= 1) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border/50">
      {/* Previous Post */}
      <div className="flex justify-start">
        {previousPost ? (
          <Link
            href={previousPost.url}
            className="group flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 bg-background hover:bg-muted/50 transition-all duration-200 max-w-full"
          >
            <div className="shrink-0">
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                Previous Episode
              </p>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {previousPost.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Episode {previousPost.order} of {posts.length}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border/20 bg-muted/30 text-muted-foreground/50">
            <ChevronLeft className="h-5 w-5" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide">First Episode</p>
              <p className="text-sm">No previous episode</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Post */}
      <div className="flex justify-end">
        {nextPost ? (
          <Link
            href={nextPost.url}
            className="group flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 bg-background hover:bg-muted/50 transition-all duration-200 max-w-full text-right"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                Next Episode
              </p>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {nextPost.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Episode {nextPost.order} of {posts.length}
              </p>
            </div>
            <div className="shrink-0">
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border/20 bg-muted/30 text-muted-foreground/50 text-right">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide">Final Episode</p>
              <p className="text-sm">No next episode</p>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

// Optional: Compact version for mobile or inline use
interface CompactSeriesNavigationProps {
  seriesInfo: SeriesInfo;
}

export function CompactSeriesNavigation({ seriesInfo }: CompactSeriesNavigationProps) {
  const { previousPost, nextPost, title } = seriesInfo;

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
      {/* Series Info */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <PlayCircle className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-medium text-muted-foreground truncate">
          {title}
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {previousPost ? (
          <Link
            href={previousPost.url}
            className="p-2 rounded-md border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-colors"
            title={`Previous: ${previousPost.title}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <button 
            disabled 
            className="p-2 rounded-md border border-border/20 text-muted-foreground/30 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {nextPost ? (
          <Link
            href={nextPost.url}
            className="p-2 rounded-md border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-colors"
            title={`Next: ${nextPost.title}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <button 
            disabled 
            className="p-2 rounded-md border border-border/20 text-muted-foreground/30 cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}