import { source } from "@/lib/source";
import BlogCard from "@/components/blog-card";

// Convert MDX page data to plain objects for client components with optional chaining
function convertToPlainData(post: any) {
  return {
    url: post?.url || "",
    title: post?.data?.title || "Untitled",
    description: post?.data?.description || "",
    author: post?.data?.author || "Anonymous",
    date: post?.data?.date || new Date().toISOString(),
    category: post?.data?.category || "general",
    tags: post?.data?.tags || [],
    readingTime: post?.data?.readingTime || "5 min read",
    featured: post?.data?.featured || false,
    image: post?.data?.image || "",
  };
}

export default function Home() {
  const posts = source?.getPages?.() || [];

  // Sort posts by date (newest first) with optional chaining
  const sortedPosts =
    posts?.sort?.((a, b) => {
      const dateA = new Date(a?.data?.date || 0).getTime();
      const dateB = new Date(b?.data?.date || 0).getTime();
      return dateB - dateA;
    }) || [];

  const featuredPost =
    sortedPosts?.find?.((post) => post?.data?.featured) || sortedPosts?.[0];
  const regularPosts =
    sortedPosts?.filter?.((post) => post !== featuredPost) || [];

  // Convert to plain data for client components
  const plainFeaturedPost = featuredPost
    ? convertToPlainData(featuredPost)
    : null;
  const plainRegularPosts = regularPosts?.map?.(convertToPlainData) || [];

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        {/* Featured Article */}
        {plainFeaturedPost && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 bg-primary rounded"></div>
              <h2 className="text-2xl font-bold">Featured Article</h2>
            </div>

            <BlogCard
              post={plainFeaturedPost}
              variant="featured"
              priority={true}
            />
          </section>
        )}

        {/* Latest Articles */}
        {plainRegularPosts?.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 bg-blue-500 rounded"></div>
              <h2 className="text-2xl font-bold">Latest Articles</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plainRegularPosts?.map((post) => (
                <BlogCard key={post.url} post={post} variant="default" />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {posts?.length === 0 && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2">No articles yet</h2>
              <p className="text-muted-foreground">
                Check back soon for new content!
              </p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
