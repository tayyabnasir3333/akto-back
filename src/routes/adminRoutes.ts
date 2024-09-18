import express from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentAdmin } from "../middlewares/current-admin";
import validation from "../util/validationMiddlewares";
import adminController from "../controllers/adminController";

const router = express.Router();   


router.post("/new",currentAdmin,requireAuth, ...validation.signup, adminController.createAdmin );

export { router as adminRouter };