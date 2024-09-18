import { NextFunction, Request, Response } from "express";
import favoriteService from "../services/favoriteService";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { BadRequestError } from "../errors";

export const addToFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { video_id } = req.body;
  const userIdObject = new ObjectId(req.currentUser?.id);
  const videoIdObject = new ObjectId(video_id);

  try {
    const favorites = await favoriteService.addToFavorites(
      userIdObject,
      videoIdObject,
    );
    res
      .status(favorites.statusCode)
      .send({ msg: favorites.msg, data: favorites.data });
  } catch (error) {
    return next(error);
  }
};

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userIdObject = new ObjectId(req.currentUser?.id);

  try {
    const favorites = await favoriteService.getFavorites(userIdObject);
    res
      .status(favorites.statusCode)
      .send({ msg: favorites.msg, data: favorites.data });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
