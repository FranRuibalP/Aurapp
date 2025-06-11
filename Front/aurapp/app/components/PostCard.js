"use client";
import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

export default function PostCard({ post }) {
  const [vote, setVote] = useState({ check: 0, cross: 0, selected: null });

  const handleVote = (type) => {
    if (vote.selected === type) return;

    const update = {
      check: type === "check" ? 1 : 0,
      cross: type === "cross" ? 1 : 0,
      selected: type,
    };

    setVote(update);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700 shadow-md shadow-indigo-500 relative">
      <div className="flex items-start gap-4">
        <img
          src={post.image}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="font-bold">{post.user}</h2>
          <p className="mt-1">{post.description}</p>
          
        </div>
        <div
          className={`text-xl font-bold ${
            post.aura > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {post.aura > 0 ? `+${post.aura}` : post.aura}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Publicado por: {post.user}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVote("check")}
            className={`p-2 rounded-full transition ${
              vote.selected === "check"
                ? "bg-green-200"
                : "hover:bg-green-100"
            }`}
          >
            <FiCheck className="text-green-600 text-xl" />
          </button>
          <span>{vote.check}</span>

          <button
            onClick={() => handleVote("cross")}
            className={`p-2 rounded-full transition ${
              vote.selected === "cross"
                ? "bg-red-200"
                : "hover:bg-red-100"
            }`}
          >
            <FiX className="text-red-600 text-xl" />
          </button>
          <span>{vote.cross}</span>
        </div>
      </div>
    </div>
  );
}
