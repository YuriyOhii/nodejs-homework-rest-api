import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleError400, updateOptions } from "./hooks.js";

const subscription = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscription,
      default: "starter",
    },
    token: String,
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleError400);
userSchema.pre("findOneAndUpdate", updateOptions);

const userRegisterSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid(...subscription),
});

const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const userUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscription)
    .required(),
});

const userEmailResendingSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
  }),
});

const User = model("users", userSchema);

export {
  User,
  userLoginSchema,
  userRegisterSchema,
  userUpdateSubscriptionSchema,
  userEmailResendingSchema,
};
