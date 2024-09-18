import express from "express";
import { playlistController } from "../controllers/playlistController";
import { currentUser } from "../middlewares/curent-user";
import { requireAuth } from "../middlewares/require-auth";
import validation from "../util/validationMiddlewares";
import { playlistPremium } from "../middlewares/PlaylistPremiumMiddleware";

const router = express.Router();

router.patch(
  "/addPlaylist",
  currentUser,
  requireAuth,
  playlistPremium,
  ...validation.addUpdatePlaylist,
  playlistController.addUpdatePlaylist,
);

router.post(
  "/addVideoPlaylist",
  currentUser,
  requireAuth,
  playlistPremium,
  ...validation.addDeleteVideoPlaylist,
  playlistController.addVideoPlaylist,
);

router.patch(
  "/deleteVideoPlaylist",
  currentUser,
  requireAuth,
  playlistPremium,
  ...validation.addDeleteVideoPlaylist,
  playlistController.deleteVideoPlaylist,
);

router.delete(
  "/:id",
  currentUser,
  requireAuth,
  playlistPremium,
  playlistController.deletePlaylist,
);

router.get(
  "/getPlaylist/:id",
  currentUser,
  requireAuth,
  playlistPremium,
  playlistController.getPlaylistById,
);

router.get(
  "/getAllPlaylists",
  currentUser,
  requireAuth,
  playlistPremium,
  playlistController.getAllPlaylists,
);

export { router as playlistRouter };
