import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: { id: string };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const id = params?.id;

  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return notFound();

    const post = docSnap.data();
    const createdAt = post.createdAt?.seconds
      ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
      : "";

    return (
      <div className="max-w-3xl mx-auto p-6 mt-10">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">{post.title}</h1>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-[400px] object-cover rounded mb-6"
          />
        )}

        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">
          Published on {createdAt}
        </p>

        <div
          className="prose prose-lg dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    return notFound();
  }
}
