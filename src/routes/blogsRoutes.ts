/** @format */

import express from "express";
import { currentAdmin } from "../middlewares/current-admin";
import { requireAuth } from "../middlewares/require-auth";
import upload from "../Helper/multer";
import validation from "../util/validationMiddlewares";
import blogController from "../controllers/blogController";
import { currentUser } from "../middlewares/curent-user";

const router = express.Router();

router.post(
  "/",
  currentAdmin,
  requireAuth,
  upload.fields([{ name: "blogImage", maxCount: 1 }]),
  ...validation.blog,
  blogController.addBlog
);

router.put(
  "/",
  currentAdmin,
  requireAuth,
  upload.fields([{ name: "blogImage", maxCount: 1 }]),
  ...validation.blog,
  blogController.updateBlog
);

router.get("/", currentUser, blogController.getBlogs);

router.get("/:id", currentUser, requireAuth, blogController.getSingleBlog);

router.delete("/:id", currentAdmin, requireAuth, blogController.deleteBlogById);
export { router as blogRouter };
