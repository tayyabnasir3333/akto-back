import express, { Request, Response } from "express";
import validation from "../util/validationMiddlewares";
import paymentController from "../controllers/paymentController";
import { currentUser } from "../middlewares/curent-user";
import { requireAuth } from "../middlewares/require-auth";
import { currentAdmin } from "../middlewares/current-admin";
const router = express.Router();
//user buys the subscription plan
router.post("/", currentUser, requireAuth, paymentController.processPayment);
//get the user subscription plans
router.get(
  "/",
  currentUser,
  requireAuth,
  paymentController.getUserSubscriptions,
);
//admin update the subscription plans
router.patch(
  "/plan",
  currentAdmin,
  requireAuth,
  ...validation.subscriptionUpdate,
  paymentController.updateSubscriptionPrice,
);

router.get(
  "/users/subscriptions",
  currentAdmin,
  requireAuth,
  paymentController.getAllSubscriptions,
);

router.get("/subs", paymentController.getSubs);

export { router as paymentRouter };
