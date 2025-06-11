"use client";
import { useEffect, useState } from "react";
import PostCard from "../app/components/PostCard";
import Navbar from "../app/components/Navbar";
import RootLayout from "../app/layout";

export default function ProfilePage() {
  // Simulación de usuario y posts asociados
  const user = {
    name: "Francisco",
    image: "https://avatar.iran.liara.run/public/boy?username=Ash",
    aura: 120, // positivo o negativo
  };

  const allPosts = [
    {
      id: 1,
      user: "Francisco",
      description: "Ayudé al equipo con el frontend",
      aura: 80,
      image: "https://avatar.iran.liara.run/public/boy?username=Ash",
      createdAt: "2025-06-08T12:00:00Z",
    },
    {
      id: 2,
      user: "Francisco",
      description: "Coordiné las reuniones",
      aura: 40,
      image: "https://avatar.iran.liara.run/public/boy?username=Ash",
      createdAt: "2025-06-06T15:45:00Z",
    },
    {
      id: 3,
      user: "Sofía",
      description: "No hizo su parte",
      aura: -50,
      image: "/profile2.jpg",
      createdAt: "2025-06-05T10:20:00Z",
    },
  ];

  const posts = allPosts.filter((post) => post.user === user.name);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Navbar />

      <div className="pt-24 px-4 flex flex-col items-center gap-4">
        {/* Imagen de perfil con aura */}
        <div
          className="rounded-full overflow-hidden relative border border-indigo-200 dark:border-indigo-700 shadow-lg shadow-indigo-500/50"
        >
          <img
            src={user.image}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover "
          />
        </div>

        {/* Nombre */}
        <h1 className="text-2xl font-bold">{user.name}</h1>

        {/* Historial de posts */}
        <div className="w-full max-w-2xl mt-6 space-y-6">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No hay publicaciones.</p>
          ) : (
            posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
