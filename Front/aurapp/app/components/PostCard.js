"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiLock, FiUnlock, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import RootLayout from "../layout";

export default function PostCard({ post }) {
  const [vote, setVote] = useState({
    upvote: post.tickCount,
    downvote: post.crossCount,
    selected: null,
  });
  const [userId, setUserId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const postId = post._id;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user?._id || "");
  }, []);

  useEffect(() => {
    const userHasVotedCheck = post.upvotedBy.map(id => id.toString()).includes(userId);
    const userHasVotedCross = post.downvotedBy.map(id => id.toString()).includes(userId);

    setVote({
      upvote: post.tickCount,
      downvote: post.crossCount,
      selected: userHasVotedCheck ? "upvote" : userHasVotedCross ? "downvote" : null,
    });
  }, [post, userId]);

  const handleVote = async (type) => {
    if (vote.selected === type) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}posts/vote/${postId}`, {
        userId,
        voteType: type,
      });
      const updated = res.data;
      setVote({
        upvote: updated.tickCount,
        downvote: updated.crossCount,
        selected: type,
      });
    } catch (err) {
      console.error("Error al votar:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_URL_BACKEND}posts/${postId}`);
      setShowDeleteModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar el post:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-md max-w-sm mx-auto overflow-hidden"
    >
      {/* Imagen del post */}
      <div className="relative aspect-[4/4] w-full">
        <img src={post.image} alt="Post" className="w-full h-full object-cover rounded-t-2xl" />
        {/* Lock Icon */}
        <div className="absolute top-3 right-3 bg-white dark:bg-zinc-800 p-1.5 rounded-full shadow">
          {post.auraImpactApplied ? (
            <FiLock className="text-zinc-700 dark:text-white text-lg" />
          ) : (
            <FiUnlock className="text-zinc-700 dark:text-white text-lg" />
          )}
        </div>
        {/* Botón eliminar */}
        {userId === post.author._id && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="cursor-pointer absolute top-3 left-3 bg-rose-600 hover:bg-rose-700 p-1.5 rounded-full text-white shadow"
            title="Eliminar post"
          >
            <FiTrash2 className="text-base" />
          </button>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white truncate">
            {post.dedicatedTo.username}
          </h2>
          <span
            className={`text-xl font-bold ${
              post.aura > 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {post.aura > 0 ? `+${post.aura}` : post.aura}
          </span>
        </div>

        <p className="text-sm text-zinc-700 dark:text-zinc-300">{post.description}</p>

        {/* Autor y votos */}
        <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <img
              src={post.author.profileImage}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border"
            />
            <span className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
              {post.author.username}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVote("upvote")}
              className={`cursor-pointer p-2 rounded-full border border-emerald-400 transition duration-150 ${
                vote.selected === "upvote" ? "bg-emerald-100" : "hover:bg-emerald-50"
              }`}
            >
              <FiCheck className="text-green-600 text-lg" />
            </button>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">{vote.upvote}</span>

            <button
              onClick={() => handleVote("downvote")}
              className={`cursor-pointer p-2 rounded-full border border-rose-400 transition duration-150 ${
                vote.selected === "downvote" ? "bg-rose-100" : "hover:bg-rose-50"
              }`}
            >
              <FiX className="text-red-600 text-lg" />
            </button>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">{vote.downvote}</span>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="mr-4 ml-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-lg font-semibold text-rose-600">¿Eliminar post?</h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cursor-pointer px-4 py-2 rounded-md bg-zinc-200 dark:bg-zinc-700 text-sm hover:bg-zinc-300 dark:hover:bg-zinc-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer px-4 py-2 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
