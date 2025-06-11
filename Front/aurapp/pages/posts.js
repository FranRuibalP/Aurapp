"use client";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Navbar from "../app/components/Navbar";
import PostCard from "../app/components/PostCard";
import RootLayout from "../app/layout";

export default function PostsPage(aura) {
  const posts = [
    {
      id: 1,
      user: "Francisco",
      description: "Gran ayuda en el desarrollo del proyecto",
      aura: 100,
      image: "https://avatar.iran.liara.run/public/7",
      createdAt: "2025-06-08T12:00:00Z",
    },
    {
      id: 2,
      user: "Matias",
      description: "No participó como se esperaba",
      aura: -50,
      image: "https://avatar.iran.liara.run/public/2",
      createdAt: "2025-06-07T18:30:00Z",
    },
  ];

  return (
    <div className="relative min-h-screen flex justify-center mt-10 bg-transparent text-black dark:text-white">
      <Navbar />
      
      <main className="w-full max-w-2xl mt-6 space-y-6 mr-4 ml-4">
        <h1 className="text-3xl font-bold mb-4 justify-center flex">Posts</h1>
        {posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </main>

      <Link
        href={{ pathname: "/post-aura", query: { aura } }}
        className="fixed bottom-6 right-6 bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        aria-label="Crear nuevo post"
      >
        <FiPlus className="text-2xl" />
      </Link>
    </div>
  );
}
