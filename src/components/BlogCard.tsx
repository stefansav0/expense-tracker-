"use client";

import Link from "next/link";
import DOMPurify from "dompurify";
import { Timestamp } from "firebase/firestore";

interface BlogCardProps {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: Timestamp;
}

export default function BlogCard({
  id,
  title,
  content,
  imageUrl,
  createdAt,
}: BlogCardProps) {
  const formattedDate = createdAt
    ? createdAt.toDate().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300">
      <Link href={id ? `/blog/${id}` : "#"} className="block">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title ? `Cover image for ${title}` : "Blog image"}
            className="w-full h-48 sm:h-52 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-4 sm:p-5">
          <h2 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2">
            {title}
          </h2>

          <div
            className="text-gray-700 dark:text-gray-300 prose dark:prose-invert line-clamp-4 max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content),
            }}
          />

          {formattedDate && (
            <p className="text-sm text-gray-400 mt-4">{formattedDate}</p>
          )}
        </div>
      </Link>
    </div>
  );
}
