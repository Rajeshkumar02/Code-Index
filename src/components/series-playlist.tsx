"use client";

import Link from "next/link";
import { CirclePlay, CircleCheck, Clock3 } from "lucide-react";
import type { SeriesInfo } from "@/lib/series";

interface SeriesPlaylistProps {
  seriesInfo: SeriesInfo;
}

export default function SeriesPlaylist({ seriesInfo }: SeriesPlaylistProps) {
  const { title, description, posts, currentPostIndex } = seriesInfo;

  return (
    <div className="bg-linear-to-br from-muted/50 to-muted/30 rounded-xl border border-border/50 p-6 mb-8">
      {/* Series Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="shrink-0 mt-1">
          <CirclePlay className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span>{posts.length} episodes</span>
            <span>•</span>
            <span>Episode {currentPostIndex + 1} of {posts.length}</span>
          </div>
        </div>
      </div>

      {/* Series Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-medium text-primary">
            {Math.round(((currentPostIndex + 1) / posts.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentPostIndex + 1) / posts.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Series Posts List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-3">Episodes</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {posts.map((post, index) => {
            const isCurrent = post.isCurrentPost;
            const isCompleted = index < currentPostIndex;

            return (
              <Link
                key={post.slug}
                href={post.url}
                className={`
                  group flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${isCurrent 
                    ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                    : 'hover:bg-muted/50'
                  }
                `}
              >
                {/* Episode Number & Status */}
                <div className="shrink-0 flex items-center justify-center w-6 h-6">
                  {isCompleted ? (
                    <CircleCheck className="h-4 w-4 text-green-600" />
                  ) : isCurrent ? (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-xs font-medium text-muted-foreground">
                      {post.order}
                    </div>
                  )}
                </div>

                {/* Episode Title */}
                <div className="flex-1 min-w-0">
                  <p className={`
                    text-sm font-medium truncate transition-colors
                    ${isCurrent 
                      ? 'text-primary' 
                      : isCompleted 
                        ? 'text-foreground' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    }
                  `}>
                    {post.title}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0">
                  {isCurrent ? (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Clock3 className="h-3 w-3" />
                      <span>Current</span>
                    </div>
                  ) : isCompleted ? (
                    <div className="text-xs text-green-600 font-medium">
                      Complete
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Episode {post.order}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}