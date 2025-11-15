import {
  defineCollections,
  frontmatterSchema,
  defineConfig,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content",
  // add required frontmatter properties
  schema: frontmatterSchema.extend({
    author: z.string().describe("Author name"),
    date: z.string().date().or(z.date()).describe("Publication date"),
    category: z
      .string()
      .describe("Blog category (e.g., 'web-development', 'system-design')"),
    tags: z
      .array(z.string())
      .describe("Array of tags for the article")
      .optional(),
    readingTime: z
      .string()
      .describe("Estimated reading time (e.g., '5 min read')")
      .optional(),
    featured: z.boolean().describe("Mark as featured article").optional(),
    image: z.string().describe("Featured image URL").optional(),
    ogImage: z.string().describe("Custom OG image URL").optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
