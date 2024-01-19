import express from "express";
import controller from "../../controllers/users.js";
import {
  isEmpty,
  isNoAvatar,
  authorization,
  upload,
  resizeWithJimp,
} from "../../middlewars/index.js";
import { routeSchemaValidation } from "../../decorators/index.js";
import {
  userLoginSchema,
  userRegisterSchema,
  userUpdateSubscriptionSchema,
  userEmailResendingSchema,
} from "../../models/User.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  isEmpty,
  routeSchemaValidation(userRegisterSchema),
  controller.register
);
userRouter.post(
  "/login",
  isEmpty,
  routeSchemaValidation(userLoginSchema),
  controller.login
);
userRouter.post(
  "/verify",
  isEmpty,
  routeSchemaValidation(userEmailResendingSchema),
  controller.resendVerifyEmail
);

userRouter.post("/logout", authorization, controller.logout);
userRouter.get("/current", authorization, controller.getCurrent);
userRouter.get("/verify/:verificationToken", controller.verifyEmail);
userRouter.patch(
  "/",
  isEmpty,
  routeSchemaValidation(userUpdateSubscriptionSchema),
  authorization,
  controller.updateSubscription
);
userRouter.patch(
  "/avatars",
  upload.single("avatar"),
  isNoAvatar,
  resizeWithJimp,
  authorization,
  controller.updateAvatar
);

export default userRouter;
