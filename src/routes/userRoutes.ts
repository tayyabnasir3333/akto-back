import express, { Request, Response } from "express";
import validation from "../util/validationMiddlewares";
import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/curent-user";
import usersController from "../controllers/userController";
import userController from "../controllers/userController";
const router = express.Router();

router.post("/signup", ...validation.signup, usersController.signUp);
router.post("/signin", ...validation.signin, usersController.signIn);
router.patch(
  "/update/password",
  currentUser,
  requireAuth,
  ...validation.updatepassword,
  usersController.updatePassword,
);
router.put(
  "/verify/email",
  ...validation.verifyEmail,
  usersController.verifyEmail,
);
router.get("/", currentUser, requireAuth, usersController.getProfile);

router.post(
  "/contact/us",
  currentUser,
  requireAuth,
  ...validation.contactUs,
  usersController.contactUs,
);

router.post(
  "/forgetPassword",
  ...validation.forgotpassword,
  userController.forgetPassword,
);

router.patch(
  "/verify/forgetPassword",
  ...validation.verifyForgetPassword,
  usersController.verifyForgetPassword,
);

router.patch(
  "/updateName",
  currentUser,
  requireAuth,
  ...validation.updateName,
  userController.changeName,
);

router.patch("/update/notification", currentUser,
requireAuth,...validation.updateNotification,userController.changeNotification )

export { router as usersRouter };
