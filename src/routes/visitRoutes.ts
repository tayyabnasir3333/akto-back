import express, { Request, Response } from "express";
import validation from "../util/validationMiddlewares";
import visitController from "../controllers/visitController";
const router = express.Router();   

// router.post("/", visitController.addVisit)

export { router as visitRouter };