const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  createPost,
  votePost,
} = require("../controllers/postController");

router.get("/", getAllPosts);
router.post("/", createPost);
router.post("/vote/:id", votePost);

module.exports = router;
