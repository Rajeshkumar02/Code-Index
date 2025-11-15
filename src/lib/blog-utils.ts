// Utility functions for blog application

/**
 * Formats a category slug into a display name
 * @param category - Category slug (e.g., "web-development")
 * @returns Formatted category name (e.g., "Web Development")
 */
export function formatCategoryName(category?: string): string {
  if (!category) return "Category";

  return (
    category
      ?.split?.("-")
      ?.map?.((word) => word?.charAt?.(0)?.toUpperCase?.() + word?.slice?.(1))
      ?.join?.(" ") || "Category"
  );
}

/**
 * Formats a tag name for display
 * @param tag - Tag string
 * @returns Formatted tag name with proper casing
 */
export function formatTagName(tag?: string): string {
  if (!tag) return "Tag";

  return tag?.charAt?.(0)?.toUpperCase?.() + tag?.slice?.(1) || "Tag";
}

/**
 * Formats an author name for display
 * @param author - Author string
 * @returns Formatted author name
 */
export function formatAuthorName(author?: string): string {
  if (!author) return "Anonymous";

  return author || "Anonymous";
}

/**
 * Safely encodes a string for URL usage
 * @param str - String to encode
 * @returns URL-safe encoded string
 */
export function safeEncodeURIComponent(str?: string): string {
  if (!str) return "";

  try {
    return encodeURIComponent(str?.toLowerCase?.() || "");
  } catch {
    return "";
  }
}

/**
 * Safely decodes a URL component
 * @param str - Encoded string to decode
 * @returns Decoded string
 */
export function safeDecodeURIComponent(str?: string): string {
  if (!str) return "";

  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Formats a date for display
 * @param dateString - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(dateString?: string | Date): string {
  try {
    if (!dateString) return "Recent";

    const date = new Date(dateString);
    return (
      date?.toLocaleDateString?.("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) || "Recent"
    );
  } catch {
    return "Recent";
  }
}

/**
 * Counts posts by category
 * @param posts - Array of blog posts
 * @returns Record of category counts
 */
export function getCategoryStats(posts: any[]): Record<string, number> {
  return (posts || []).reduce((acc: Record<string, number>, post) => {
    const category = post?.data?.category;
    if (category) {
      acc[category] = (acc[category] || 0) + 1;
    }
    return acc;
  }, {});
}

/**
 * Counts posts by tag
 * @param posts - Array of blog posts
 * @returns Record of tag counts
 */
export function getTagStats(posts: any[]): Record<string, number> {
  return (posts || []).reduce((acc: Record<string, number>, post) => {
    if (post?.data?.tags) {
      post?.data?.tags?.forEach?.((tag: string) => {
        if (tag) {
          acc[tag] = (acc[tag] || 0) + 1;
        }
      });
    }
    return acc;
  }, {});
}
