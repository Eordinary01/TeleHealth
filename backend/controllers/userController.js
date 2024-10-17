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

    user.name = name || user.name;
    user.email = email || user.email;

    user = await user.save();

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
