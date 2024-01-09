import { Schema, model } from "mongoose";
import Joi from "joi";

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
  },
  { versionKey: false, timestamps: true }
);

const userRegisterSchema = Joi({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid(...subscription),
});

const userLoginSchema = Joi({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const User = model("users", userSchema);

export { User, userLoginSchema, userRegisterSchema };
