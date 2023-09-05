const Contact = require("../models/contacts.model");

const getContactsPaginated = async ({ favorite, owner, page, limit }) => {
  const query = { owner };
  if (favorite) {
    query.favorite = favorite;
  }

  const totalHits = await Contact.find(query).countDocuments();
  const totalPages = Math.ceil(totalHits / limit);
  const currentPage = Math.min(page, totalPages);

  if (page > totalPages) {
    return null;
  }

  const pagination = {
    currentPage,
    totalPages,
    totalHits,
  };

  const contacts = await Contact.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  const result = {
    pagination,
    contacts,
  };

  return result;
};

const getContactByIdAndOwner = async ({ owner, id }) =>
  await Contact.findOne({ _id: id, owner });

const createContact = async ({ name, email, phone, owner }) =>
  await Contact.create({ name, email, phone, owner });

const updateContactByIdAndOwner = async ({
  id,
  name,
  email,
  phone,
  favorite,
  owner,
}) => {
  const contact = await Contact.findOne({ _id: id, owner });
  if (!contact) {
    return null;
  }
  return await Contact.findByIdAndUpdate(
    { _id: id },
    { name, email, phone, favorite, owner },
    { new: true }
  );
};

const removeContactByIdAndOwner = async ({ id, owner }) => {
  const contact = await Contact.findOne({ _id: id, owner });
  if (!contact) {
    return null;
  }

  return await Contact.findByIdAndRemove({ _id: id });
};

module.exports = {
  getContactsPaginated,
  getContactByIdAndOwner,
  createContact,
  updateContactByIdAndOwner,
  removeContactByIdAndOwner,
};
