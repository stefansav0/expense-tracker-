"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 rounded p-2 min-h-[200px] bg-white dark:bg-gray-900 dark:text-white">
      {editor ? <EditorContent editor={editor} /> : <p>Loading editor...</p>}
    </div>
  );
}
