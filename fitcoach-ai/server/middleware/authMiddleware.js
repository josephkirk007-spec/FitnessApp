const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    console.log(
      "AUTH HEADER RECEIVED:",
      Boolean(authHeader)
    );

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Not authorized, no token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId =
      decoded.id ||
      decoded.userId ||
      decoded._id;

    const user = await User.findById(
      userId
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message:
          "Not authorized, user not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Your login session expired. Please log in again."
          : "Not authorized, token failed.",
    });
  }
};

module.exports = {
  protect,
};