const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("token", token);

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decodedToken);

    // Find the user by ID from the decoded token
    const user = await User.findById(decodedToken.userId);
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach the user to the request object
    req.user = user;
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { requireAuth };
