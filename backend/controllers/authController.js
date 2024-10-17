const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "jamir.altenwerth@ethereal.email",
    pass: "jHMTkwNJ4QtJZkEcCm",
  },
});

exports.optGenerte = async (req, res, next) => {
  try {
    // Generate a 6-digit OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const email = req.body.email;

    // let user = await User.findById();

    // You can add logic to save the OTP to a database or send it to the user via SMS/Email here
    // For example:
    // await saveOtpToDatabase(userId, OTP);
    // await sendOtpToUser(userPhoneNumber, OTP);

    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otp: OTP, // Typically you would not send the OTP back in the response, this is just for demonstration
    });

    return transporter.sendMail({
      from: "cleve.klein78@ethereal.email",
      to: email,
      subject: "OTP Sent!",
      text: `Hello Prakhar, OTP for account creation is ${OTP}`,
      // html: "<h1>You successfully signed up!</h1>",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Function to handle user signup
exports.signup = async (req, res, next) => {
  // Extract validation errors from the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    // Create a new user instance
    user = new User({
      name,
      email: email.toLowerCase(),
      password, // Password will be hashed before saving
    });

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    console.log(user.id);

    // Create and return a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      // { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          next(err); // Pass error to error handling middleware
        } else {
          res.json({ token, userId: user.id });
        }
      }
    );

    return transporter.sendMail({
      from: "cleve.klein78@ethereal.email",
      to: email,
      subject: "Signup succeeded!",
      text: `Hello Prakhar, your account has been created successfully. Please log in now.`,
      html: "<h1>You successfully signed up!</h1>",
    });
  } catch (err) {
    next(err); // Pass error to error handling middleware
  }
};

// Function to handle user login
exports.login = async (req, res, next) => {
  // Extract validation errors from the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log(req.body);

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid Password");
      error.statusCode = 400;
      throw error;
    }

    // Create and return a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      // { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          next(err); // Pass error to error handling middleware
        } else {
          res.json({ token, userId: user.id });
        }
      }
    );
  } catch (err) {
    next(err); // Pass error to error handling middleware
  }
};

// Function to handle forgot password
exports.forgotPassword = async (req, res, next) => {
  // Extract validation errors from the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Check if the user exists
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User with this email does not exist");
      error.statusCode = 404;
      throw error;
    }
    // const resetToken = crypto.randomBytes(32).toString("hex");
    // const resetTokenExpiration = Date.now() + 3600000;

    res.status(200).json({ message: "Password reset link sent to your email" });
    // console.log(process.env.FRONTENDLINK);

    return transporter.sendMail({
      from: "cleve.klein78@ethereal.email",
      to: email,
      subject: "Reset Password Link!",
      // text: `Hello Prakhar, your account has been created successfully. Please log in now.`,
      html: `<h1>Reset password links successfully sent!</h1>
      <p>Click on this <a href="${process.env.FRONTENDLINK}/${user._id}">link</a> to change password.</p>`,
    });
  } catch (err) {
    next(err);
  }
};
// Function to handle reset password
exports.resetPassword = async (req, res, next) => {
  // Extract validation errors from the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;
  console.log(req.body);

  try {
    // Find the user by req.userId
    const userId = req.body.userId || req.userId;
    console.log(`User ID: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // console.log(`User found: ${user}`);
    console.log(`User password: ${user.password}`);

    if (!user.password) {
      const error = new Error("User password is undefined");
      error.statusCode = 400;
      throw error;
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error("Old password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      const error = new Error(
        "You have the same password as before. Choose a new password."
      );
      error.statusCode = 400;
      throw error;
    }

    // Hash the new password and save it to the user's document
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    next(err); // Pass error to error handling middleware
  }
};
