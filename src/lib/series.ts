import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { source } from '@/lib/source';

// Interface for meta.json structure
interface SeriesMeta {
  title: string;
  description?: string;
  order?: string[];
  items?: Record<string, string>;
}

// Interface for series post data
interface SeriesPost {
  slug: string;
  title: string;
  url: string;
  isCurrentPost: boolean;
  order: number;
}

// Interface for complete series information
export interface SeriesInfo {
  title: string;
  description?: string;
  posts: SeriesPost[];
  currentPostIndex: number;
  nextPost?: SeriesPost;
  previousPost?: SeriesPost;
}

/**
 * Extract series folder name from a page URL or slugs
 * Example: "/dsa/part-1" → "dsa" or ["dsa", "part-1"] → "dsa"
 */
function extractSeriesFolder(page: any): string | null {
  // Try to get from slugs first (most reliable)
  if (page.slugs && Array.isArray(page.slugs) && page.slugs.length >= 2) {
    return page.slugs[0]; // First slug is the series folder
  }
  
  // Fallback to URL parsing
  if (page.url) {
    const pathParts = page.url.split('/').filter((part: string) => part.length > 0);
    if (pathParts.length >= 2) {
      return pathParts[0]; // First part after root is series folder
    }
  }
  
  return null;
}

/**
 * Load meta.json for a series if it exists
 * Looks for meta.json in the content/[series-folder]/ directory
 */
function loadSeriesMeta(seriesFolder: string): SeriesMeta | null {
  try {
    const metaPath = join(process.cwd(), 'content', seriesFolder, 'meta.json');
    
    if (!existsSync(metaPath)) {
      return null;
    }
    
    const metaContent = readFileSync(metaPath, 'utf-8');
    const meta: SeriesMeta = JSON.parse(metaContent);
    
    // Validate required fields
    if (!meta.title) {
      console.warn(`meta.json in ${seriesFolder} is missing required 'title' field`);
      return null;
    }
    
    return meta;
  } catch (error) {
    console.error(`Error loading meta.json for series ${seriesFolder}:`, error);
    return null;
  }
}

/**
 * Get all posts in the same series as the current post
 * Returns posts from the same folder, ordered according to meta.json or alphabetically
 */
