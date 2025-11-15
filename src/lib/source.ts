import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { createMDXSource } from "fumadocs-mdx/runtime/next";
import { blogPosts } from "@/.source";

export const source = loader({
  baseUrl: "/",
  source: createMDXSource(blogPosts),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const text = await page.data.getText("raw");

  return `# ${page.data.title}

${text}`;
}
