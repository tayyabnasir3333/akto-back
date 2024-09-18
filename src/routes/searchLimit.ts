import express from "express";
import validation from "../util/validationMiddlewares";
import paymentController from "../controllers/paymentController";
import { requireAuth } from "../middlewares/require-auth";
import { currentAdmin } from "../middlewares/current-admin";
import searchLimitController from "../controllers/searchLimitController";

const router = express.Router();

router.post(
  "/:id?",
  currentAdmin,
  requireAuth,
  ...validation.searchLimit,
  searchLimitController.updateSearchLimit,
);

router.get("/", searchLimitController.getFreeSearches);

export { router as searchLimitRouter };
