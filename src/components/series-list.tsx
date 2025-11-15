"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Users } from "lucide-react";

interface SeriesCardProps {
  title: string;
  description?: string;
  slug: string;
  episodeCount: number;
  lastUpdated?: string;
  category?: string;
}

export function SeriesCard({ 
  title, 
  description, 
  slug, 
  episodeCount, 
  lastUpdated, 
  category 
}: SeriesCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="group block p-6 bg-background border border-border/50 rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-200"
    >
      {/* Series Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            {category && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mt-1">
                {category}
              </span>
            )}
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Series Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{episodeCount} episodes</span>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated {lastUpdated}</span>
            </div>
          )}
        </div>
        <span className="text-primary font-medium">View Series →</span>
      </div>
    </Link>
  );
}

interface SeriesListProps {
  series: SeriesCardProps[];
}

export default function SeriesList({ series }: SeriesListProps) {
  if (series.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Series Available</h3>
        <p className="text-muted-foreground">Check back later for new learning series!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Learning Series</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Structured learning paths to master different topics step by step. Follow along with our comprehensive series designed to take you from beginner to expert.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((s, index) => (
          <SeriesCard key={index} {...s} />
        ))}
      </div>
    </div>
  );
}