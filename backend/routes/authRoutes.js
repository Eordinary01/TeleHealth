const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require("../middleware/is-auth");

router.post("/otp", authController.optGenerte);

// Route: POST /api/auth/signup
router.post(
  "/signup",
  [
    // Validate inputs
    body("name")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  authController.signup
);

// Route: POST /api/auth/login
router.post(
  "/login",
  [
    // Validate inputs
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// Route: POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
  ],
  authController.forgotPassword
);

// Route: POST /api/auth/reset-password
router.put(
  "/reset-password",
  [
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  isAuth,
  authController.resetPassword
);

module.exports = router;
