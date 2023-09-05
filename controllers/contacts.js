const Contact = require("../models/contacts.model.js");
const {
  getContactsPaginated,
  getContactByIdAndOwner,
  createContact,
  updateContactByIdAndOwner,
  removeContactByIdAndOwner,
} = require("../service/contacts.service.js");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().min(6).max(20).required(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const listContacts = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const favorite = req.query.favorite;

    const data = await getContactsPaginated({
      favorite,
      owner,
      page,
      limit,
    });
    if (!data) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `This page of contacts were not found`,
        data: "Not Found",
      });
    }
    const contacts = data.contacts;
    const pagination = data.pagination;

    return res.header("pagination", JSON.stringify(pagination)).json({
      status: "success",
      code: 200,
      pagination,
      data: {
        contacts,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  const id = req.params.id;
  const owner = req.user.id;
  try {
    const contact = await getContactByIdAndOwner({ owner, id });
    if (contact) {
      res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addContact = async (req, res, next) => {
  const { value, error } = contactSchema.validate(req.body);
  const { name, email, phone } = value;
  const owner = req.user.id;

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    const contact = await createContact({ name, email, phone, owner });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { createdContact: contact },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  const { value, error } = contactSchema.validate(req.body);
  const { name, email, phone } = value;
  const { id } = req.params;
  const owner = req.user.id;

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    const contact = await updateContactByIdAndOwner({
      id,
      name,
      email,
      phone,
      owner,
    });
    if (contact) {
      res.json({
        status: "success",
        code: 200,
        data: { updatedContact: contact },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateStatusContact = async (req, res, next) => {
  const { value, error } = favoriteSchema.validate(req.body);
  const { favorite } = value;
  const { id } = req.params;
  const owner = req.user.id;

  if (error) {
    res.status(400).json({ message: "missing field favorite" });
    return;
  }

  try {
    const result = await updateContactByIdAndOwner({ id, owner, favorite });
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        data: { updatedContact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  const owner = req.user.id;

  try {
    const result = await removeContactByIdAndOwner({ id, owner });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { deletedContact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
