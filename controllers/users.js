import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import "dotenv/config";

import { User } from "../models/User.js";
import { HttpError, sendEmail, getVerifyEmail } from "../helpers/index.js";
import { controllerWrap } from "../decorators/index.js";

const { JWT_SECRET } = process.env;
const tempPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250" });
  const verificationToken = nanoid();
  const result = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });
  const verificationEmail = getVerifyEmail(email, verificationToken);
  await sendEmail(verificationEmail);
  res
    .status(201)
    .json({ email: result.email, subscription: result.subscription });
};

const login = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (user.verify === false) {
    throw HttpError(401, "Email is not verified");
  }
  const validatedPassword = await bcrypt.compare(password, user.password);

  if (!validatedPassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findOneAndUpdate({ email }, { token });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const logout = async (req, res) => {
  const { email } = req.user;
  await User.findOneAndUpdate({ email }, { token: "" });
  res.status(204).json();
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body);
  if (!result) throw HttpError(404, "Not found");
  res.json({ email: result.email, subscription: result.subscription });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(tempPath, filename);

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join(tempPath, filename);
  const result = await User.findByIdAndUpdate(_id, avatarURL);

  if (!result) throw HttpError(404, "Not found");
  res.json({ avatarURL });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true }
  );
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify === true) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verificationEmail = getVerifyEmail(email, user.verificationToken);

  await sendEmail(verificationEmail);
  res.json({ message: "Verification email was sent to your email" });
};

export default {
  register: controllerWrap(register),
  login: controllerWrap(login),
  logout: controllerWrap(logout),
  getCurrent: controllerWrap(getCurrent),
  updateSubscription: controllerWrap(updateSubscription),
  updateAvatar: controllerWrap(updateAvatar),
  verifyEmail: controllerWrap(verifyEmail),
  resendVerifyEmail: controllerWrap(resendVerifyEmail),
};
