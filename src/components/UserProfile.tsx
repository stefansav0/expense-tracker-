"use client";

import { useAuth } from "@/context/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
          {user.displayName?.charAt(0) || "U"}
        </div>
      )}
      <div>
        <div className="font-bold">{user.displayName || "No Name"}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
      </div>
    </div>
  );
}
