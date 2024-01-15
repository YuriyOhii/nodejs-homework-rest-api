import { HttpError } from "../helpers/index.js";
import { controllerWrap } from "../decorators/index.js";
import { Contact } from "../models/Contact.js";

const listContacts = async (req, res) => {
  const { page, limit, favorite } = req.query;
  const skip = (page - 1) * limit;
  const owner = req.user._id;
  const queryObj = favorite ? { owner, favorite } : { owner };

  const result = await Contact.find(queryObj, "-favorite -owner", {
    limit,
    skip,
  });
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findById({ _id, owner });
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await Contact.create({ ...req.body, owner: req.user._id });
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndDelete({ _id, owner });
  if (!result) throw HttpError(404, "Not found");
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate({ _id, owner }, req.body);
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

export default {
  listContacts: controllerWrap(listContacts),
  getById: controllerWrap(getContactById),
  addContact: controllerWrap(addContact),
  removeContact: controllerWrap(removeContact),
  updateContact: controllerWrap(updateContact),
  updateStatusContact: controllerWrap(updateStatusContact),
};
