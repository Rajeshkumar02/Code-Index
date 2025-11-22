"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Flame,
  Lightbulb,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserId } from "@/lib/user-tracking";

type ReactionType = "like" | "love" | "dislike" | "clap" | "fire" | "insightful";

interface ReactionButtonsProps {
  slug: string;
}

interface ReactionCounts {
  like: number;
  love: number;
  dislike: number;
  clap: number;
  fire: number;
  insightful: number;
}

const reactionConfig = {
  like: { icon: ThumbsUp, color: "text-blue-600" },
  love: { icon: Heart, color: "text-red-500" },
  fire: { icon: Flame, color: "text-orange-500" },
  clap: { icon: Sparkles, color: "text-amber-500" },
  insightful: { icon: Lightbulb, color: "text-yellow-500" },
  dislike: { icon: ThumbsDown, color: "text-gray-500" },
};

export default function ReactionButtons({ slug }: ReactionButtonsProps) {
  const [reactions, setReactions] = useState<ReactionCounts>({
    like: 0,
    love: 0,
    dislike: 0,
    clap: 0,
    fire: 0,
    insightful: 0,
  });

  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRow, setShowRow] = useState(false);

  useEffect(() => {
    const userId = getUserId();

    const fetchReactions = async () => {
      try {
        const res = await fetch(`/api/reactions/${slug}?userId=${userId}`);
        const data = await res.json();
        setReactions(data.reactions);

        // Set user's reaction from server (not localStorage)
        if (data.userReaction) {
          setUserReaction(data.userReaction);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReactions();
  }, [slug]);

  const handleReaction = async (reaction: ReactionType) => {
    const userId = getUserId();
    const previous = userReaction;

    // Un-react
    if (previous === reaction) {
      setReactions((p) => ({
        ...p,
        [reaction]: Math.max(0, p[reaction] - 1),
      }));

      setUserReaction(null);
      setShowRow(false);

      await fetch(`/api/reactions/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction, previousReaction: reaction, userId }),
      });

      return;
    }

    // Switch reaction
    setReactions((p) => ({
      ...p,
      ...(previous && { [previous]: Math.max(0, p[previous] - 1) }),
      [reaction]: p[reaction] + 1,
    }));

    setUserReaction(reaction);
    setShowRow(false);

    await fetch(`/api/reactions/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction, previousReaction: previous, userId }),
    });
  };

  if (isLoading) return null;

  const ActiveIcon = userReaction ? reactionConfig[userReaction].icon : Smile;
  const activeColor = userReaction ? reactionConfig[userReaction].color : "text-muted-foreground";
  const activeCount = userReaction ? reactions[userReaction] : null;

  return (
    <div className="mt-6">
      {/* MAIN BUTTON */}
      {!showRow && (
        <button
          onClick={() => setShowRow(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer",
            "shadow-sm transition-all bg-background/70 backdrop-blur-sm",
            "hover:scale-105 active:scale-95"
          )}
        >
          <ActiveIcon className={cn("w-5 h-5", activeColor)} />

          {/* count ONLY after selection */}
          {userReaction && (
            <span className="text-xs opacity-70">
              {activeCount}
            </span>
          )}
        </button>
      )}

      {/* ICON ROW */}
      {showRow && (
        <div
          className="flex items-center gap-4 flex-wrap px-4 py-2 rounded-full border
          animate-fadeIn animate-slideUp"
        >
          {(Object.keys(reactionConfig) as ReactionType[]).map((type, i) => {
            const { icon: Icon, color } = reactionConfig[type];

            return (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className={cn(
                  "transition-all cursor-pointer",
                  "hover:scale-125 active:scale-95",
                  "animate-fadeIn"
                )}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <Icon className={cn("w-5 h-5", color)} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
