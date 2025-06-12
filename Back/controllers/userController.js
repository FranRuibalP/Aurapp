const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id username aura").sort({ createdAt: -1 });
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
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { aura: aura } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error al actualizar aura" });
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