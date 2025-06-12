const express = require("express");
const router = express.Router();
const { deleteImage } = require("../controllers/cloudinaryController");

router.post("/delete", deleteImage);

module.exports = router;
