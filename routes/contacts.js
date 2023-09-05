const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
} = require("../controllers/contacts");
const { auth } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/", auth, listContacts);
router.get("/:id", auth, getContactById);
router.post("/", auth, addContact);
router.put("/:id", auth, updateContact);
router.patch("/:id/favorite", auth, updateStatusContact);
router.delete("/:id", auth, removeContact);

module.exports = router;
