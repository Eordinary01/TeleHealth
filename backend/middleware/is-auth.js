const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  const token = authHeader.split(" ")[1] || "";

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decodedToken.userId,  
      role: decodedToken.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
