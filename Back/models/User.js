const mongoose = require("mongoose");

const auraEntrySchema = new mongoose.Schema({
  value: Number,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profileImage: String,
  aura: { type: Number, default: 1000 },
  auraHistory: [auraEntrySchema],
  // otros campos...
});

module.exports = mongoose.model("User", userSchema);
