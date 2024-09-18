import express from "express";
import * as favoriteController from "../controllers/favoriteController";
import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/curent-user";
import validation from "../util/validationMiddlewares";

const router = express.Router();

router.post(
  "/",
  currentUser,
  requireAuth,
  ...validation.favorites,
  favoriteController.addToFavorites,
);
router.get("/", currentUser, requireAuth, favoriteController.getFavorites);

export { router as favoriteRouter };
