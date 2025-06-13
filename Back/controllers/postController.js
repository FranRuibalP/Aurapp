const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Obtener todos los posts con datos del autor y del destinatario
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username profileImage")
      .populate("dedicatedTo", "username profileImage");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener posts" });
  }
};

// Crear un nuevo post con referencias válidas
exports.createPost = async (req, res) => {
  try {
    const { author, dedicatedTo, description, aura ,image, imagePublicId,auraImpactApplied} = req.body;

    // Validar que los usuarios existan
    const authorExists = await User.findById(author);
    const recipientExists = await User.findById(dedicatedTo);
    if (!authorExists || !recipientExists) {
      return res.status(400).json({ message: "Autor o destinatario inválido." });
    }

    const newPost = new Post({
      author,
      dedicatedTo,
      description,
      aura,
      image,
      imagePublicId,
      auraImpactApplied,
    });

    await newPost.save();
    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "username profileImage")
      .populate("dedicatedTo", "username profileImage");

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(400).json({ message: "Error al crear post" });
  }
};

// Votar un post
exports.votePost = async (req, res) => {
  const { userId, voteType } = req.body;
  const { id: postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("author", "username profileImage");
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const hasUpvoted = post.upvotedBy.includes(userId);
    const hasDownvoted = post.downvotedBy.includes(userId);

    if (voteType === "upvote") {
      if (hasUpvoted) return res.status(400).json({ message: "Ya votaste positivamente." });

      if (hasDownvoted) {
        post.downvotedBy.pull(userId);
        post.upvotedBy.push(userId);
        post.tickCount += 1;
        post.crossCount -= 1;
      }else{
        post.upvotedBy.push(userId);
        post.tickCount += 1;
      }
      

    } else if (voteType === "downvote") {
      if (hasDownvoted) return res.status(400).json({ message: "Ya votaste negativamente." });

      if (hasUpvoted) {
        post.upvotedBy.pull(userId);
        post.downvotedBy.push(userId);
        post.crossCount += 1;
        post.tickCount -= 1; // Revertir el cambio de tick
      }else{
        post.downvotedBy.push(userId);
        post.crossCount += 1;
      }
      

      

    } else {
      return res.status(400).json({ message: "Tipo de voto inválido." });
    }

    // Aplicar cambio de aura al autor si hay suficientes votos
    if (!post.auraImpactApplied) {
      const positiveVotes = post.upvotedBy.length;
      const negativeVotes = post.downvotedBy.length;

      if (positiveVotes >= 3 || negativeVotes >= 3) {
        if(positiveVotes >= 3){
        const auraChange = post.aura;
        const author = await User.findById(post.dedicatedTo._id);

        author.aura += auraChange;
        author.auraHistory.push({ value: author.aura, date: new Date() });

        post.auraImpactApplied = true;

        await author.save();
        }else{
          post.auraImpactApplied = true;
        }
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username profileImage")
      .populate("dedicatedTo", "username profileImage");

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al votar el post." });
  }
};
exports.getPostsById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const posts = await Post.find({
      $or: [{ author: id }, { dedicatedTo: id }],
    })
      .populate("author", "username profileImage")
      .populate("dedicatedTo", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al obtener posts del usuario:", error);
    res.status(500).json({ message: "Error al obtener los posts" });
  }
};
exports.deletePost = async (req, res) => {
    try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    console.log(post.imagePublicId)
    // Si el post tiene imagen alojada en Cloudinary, eliminarla
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    res.status(500).json({ message: "No se pudo eliminar el post" });
  }
};