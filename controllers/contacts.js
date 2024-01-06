import { HttpError } from "../helpers/index.js";
import { contactControllerWrap } from "../decorators/index.js";
import { Contact } from "../models/Contact.js";

const listContacts = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) throw HttpError(404, "Not found");
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

export default {
  listContacts: contactControllerWrap(listContacts),
  getById: contactControllerWrap(getContactById),
  addContact: contactControllerWrap(addContact),
  removeContact: contactControllerWrap(removeContact),
  updateContact: contactControllerWrap(updateContact),
};
