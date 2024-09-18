import express from "express";
import { currentUser } from "../middlewares/curent-user";
import { requireAuth } from "../middlewares/require-auth";
import notificationController from "../controllers/notificationController";
const router = express.Router();

router.get("/", currentUser, requireAuth, notificationController.getNotification)


export { router as notificationRouter };