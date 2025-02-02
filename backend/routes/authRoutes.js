const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require("../middleware/is-auth");

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
    body("role")
      .not()
      .isEmpty()
      .withMessage("Role is required")
      .isIn([ "doctor", "patient"]) 
      .withMessage("Invalid role, must be one of: user, patient"),
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


router.get('/verify',isAuth,authController.verifyToken)


module.exports = router;
