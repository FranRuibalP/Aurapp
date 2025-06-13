const mongoose = require("mongoose");

const auraEntrySchema = new mongoose.Schema({
  value: Number,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: {type:String, default:"https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"},
  imagePublicId: {type:String, default:""},
  aura: { type: Number, default: 1000 },
  auraHistory: [auraEntrySchema],
  // otros campos...
});

module.exports = mongoose.model("User", userSchema);
