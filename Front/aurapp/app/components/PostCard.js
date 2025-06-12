"use client";
import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX ,FiLock, FiUnlock} from "react-icons/fi";
import axios from "axios";

export default function PostCard({ post }) {
  const [vote, setVote] = useState({ upvote: post.tickCount, downvote: post.crossCount, selected: null });
  const [userId,setUserId] = useState("")
  const postId = post._id
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    setUserId(user._id)
  })
  console.log(userId)
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
        voteType : type,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md max-w-sm mx-auto overflow-hidden"
    >
      
      {/* Top image */}
      <div className="relative w-full aspect-[4/4] overflow-hidden">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover"
        />
        {/* Lock Icon */}
        <div className="absolute top-2 right-2 bg-white/70 dark:bg-gray-900/70 rounded-full p-1">
          {post.auraImpactApplied ? (
            <FiLock className="text-gray-800 dark:text-white text-xl" />
          ) : (
            <FiUnlock className="text-gray-800 dark:text-white text-xl" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Aura */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {post.dedicatedTo.username}
          </h2>
          <div
            className={`text-lg font-semibold ${
              post.aura > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {post.aura > 0 ? `+${post.aura}` : post.aura}
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 text-gray-700 dark:text-gray-300">{post.description}</p>

        {/* Footer with avatar/username and voting */}
        <div className="flex justify-between items-center mt-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={post.author.profileImage}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {post.author.username}
            </span>
          </div>

          {/* Voting */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVote("upvote")}
              className={`p-2 rounded-full transition ${
                vote.selected === "upvote"
                  ? "bg-green-200"
                  : "hover:bg-green-100"
              }`}
            >
              <FiCheck className="text-green-600 text-xl" />
            </button>
            <span className="text-sm">{vote.upvote}</span>

            <button
              onClick={() => handleVote("downvote")}
              className={`p-2 rounded-full transition ${
                vote.selected === "downvote"
                  ? "bg-red-200"
                  : "hover:bg-red-100"
              }`}
            >
              <FiX className="text-red-600 text-xl" />
            </button>
            <span className="text-sm">{vote.downvote}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
