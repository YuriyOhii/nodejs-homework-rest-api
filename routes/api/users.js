import express from "express";
import controller from "../../controllers/users.js";
import { isEmpty } from "../../middlewars/index.js";
import { routeSchemaValidation } from "../../decorators/index.js";
import { userLoginSchema, userRegisterSchema } from "../../models/User.js";

const userRouter = express.Router();

userRouter.post(
  "/user/register",
  isEmpty,
  routeSchemaValidation(userRegisterSchema),
  controller.register
);
userRouter.post(
  "/user/login",
  isEmpty,
  routeSchemaValidation(userLoginSchema),
  controller.login
);

export default userRouter;
