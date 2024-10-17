// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/userController");

// Route: GET /api/user/profile
router.get("/profile", isAuth, userController.getUserProfile);

// Route: PUT /api/user/update-profile
router.put("/update-profile", isAuth, userController.updateUserProfile);

module.exports = router;
