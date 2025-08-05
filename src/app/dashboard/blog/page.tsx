'use client';

import { useState } from 'react';
import { db, storage } from '@/utils/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function BlogDashboard() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const handlePost = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      let imageUrl = '';
      if (image) {
        const imgRef = ref(storage, `blog_images/${Date.now()}_${image.name}`);
        await uploadBytes(imgRef, image);
        imageUrl = await getDownloadURL(imgRef);
      }

      const content = editor?.getHTML();

      await addDoc(collection(db, 'posts'), {
        title,
        content,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      editor?.commands.setContent('');
      setImage(null);
      setPreviewUrl('');
      setSuccess('✅ Blog post created!');
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">
        Create New Blog Post
      </h2>

      {success && (
        <p className="text-green-600 text-center font-medium mb-4">{success}</p>
      )}

      <form onSubmit={handlePost} className="space-y-6">
        <input
          className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="border p-3 rounded dark:bg-gray-800 dark:text-white">
          <EditorContent editor={editor} />
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="dark:text-white"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 max-h-48 rounded-md"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Posting...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
}
