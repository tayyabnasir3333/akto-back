import express from "express";
import "express-async-errors";
import morgan from "morgan";
import { router } from "./routes";
import connectDb from "../src/config/db";
import { errorHandler } from "./middlewares/error";
import { NotFoundError } from "../src/errors/NotFoundError";
import { Request } from "express";
import cors from "cors-ts";
import { currentUser } from "./middlewares/curent-user";

const app = express();
connectDb();
app.set("trust proxy", true);
//@ts-ignore
app.use(express.json());
app.use(morgan("dev"));

app.use(cors<Request>());

app.use(router);

app.use(errorHandler);

export { app };
