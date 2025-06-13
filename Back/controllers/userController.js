const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id username aura profileImage").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario ID no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar usuario" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: "Error al crear usuario" });
  }
};
exports.updateUserAura = async (req, res) => {
  try {
    const { aura } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.aura += aura;
    user.auraHistory.push({ value: user.aura }); // Guarda el nuevo valor

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Error al actualizar aura" });
  }
};

exports.getUserByName = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};
exports.updateUserData = async (req, res) => {
  try {
    const { username, email, password, newImage, oldImagePublicId } = req.body;
    const { id } = req.params;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }
    if (newImage) {
      updateData.profileImage = newImage.profileImage;
      updateData.imagePublicId = newImage.imagePublicId;

      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "No se pudo actualizar el usuario" });
  }
};