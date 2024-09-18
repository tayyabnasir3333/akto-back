import mongoose from "mongoose";
import FavoriteModel, { Favorite, FavoriteDocument } from "../models/Favourite";
import { ObjectId } from "mongodb";
import s3Service from "../Helper/s3.service";
import { config } from "../config/configBasic";
import { VideoDocument } from "../models/Video";

class FavoriteService {
  async addToFavorites(user_id: ObjectId, video_id: ObjectId) {
    const existingUserFav = await FavoriteModel.findOne({ user_id });

    if (existingUserFav) {
      if (existingUserFav.video_id.includes(video_id)) {
        await FavoriteModel.findOneAndUpdate(
          { user_id },
          { $pull: { video_id } },
        );
        return {
          statusCode: 201,
          msg: "Unfavorite the video",
          data: existingUserFav,
        };
      }
      existingUserFav.video_id.push(video_id);
      await existingUserFav.save();
      return {
        statusCode: 201,
        msg: "Favorite added successfully in existing user",
        data: existingUserFav,
      };
    }

    const newFavorites = new FavoriteModel({ user_id, video_id });
    await newFavorites.save();
    return {
      statusCode: 201,
      msg: "New Favorite added successfully",
      data: newFavorites,
    };
  }

  async getFavorites(user_id: ObjectId) {
    const favorites = await FavoriteModel.aggregate([
      {
        $match: {
          user_id,
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video_id",
          foreignField: "_id",
          as: "videos",
        },
      },
      {
        $project: {
          videos: 1,
        },
      },
    ]);

    if (favorites[0].videos.length > 0)
      favorites[0].videos.map((video: VideoDocument) => {
        video.thumbnail = s3Service.getPreSignedUrl(
          video.thumbnail as unknown as string,
          config.Aws.folder_name,
        );

        if (video.video_clip)
          video.video_clip = s3Service.getPreSignedUrl(
            video.video_clip as string,
            "videos",
            15,
          );
      });

    return {
      statusCode: 201,
      msg: "Favorites retrieved successfully",
      data: favorites,
    };
  }
}

export default new FavoriteService();
