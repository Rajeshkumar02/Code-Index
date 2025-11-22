"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  slug: string;
}

export default function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/${slug}`);
        const data = await res.json();
        setLikes(data.likes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();

    // Check local storage to see if already liked
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    if (likedPosts.includes(slug)) {
      setIsLiked(true);
    }
  }, [slug]);

  const handleLike = async () => {
    if (isLiked) return; // Prevent multiple likes

    // Optimistic update
    setLikes((prev) => prev + 1);
    setIsLiked(true);

    // Save to local storage
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    localStorage.setItem("liked_posts", JSON.stringify([...likedPosts, slug]));

    try {
      await fetch(`/api/likes/${slug}`, { method: "POST" });
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  if (isLoading) return null;

  return (
    <button
      onClick={handleLike}
      disabled={isLiked}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border",
        isLiked
          ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400"
          : "bg-background border-border hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-900/10"
      )}
      aria-label="Like this post"
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-300",
          isLiked ? "fill-current scale-110" : "scale-100"
        )}
      />
      <span className="font-medium">{likes}</span>
    </button>
  );
}
