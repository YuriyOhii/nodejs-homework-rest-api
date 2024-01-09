import { User } from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { controllerWrap } from "../decorators/index.js";

const register = (req, res) => {
  res.json("registration");
};

const login = (req, res) => {
  res.json("login");
};

export default {
  register: controllerWrap(register),
  login: controllerWrap(login),
};
