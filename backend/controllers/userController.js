const User = require("../models/user");

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    let user = await User.findById(req.userId);
    console.log(user);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    user.name = name || user.name; // Update only if provided
    user.email = email || user.email; // Update only if provided

    user = await user.save();

    res.status(201).json(user);
  } catch (err) {
    next(err); // Pass error to error handling middleware
  }
};
