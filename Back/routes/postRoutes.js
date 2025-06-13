const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  createPost,
  votePost,
  getPostsById,
  deletePost,
} = require("../controllers/postController");

router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/user/:id", getPostsById);
router.post("/vote/:id", votePost);
router.delete("/:id", deletePost);

module.exports = router;
