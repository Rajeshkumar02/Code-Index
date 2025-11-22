"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { getUserId } from "@/lib/user-tracking";

interface ViewCounterProps {
  slug: string;
  trackView?: boolean;
}

export default function ViewCounter({ slug, trackView = true }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const userId = getUserId();

    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`);
        const data = await res.json();
        setViews(data.views);
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    };

    fetchViews();

    if (trackView && userId) {
      // Track view with user ID
      const incrementView = async () => {
        try {
          await fetch(`/api/views/${slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
        } catch (error) {
          console.error("Error incrementing view:", error);
        }
      };
      incrementView();
    }
  }, [slug, trackView]);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground" title={`${views} views`}>
      <Eye className="h-4 w-4" />
      <span>{views.toLocaleString()}</span>
    </div>
  );
}
