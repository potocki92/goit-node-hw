const express = require("express");
const { auth } = require("../middleware/authenticateToken");
const {
  signup,
  login,
  logout,
  getCurrentUser,
  updateUserSubscription,
} = require("../controllers/user");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);
router.patch("/", auth, updateUserSubscription);

module.exports = router;
