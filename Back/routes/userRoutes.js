const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserAura,
  getUserByName,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
//router.get("/:username", getUserByName);
router.post("/", createUser);
router.post("/:id/aura", updateUserAura);

module.exports = router;
