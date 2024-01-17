import { HttpError } from "../helpers/index.js";

const isNoAvatar = (req, res, next) => {
  if (req.file === undefined) {
    return next(HttpError(400, "Missing avatar file"));
  }
  next();
};

export default isNoAvatar;
