import mongoose from "mongoose";
import PlaylistModel, { Playlist, PlaylistDocument } from "../models/Playlist";
import { BadRequestError } from "../errors/BadRequestError";
import { ObjectId } from "mongodb";
import s3Service from "../Helper/s3.service";
import { config } from "../config/configBasic";
import { VideoDocument } from "../models/Video";
import { capitalizeFirstLetterOfEachWord } from "../util/capitalFirstLetter";

class PlaylistService {
  async addUpdatePlaylist(
    name: string,
    user_id: ObjectId,
    playlist_id: ObjectId | undefined,
  ) {
    const formattedString: string = capitalizeFirstLetterOfEachWord(name);

    if (playlist_id) {
      const playlist = await PlaylistModel.findById(playlist_id);
      if (!playlist) {
        throw new BadRequestError("Playlist doesn't exist");
      }
      const existingPlaylists = await PlaylistModel.find({ user_id });
      const hasDuplicateName = existingPlaylists.some(
        (existingPlaylist) => existingPlaylist.name === formattedString,
      );

      if (hasDuplicateName) {
        throw new BadRequestError(
          "Playlist with the same name already exists.",
        );
      }
      const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(
        playlist_id,
        { name: formattedString },
        { new: true },
      );

      return {
        statusCode: 201,
        msg: "Playlist name updated successfully",
      };
    }
    const existingPlaylists = await PlaylistModel.find({ user_id });
    const hasDuplicateName = existingPlaylists.some(
      (existingPlaylist) => existingPlaylist.name === formattedString,
    );

    if (hasDuplicateName) {
      throw new BadRequestError("Playlist with the same name already exists.");
    }
    name = formattedString;
    const playlist = new PlaylistModel({ name, user_id });
    await playlist.save();
    return {
      statusCode: 201,
      msg: "Playlist added successfully",
    };
  }

  async addVideoPlaylist(playlist_id: ObjectId, video_id: ObjectId) {
    const exist = await PlaylistModel.findById(playlist_id);
    if (!exist) {
      throw new BadRequestError("playlist doesn't exit");
    }
    if (exist.video_id.includes(video_id)) {
      //error
      throw new BadRequestError("Video is already exist in the playlist");
    }
    exist.video_id.push(video_id);
    await exist.save();
    return {
      statusCode: 200,
      msg: "video added to playlist successfully",
      data: exist,
    };
  }

  async deleteVideoPlaylist(playlist_id: ObjectId, video_id: ObjectId) {
    const exist = await PlaylistModel.findById(playlist_id);
    if (!exist) {
      throw new BadRequestError("playlist doesn't exit");
    }
    if (exist.video_id.includes(video_id)) {
      await PlaylistModel.findOneAndUpdate(
        playlist_id,
        { $pull: { video_id } },
        { new: true },
      );
      return {
        statusCode: 201,
        msg: "video popped from playlist playlist",
        data: exist,
      };
    }
    throw new BadRequestError("video doesn't exist in the playlist");
  }

  async deletePlaylist(id: ObjectId) {
    const playlist = await PlaylistModel.findById(id);
    if (!playlist) {
      throw new BadRequestError("Playlist doesn't exist");
    }

    await PlaylistModel.findByIdAndDelete(id);
    return {
      statusCode: 201,
      msg: "Playlist deleted successfully",
    };
  }

  async getPlaylistById(playlist_id: ObjectId) {
    const playlist = await PlaylistModel.aggregate([
      {
        $match: {
          _id: playlist_id,
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
          name: 1,
          videos: 1,
        },
      },
    ]);
    if (!playlist) {
      throw new BadRequestError("Playlist Does not exist");
    }

    if (playlist[0].videos.length > 0)
      playlist[0].videos.map((video: VideoDocument) => {
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
      statusCode: 200,
      msg: "Playlist by ID get successfully",
      data: playlist,
    };
  }
  async getAllPlaylists(user_id: ObjectId) {
    const user = await PlaylistModel.find(user_id);
    if (!user) {
      throw new BadRequestError("User does not have any playlist");
    }
    try {
      const playlists = await PlaylistModel.aggregate([
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
            name: 1,
            videos: 1,
          },
        },
      ]);

      playlists.forEach((playlist) => {
        if (playlist.videos && playlist.videos.length > 0) {
          playlist.videos.forEach((video: VideoDocument) => {
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
        }
      });

      return {
        statusCode: 200,
        msg: "All playlists retrieved successfully",
        data: playlists,
        count: playlists.length,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new PlaylistService();
