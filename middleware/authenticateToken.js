const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(payload, "abcsecret", { expiresIn: "1h" });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, "abcsecret");
    return decoded;
  } catch (err) {
    return null;
  }
};

const setTokenToData = async (userId, token) => {
  try {
    const user = await User.findByIdAndUpdate(userId, { token }, { new: true });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error during setting token:", error);
    throw error;
  }
};
const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Received token:", token);

  if (!token) {
    console.log("Token missing");
    return res.status(401).json({ message: "Not authorized" });
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    console.log("Invalid token");
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    console.log(decodedToken);
    const user = await User.findOne({ _id: decodedToken.userId });
    console.log(decodedToken.userId);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = { generateToken, setTokenToData, authenticateToken };
