import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { controllerWrap } from "../decorators/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ ...req.body, password: hashedPassword });
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
  const validatedPassword = await bcrypt.compare(password, user.password);
  console.log("validation Password:", validatedPassword);
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

export default {
  register: controllerWrap(register),
  login: controllerWrap(login),
};
