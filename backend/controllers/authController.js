const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body);
  const { name, email, password, role } = req.body;

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
      password,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // console.log(user.id);

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

// Function to handle user login
exports.login = async (req, res, next) => {
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

// exports.forgotPassword = async (req, res, next) => {
//   // Extract validation errors from the request
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email } = req.body;

//   try {
//     // Check if the user exists
//     console.log(email);
//     const user = await User.findOne({ email });
//     if (!user) {
//       const error = new Error("User with this email does not exist");
//       error.statusCode = 404;
//       throw error;
//     }

//     res.status(200).json({ message: "Password reset link sent to your email" });
//     // console.log(process.env.FRONTENDLINK);

//     return transporter.sendMail({
//       from: "cleve.klein78@ethereal.email",
//       to: email,
//       subject: "Reset Password Link!",
//       // text: `Hello Prakhar, your account has been created successfully. Please log in now.`,
//       html: `<h1>Reset password links successfully sent!</h1>
//       <p>Click on this <a href="${process.env.FRONTENDLINK}/${user._id}">link</a> to change password.</p>`,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// // Function to handle reset password
// exports.resetPassword = async (req, res, next) => {
//   // Extract validation errors from the request
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { currentPassword, newPassword } = req.body;
//   console.log(req.body);

//   try {
//     // Find the user by req.userId
//     const userId = req.body.userId || req.userId;
//     console.log(`User ID: ${userId}`);

//     const user = await User.findById(userId);

//     if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     // console.log(`User found: ${user}`);
//     console.log(`User password: ${user.password}`);

//     if (!user.password) {
//       const error = new Error("User password is undefined");
//       error.statusCode = 400;
//       throw error;
//     }

//     // Verify the old password
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       const error = new Error("Old password is incorrect");
//       error.statusCode = 400;
//       throw error;
//     }

//     // Check if the new password is the same as the old password
//     const isSamePassword = await bcrypt.compare(newPassword, user.password);
//     if (isSamePassword) {
//       const error = new Error(
//         "You have the same password as before. Choose a new password."
//       );
//       error.statusCode = 400;
//       throw error;
//     }

//     // Hash the new password and save it to the user's document
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     await user.save();

//     res.status(200).json({ message: "Password has been reset successfully" });
//   } catch (err) {
//     next(err); // Pass error to error handling middleware
//   }
// };
