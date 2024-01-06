import express from "express";
import contactsController from "../../controllers/contacts.js";
import { isEmpty, validateId } from "../../middlewars/index.js";
import { contactSchemaValidation } from "../../decorators/index.js";
import { postSchema, putSchema, Contact } from "../../models/Contact.js";
const router = express.Router();

router.get("/", contactsController.listContacts);

router.get("/:id", validateId, contactsController.getById);

router.post(
  "/",
  isEmpty,
  contactSchemaValidation(postSchema),
  contactsController.addContact
);

router.delete("/:id", validateId, contactsController.removeContact);

router.put(
  "/:id",
  isEmpty,
  validateId,
  contactSchemaValidation(putSchema),
  contactsController.updateContact
);

export default router;
