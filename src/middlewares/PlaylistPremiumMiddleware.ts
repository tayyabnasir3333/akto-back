import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { BadRequestError } from "../errors";

export const playlistPremium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await User.findById(req.currentUser?.id);
  if (!user) {
    throw new BadRequestError("User doesn't exist");
  }
  if (user.premium == false) {
    throw new BadRequestError("You are not premium member");
  }
  next();
};
