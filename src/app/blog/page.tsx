"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";
import BlogCard from "@/components/BlogCard";

interface BlogPost {
  id: string;
  title: string;
  imageUrl?: string;
  content: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const fetchedPosts: BlogPost[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[];

        setPosts(fetchedPosts);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(
          err?.message || "Something went wrong while loading blog posts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        Blog & Financial Tips
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          ⏳ Fetching the latest posts...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-center text-red-500 dark:text-red-400">{error}</p>
      )}

      {/* No Posts */}
      {!loading && !error && posts.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          🚫 No blog posts found.
        </p>
      )}

      {/* Blog List */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
