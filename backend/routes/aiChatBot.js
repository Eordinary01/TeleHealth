// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const chatController = require("../controllers/chatController");

// Route: GET /api/user/profile
router.post("/", chatController.chat);
router.get("/:chatId", chatController.getChat);

module.exports = router;
