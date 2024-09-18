import { NextFunction, Request, Response } from "express";
import PlaylistService from "../services/playlistService";
import { ObjectId } from "mongodb";
import playlistService from "../services/playlistService";
import { Types } from "mongoose";
import { BadRequestError } from "../errors";

export const playlistController = {
  addUpdatePlaylist: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, playlist_id } = req.body;
      const playlist = await PlaylistService.addUpdatePlaylist(
        name,
        new Types.ObjectId(req.currentUser?.id),
        playlist_id as unknown as ObjectId,
      );
      res.status(playlist.statusCode).send({ msg: playlist.msg });
    } catch (error) {
      return next(error);
    }
  },

  addVideoPlaylist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { video_id, playlist_id } = req.body;
      const playlistIdObject = new ObjectId(playlist_id);
      const videoIdObject = new ObjectId(video_id);

      const addedPlaylist = await PlaylistService.addVideoPlaylist(
        playlistIdObject,
        videoIdObject,
      );
      res
        .status(addedPlaylist.statusCode)
        .send({ msg: addedPlaylist.msg, data: addedPlaylist.data });
    } catch (error) {
      return next(error);
    }
  },

  deleteVideoPlaylist: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { video_id, playlist_id } = req.body;
      const playlistIdObject = new ObjectId(playlist_id);
      const videoIdObject = new ObjectId(video_id);

      const deletedPlaylist = await PlaylistService.deleteVideoPlaylist(
        playlistIdObject,
        videoIdObject,
      );
      res.status(deletedPlaylist.statusCode).send({ msg: deletedPlaylist.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },

  deletePlaylist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("params :id required for playlist");
      }
      const playlistIdObject = new ObjectId(id);
      const result = await PlaylistService.deletePlaylist(playlistIdObject);
      res.status(result.statusCode).send({ msg: result.msg });
    } catch (error) {
      return next(error);
    }
  },

  getPlaylistById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("params :id required for playlist");
      }
      const playlistIdObject = new ObjectId(id);
      const playlist = await PlaylistService.getPlaylistById(playlistIdObject);
      res
        .status(playlist.statusCode)
        .send({ msg: playlist.msg, data: playlist.data });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },

  getAllPlaylists: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIdObject = new ObjectId(req.currentUser?.id);
      const playlists = await playlistService.getAllPlaylists(userIdObject);
      res.status(playlists.statusCode).send({
        count: playlists.count,
        msg: playlists.msg,
        data: playlists.data,
      });
    } catch (error) {
      return next(error);
    }
  },
};
