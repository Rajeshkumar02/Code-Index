import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

/**
 * Get or create a unique user ID stored in localStorage
 * This ID persists across sessions and is used to track user interactions
 */
export function getUserId(): string {
  if (typeof window === "undefined") return "";

  const STORAGE_KEY = "blog_user_id";
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}

/**
 * Get user's fingerprint for additional validation
 * This helps prevent abuse even if localStorage is cleared
 */
export function getUserFingerprint(): string {
  if (typeof window === "undefined") return "";

  const data = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width,
    screen.height,
    screen.colorDepth,
  ].join("|");

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
}
