'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdmin, ADMIN_EMAIL } from "@/utils/isAdmin";
import { db } from "@/utils/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import dynamic from "next/dynamic";

// ✅ Dynamically import the Tiptap editor
const TiptapEditor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin(user.email)) {
      router.push("/");
    }
  }, [user]);

  const handlePostSubmit = async () => {
    if (!title || !content) {
      return alert("Please fill in all fields");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        createdAt: Timestamp.now(),
        author: {
          name: user?.displayName || "Admin",
          email: user?.email || ADMIN_EMAIL,
        },
      });

      setTitle("");
      setContent("");
      alert("Post published!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard – Create Blog Post</h1>

      <input
        type="text"
        placeholder="Post title"
        className="w-full border p-2 mb-4 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mb-4">
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      <button
        onClick={handlePostSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Post"}
      </button>
    </div>
  );
}
