const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(payload, "abcsecret", { expiresIn: "1h" });
};
const addUser = async (email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      email: newUser.email,
      subscription: newUser.subscription,
    };
  } catch (error) {
    console.error("Error during user addition:", error);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email or password is wrong");
    }

    const token = generateToken(user);

    return {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

module.exports = {
  addUser,
  loginUser,
};
