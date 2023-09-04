const express = require("express");
const Joi = require("joi");
const { addUser, loginUser, logoutUser } = require("../../models/user");
const { authenticateToken } = require("../../middleware/authenticateToken");
const router = express.Router();
const Contact = require("../../models/contactsModel.js");
const validationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/signup", async (req, res) => {
  try {
    const { error } = validationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await addUser(email, password);

    res.status(201).json({ user });
  } catch (error) {
    if (error.message === "Email in use") {
      return res.status(409).json({ message: "Email in use" });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const loginResult = await loginUser(email, password);

    res.status(200).json(loginResult);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: "Email or password is wrong" });
  }
});

router.get("/logout", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/current", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint do pobierania kontaktów z paginacją
router.get("/contacts", authenticateToken, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find({ owner: req.user._id })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
