const fs = require("fs/promises");
const path = require("path");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.format({ dir: "./models", base: "contacts.json" });

const saveArrayToFile = async (filePath, arr) => {
  const string = JSON.stringify(arr, null, 2);
  try {
    await fs.writeFile(filePath, string);
  } catch (err) {
    console.error(err);
  }
};

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contactsData = JSON.parse(data);
    return contactsData;
  } catch (error) {
    throw new Error("Error reading contacts data");
  }
};

const getContactById = async (contactId) => {
  console.log(contactId);
  const contactsData = await listContacts();
  const contact = contactsData.filter(({ id }) => id === contactId);

  console.log(contact);
  if (!contact) {
    throw new Error("Contact not found");
  }

  return contact;
};

const removeContact = async (contactId) => {
  const contactsData = await listContacts();
  const contactIndex = contactsData.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) {
    throw new Error("Contact not found");
  }

  contactsData.splice(contactIndex, 1);
  await saveArrayToFile(contactsPath, contactsData);
};


const addContact = async (name, email, phone) => {
  const contacts = await listContacts();

  const contact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  const updatedContacts = [...contacts, contact];
  await saveArrayToFile(contactsPath, updatedContacts);

  return contact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;

  const contactsData = await listContacts();
  const contactIndex = contactsData.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) {
    throw new Error("Contact not found");
  }

  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
  });

  const { error } = schema.validate({ name, email, phone });

  if (error) {
    throw new Error("missing fields");
  }

  contactsData[contactIndex] = {
    ...contactsData[contactIndex],
    name: name || contactsData[contactIndex].name,
    email: email || contactsData[contactIndex].email,
    phone: phone || contactsData[contactIndex].phone,
  };

  await saveArrayToFile(contactsPath, contactsData);
  return contactsData[contactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
