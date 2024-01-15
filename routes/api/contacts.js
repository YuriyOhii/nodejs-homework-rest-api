import express from "express";
import contactsController from "../../controllers/contacts.js";
import {
  isEmpty,
  validateId,
  isEmptyForFavourite,
} from "../../middlewars/index.js";
import { routeSchemaValidation } from "../../decorators/index.js";
import {
  postSchema,
  putSchema,
  patchFavouriteSchema,
} from "../../models/Contact.js";
const router = express.Router();

router.get("/", contactsController.listContacts);

router.get("/:id", validateId, contactsController.getById);

router.post(
  "/",
  isEmpty,
  routeSchemaValidation(postSchema),
  contactsController.addContact
);

router.delete("/:id", validateId, contactsController.removeContact);

router.put(
  "/:id",
  isEmpty,
  validateId,
  routeSchemaValidation(putSchema),
  contactsController.updateContact
);
router.patch(
  "/:id/favorite",
  isEmptyForFavourite,
  validateId,
  routeSchemaValidation(patchFavouriteSchema),
  contactsController.updateStatusContact
);

export default router;
