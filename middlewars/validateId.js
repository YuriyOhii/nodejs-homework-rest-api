import { HttpError } from "../helpers/index.js";
import { isValidObjectId } from "mongoose";

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return next(HttpError(400, `ID ${id} does not exist`));
  next();
};

export default validateId;
