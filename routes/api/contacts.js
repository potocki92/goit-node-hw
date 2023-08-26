const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavoriteStatus,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);
    res.status(200).json(contact);
  } catch (error) {
    if (error.message === "Contact not found") {
      res.status(404).json({ message: "Not found" });
    } else {
      next(error);
    }
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    });

    const { error } = schema.validate({ name, email, phone });

    if (error) {
      res.status(400).json({
        message: `missing required ${error.details[0].context.key} - field`,
      });
      return;
    }

    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    await removeContact(contactId);
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    if (error.message === "Contact not found") {
      res.status(404).json({ message: "Not found" });
    } else {
      next(error);
    }
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const { name, email, phone } = req.body;

    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
    });

    const { error } = schema.validate({ name, email, phone });

    if (error) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    const updatedContact = await updateContact(contactId, {
      name,
      email,
      phone,
    });
    res.status(200).json(updatedContact);
  } catch (error) {
    if (error.message === "Contact not found") {
      res.status(404).json({ message: "Not found" });
    } else {
      next(error);
    }
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const updatedContact = await updateFavoriteStatus(contactId, favorite);

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
