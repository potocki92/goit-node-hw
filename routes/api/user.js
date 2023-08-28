const express = require("express");
const Joi = require("joi");
const { addUser, loginUser } = require("../../models/user");
const router = express.Router();

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

module.exports = router;
