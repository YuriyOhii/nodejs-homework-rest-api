import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleError400, updateOptions } from "./hooks.js";

const postSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Set name for contact",
  }),
  email: Joi.string().messages({
    "any.required": "missing required email field",
  }),
  phone: Joi.string().messages({
    "any.required": "missing required phone field",
  }),
  favourite: Joi.boolean(),
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.pre("findOneAndUpdate", updateOptions);
contactSchema.post("save", handleError400);
contactSchema.post("findOneAndUpdate", handleError400);

const Contact = model("contacts", contactSchema);

export { Contact, postSchema, putSchema };
