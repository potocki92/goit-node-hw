const Contact = require("../models/contactsModel.js");
const listContacts = async () => {
  try {
    const data = await Contact.find();
    return data;
  } catch (error) {
    throw new Error("Error reading contacts data");
  }
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new Error("Contact not found");
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    throw new Error("Contact not found");
  }
  return contact;
};

const addContact = async (name, email, phone, ownerId) => {
  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      favorite: false,
      owner: ownerId,
    });

    return newContact;
  } catch (error) {
    console.error("Error during contact addition:", error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;

  try {
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      {
        $set: {
          name,
          email,
          phone,
        },
      },
      { new: true }
    );

    if (!contact) {
      throw new Error("Contact not found");
    }

    return contact;
  } catch (error) {
    console.error("Error during contact update:", error);
    throw error;
  }
};

const updateFavoriteStatus = async (contactId, favorite) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: { favorite } },
      { new: true }
    );

    return updatedContact;
  } catch (error) {
    console.error(
      "Error during favorite contact status update:",
      error
    );
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavoriteStatus,
};