function getSeriesPosts(seriesFolder: string, currentSlug: string): SeriesPost[] {
  try {
    // Get all pages from source
    const allPages = source.getPages();
    
    // Filter pages that belong to the same series folder
    const seriesPosts = allPages.filter(page => {
      const pageSeriesFolder = extractSeriesFolder(page);
      return pageSeriesFolder === seriesFolder;
    });
    
    // Load meta.json for ordering and custom titles
    const meta = loadSeriesMeta(seriesFolder);
    
    // Convert pages to SeriesPost format
    const posts: SeriesPost[] = seriesPosts.map(page => {
      // Extract slug from URL (remove leading slash)
      const slug = page.url.replace(/^\//, '');
      
      // Get custom title from meta.items or use page title
      const customTitle = meta?.items?.[slug] || page.data.title || slug;
      
      return {
        slug,
        title: customTitle,
        url: page.url,
        isCurrentPost: slug === currentSlug,
        order: 0 // Will be set below
      };
    });
    
    // Sort posts according to meta.order or alphabetically by slug
    if (meta?.order && Array.isArray(meta.order)) {
      // Sort according to meta.order
      posts.sort((a, b) => {
        const aIndex = meta.order!.indexOf(a.slug);
        const bIndex = meta.order!.indexOf(b.slug);
        
        // If both posts are in the order array, use that order
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // If only one is in the order array, it comes first
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // If neither is in the order array, sort alphabetically by slug
        return a.slug.localeCompare(b.slug);
      });
    } else {
      // Fallback to alphabetical sorting by slug
      posts.sort((a, b) => a.slug.localeCompare(b.slug));
    }
    
    // Assign order numbers after sorting
    posts.forEach((post, index) => {
      post.order = index + 1;
    });
    
    return posts;
  } catch (error) {
    console.error(`Error getting series posts for ${seriesFolder}:`, error);
    return [];
  }
}

/**
 * Get complete series information for a blog post
 * Returns null if the post is not part of a series (only one post in folder)
 */
export function getSeriesInfo(currentPage: any): SeriesInfo | null {
  try {
    // Extract series folder from current page
    const seriesFolder = extractSeriesFolder(currentPage);
    if (!seriesFolder) {
      return null;
    }
    
    // Get current post slug
    const currentSlug = currentPage.url.replace(/^\//, '');
    
    // Get all posts in the series
    const posts = getSeriesPosts(seriesFolder, currentSlug);
    
    // If there's only one post, don't show series UI
    if (posts.length <= 1) {
      return null;
    }
    
    // Load series metadata
    const meta = loadSeriesMeta(seriesFolder);
    
    // Find current post index
    const currentPostIndex = posts.findIndex(post => post.isCurrentPost);
    
    // Get next and previous posts
    const nextPost = currentPostIndex < posts.length - 1 ? posts[currentPostIndex + 1] : undefined;
    const previousPost = currentPostIndex > 0 ? posts[currentPostIndex - 1] : undefined;
    
    return {
      title: meta?.title || `${seriesFolder.charAt(0).toUpperCase() + seriesFolder.slice(1)} Series`,
      description: meta?.description,
      posts,
      currentPostIndex,
      nextPost,
      previousPost
    };
    
  } catch (error) {
    console.error('Error getting series info:', error);
    return null;
  }
}

/**
 * Check if a post is part of a series
 * Useful for conditional rendering
 */
export function isPartOfSeries(page: any): boolean {
  return getSeriesInfo(page) !== null;
}

/**
 * Get all available series from the content
 * Returns a list of series with their metadata and post counts
 */
export function getAllSeries() {
  try {
    const allPages = source.getPages();
    const seriesMap = new Map<string, {
      folder: string;
      meta: SeriesMeta | null;
      posts: any[];
    }>();
    
    // Group pages by series folder
    allPages.forEach(page => {
      const seriesFolder = extractSeriesFolder(page);
      if (seriesFolder) {
        if (!seriesMap.has(seriesFolder)) {
          seriesMap.set(seriesFolder, {
            folder: seriesFolder,
            meta: loadSeriesMeta(seriesFolder),
            posts: []
          });
        }
        seriesMap.get(seriesFolder)!.posts.push(page);
      }
    });
    
    // Convert to array and filter out single-post "series"
    const series = Array.from(seriesMap.values())
      .filter(s => s.posts.length > 1) // Only include actual series (multiple posts)
      .map(s => ({
        slug: s.folder,
        title: s.meta?.title || `${s.folder.charAt(0).toUpperCase() + s.folder.slice(1)} Series`,
        description: s.meta?.description,
        episodeCount: s.posts.length,
        posts: s.posts,
        lastUpdated: getLatestPostDate(s.posts),
        category: getMostCommonCategory(s.posts)
      }));
    
    return series;
  } catch (error) {
    console.error('Error getting all series:', error);
    return [];
  }
}

/**
 * Get the most recent date from a list of posts
 */
function getLatestPostDate(posts: any[]): string | undefined {
  const dates = posts
    .map(post => post.data?.date)
    .filter(date => date)
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
    
  if (dates.length > 0) {
    return dates[0].toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  }
  
  return undefined;
}

/**
 * Get the most common category from a list of posts
 */
function getMostCommonCategory(posts: any[]): string | undefined {
  const categories = posts
    .map(post => post.data?.category)
    .filter(category => category);
    
  if (categories.length === 0) return undefined;
  
  const categoryCount = categories.reduce((acc: Record<string, number>, category: string) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(categoryCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];
}