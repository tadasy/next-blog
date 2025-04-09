import { getPosts, searchPosts } from "@/lib/post";
import PostCard from "@/components/post/PostCard";
import { Post } from "@/types/post";

type SearchParams = Promise<{ search?: string }>;

export default async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.search || '';
  const posts = query ? await searchPosts(query) : await getPosts();
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 && posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <div className="col-span-3 text-center">
            <p className="text-lg text-gray-500">No posts found.</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
