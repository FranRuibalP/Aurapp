const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    author: { // Usuario que lo publica
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dedicatedTo: { // Usuario a quien va dirigido el post
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: String,
    aura: Number,
    publisher: String,
    tickCount: { type: Number, default: 0 },
    crossCount: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    auraImpactApplied: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
