'use client';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

export default function Editor({ content, onChange }: {
  content: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-2 outline-none border rounded bg-white dark:bg-gray-900",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-2">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
