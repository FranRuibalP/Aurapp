"use client";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Navbar from "../app/components/Navbar";
import PostCard from "../app/components/PostCard";
import RootLayout from "../app/layout";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function PostsPage(aura) {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const POSTS_PER_LOAD = 10;

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL_BACKEND}posts`)
      .then((response) => {
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setVisiblePosts(sortedPosts.slice(0, POSTS_PER_LOAD));
      })
      .catch((error) => {
        console.error("Error al obtener los posts:", error);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMore
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePosts, showOnlyOpen, hasMore, posts]);

  const loadMorePosts = () => {
    const filtered = showOnlyOpen
      ? posts.filter((post) => !post.auraImpactApplied)
      : posts;

    const nextPosts = filtered.slice(visiblePosts.length, visiblePosts.length + POSTS_PER_LOAD);
    if (nextPosts.length === 0) {
      setHasMore(false);
      return;
    }
    setVisiblePosts([...visiblePosts, ...nextPosts]);
  };

  const toggleFilter = () => {
    setShowOnlyOpen((prev) => !prev);
    setHasMore(true);

    const filtered = !showOnlyOpen
      ? posts.filter((post) => !post.auraImpactApplied)
      : posts;

    setVisiblePosts(filtered.slice(0, POSTS_PER_LOAD));
  };

  return (
    <div className="relative min-h-screen flex justify-center mt-10 mb-30 bg-transparent text-black dark:text-white">
      <Navbar />

      <main className="w-full max-w-2xl mt-6 space-y-6 mr-4 ml-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Posts</h1>
          <button
            onClick={toggleFilter}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            {showOnlyOpen ? "Mostrar todos" : "Mostrar solo abiertos"}
          </button>
        </div>

        {visiblePosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

        {!hasMore && (
          <p className="text-center text-gray-500 mt-8">No hay más posts para mostrar.</p>
        )}
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
