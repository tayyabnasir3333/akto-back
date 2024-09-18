/** @format */

import * as express from "express";
import { playlistRouter } from "./playlistRoutes";
import { usersRouter } from "../routes/userRoutes";
import { paymentRouter } from "./paymentRoutes";
import { visitRouter } from "./visitRoutes";
import { videoRouter } from "./videoRoutes";
import { adminRouter } from "./adminRoutes";
import { favoriteRouter } from "./favoriteRoutes";
import { searchLimitRouter } from "./searchLimit";
import { notificationRouter } from "./notificationRoutes";
import { blogRouter } from "./blogsRoutes";

const router = express.Router();

router.use("/api/users", usersRouter);
router.use("/api/payments", paymentRouter);
router.use("/api/visits", visitRouter);
router.use("/api/videos", videoRouter);
router.use("/api/admin", adminRouter);
router.use("/api/playlist", playlistRouter);
router.use("/api/favorite", favoriteRouter);
router.use("/api/limit", searchLimitRouter);
router.use("/api/notification", notificationRouter);
router.use("/api/blogs", blogRouter);
export { router };
