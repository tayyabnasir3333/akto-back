import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/curent-user";
import validation from "../util/validationMiddlewares";
import videoController from "../controllers/videoController";
import { upload } from "../Helper/multer";
import { currentAdmin } from "../middlewares/current-admin";
import { searchLimitRestriction } from "../middlewares/searchLimitMiddleware";
import { isDraftValidations } from "../middlewares/isDraft-validations";
const router = express.Router();

router.post(
  "/",
  currentAdmin,
  requireAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  // ...validation.addVideo,
  isDraftValidations(validation.addVideo),
  videoController.addVideo,
);

router.put(
  "/",
  currentAdmin,
  requireAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  // ...validation.updateVideo,
  isDraftValidations(validation.updateVideo),

  videoController.updateVideo,
);

router.get("/", currentUser, videoController.getVideos);

router.get("/search", searchLimitRestriction, videoController.getSearchVideos);

router.get(
  "/user/search",
  currentUser,
  requireAuth,
  videoController.getSearchVideosUser,
);

router.get(
  "/categories",
  searchLimitRestriction,
  videoController.getCategoriesVideo,
);
router.get(
  "/user/categories",
  currentUser,
  requireAuth,
  videoController.getCategoriesVideo,
);

router.get(
  "/draft",
  currentAdmin,
  requireAuth,
  videoController.getVideosIsDraft,
);

router.get(
  "/categories/:character_type(*)",
  searchLimitRestriction,
  videoController.getVideoByCat,
);

router.get(
  "/user/categories/:character_type(*)",
  currentUser,
  requireAuth,
  videoController.getVideoByCatByUser,
);
router.get("/filter", searchLimitRestriction, videoController.filterVideos);
router.get(
  "/user/filter",
  currentUser,
  requireAuth,
  videoController.filterVideosUser,
);

router.get("/:id", searchLimitRestriction, videoController.getSingleVideo);

//protected routes
router.get(
  "/user/:id",
  currentUser,
  requireAuth,
  videoController.getSingleVideoByUser,
);

router.delete(
  "/:id",
  currentAdmin,
  requireAuth,
  videoController.deleteVideoById,
);

export { router as videoRouter };
