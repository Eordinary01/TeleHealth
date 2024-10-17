const User = require("../models/User");
exports.chat = async (req, res) => {
  const { message } = req.body;
  console.log("apiKey", process.env.API_KEY);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log(aiResponse);

    res
      .status(200)
      .json({ reply: aiResponse.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error generating response");
  }
};

// Function to update user profile
exports.updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    // Fetch user by userId
    let user = await User.findById(req.userId);
    console.log(user);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Update user details
    user.name = name || user.name; // Update only if provided
    user.email = email || user.email; // Update only if provided

    // Save updated user data
    user = await user.save();

    // Return updated user data
    res.status(201).json(user);
  } catch (err) {
    next(err); // Pass error to error handling middleware
  }
};
