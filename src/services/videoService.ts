import { ObjectId } from "mongoose";
import { Video, VideoDocument } from "../models/Video";
import { BadRequestError } from "../errors";
import { config } from "../config/configBasic";
import s3Service from "../Helper/s3.service";
import crypto from "crypto";
import FavoriteModel from "../models/Favourite";
import notificationServices from "./notificationServices";
import { NotificationCreationAttributes } from "../models/Notification";
import { User } from "../models/User";

class VideoService {
  async addVideo(reqBody: any, file: any) {
    console.log(reqBody)
    if (file?.video && file.video.length > 0) {
      const data = await s3Service.uploadFile(
        file.video[0],
        crypto.randomUUID(),
        "videos",
      );
      reqBody.video_clip = data.uuid;

    }

    if (file?.thumbnail && file.thumbnail.length > 0) {
      const details = await s3Service.uploadFile(
        file?.thumbnail[0],
        crypto.randomUUID(),
        config.Aws.folder_name,
      );
      reqBody.thumbnail = details.uuid;
    }
    let video = new Video(reqBody);

    await video.save();
    const message = {
      message: `A new clip has been added to the ${reqBody.genre} genre`,
    } as NotificationCreationAttributes;
    await notificationServices.addNotification(message);
    try {
      return { statusCode: 201, msg: "Video added successfully", data: video };
    } catch (error) {
      console.log("SERVICE ERROR", error)
      throw error;
    }
  }

  async updateVideo(video_id: ObjectId, updateData: any, file: any) {
    const video = await Video.findById(video_id);
    if (!video) {
      throw new BadRequestError("Video does not exist");
    }
    if (file?.thumbnail && file?.thumbnail[0]) {
      const details = await s3Service.uploadFile(
        file.thumbnail[0],
        crypto.randomUUID(),
        config.Aws.folder_name,
      );
      updateData.thumbnail = details.uuid;
    } else {
      updateData.thumbnail = video.thumbnail;
    }

    if (file?.video && file?.video[0]) {
      const details = await s3Service.uploadFile(
        file.video[0],
        crypto.randomUUID(),
        "videos",
      );
      updateData.video_clip = details.uuid;
    } else {
      updateData.video_clip = video.video_clip;
    }

    const updatedVideo = await Video.findByIdAndUpdate(video_id, updateData, {
      new: true,
    });

    return {
      statusCode: 201,
      msg: "Video updated successfully",
      data: updatedVideo,
    };
  }

  async getSearchVideo(key: string, skip: number, limit: number) {
    const keyword = new RegExp(".*" + key + ".*", "i");
    const videos = await Video.find({
      $or: [
        { clip_name: { $regex: keyword } },
        { description: { $regex: keyword } },
      ],
    })
      .skip(skip)
      .limit(limit);

    if (videos.length > 0) {
      videos.map((video) => {
        video.thumbnail = s3Service.getPreSignedUrl(
          video.thumbnail as string,
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
    console.log(videos);
    return {
      statusCode: 200,
      data: videos,
      msg: "videos",
    };
  }

  async getVideos(reqQuery: any) {
    try {
      const { query, skip = 0, limit = 10 } = reqQuery;

      let queryFilter: any = { is_draft: false };
      if (query) {
        queryFilter = {
          $or: [
            { clip_name: { $regex: query, $options: "i" } },
            { product_title: { $regex: query, $options: "i" } },
            { tags: { $regex: query, $options: "i" } },
          ],
        };
      }

      const videos = await Video.find(queryFilter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      if (videos.length > 0) {
        videos.map((video) => {
          video.thumbnail = s3Service.getPreSignedUrl(
            video.thumbnail as string,
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

      return {
        statusCode: 200,
        count: videos.length,
        data: videos,
        msg: "Videos",
      };
    } catch (error) {
      return {

        statusCode: 500,
        msg: "Internal Server Error",
      };
    }
  }

  async getCategoriesVideo(
    skip: number,
    limit: number,
    key: String | undefined,
  ) {
    let filter: any = { is_draft: false };
    if (key) {
      filter.character_type = new RegExp(".*" + key + ".*", "i");
    }
    const videos = await Video.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: `$${filter.CHARACTER_TYPE ? "CHARACTER_TYPE" : "character_type"
            }`,
          count: { $sum: 1 },
          videos: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $skip: skip * limit,
      },
      {
        $limit: limit,
      },
    ]);

    // const video = videos.map((item) => {

    //   const videos = item.videos;
    //   const id = item._id;
    //   const count = item.count;
    //   return { id, count, videos };
    // });

    const videoWithUrls = await Promise.all(
      videos.map(async (item) => {
        const videos = item.videos;
        const id = item._id;
        const count = item.count;

        const videosWithUrls = await Promise.all(
          videos.map(async (video: VideoDocument) => {
            const thumbnail = s3Service.getPreSignedUrl(
              video.thumbnail as string,
              config.Aws.folder_name,
            );

            if (video.video_clip) {
              const video_clip = s3Service.getPreSignedUrl(
                video.video_clip as string,
                "videos",
                15,
              );
              return { ...video, thumbnail, video_clip };
            }
            return { ...video, thumbnail };
          }),
        );

        return { id, count, videos: videosWithUrls };
      }),
    );
    return {
      statusCode: 200,
      data: videoWithUrls,
      msg: "Videos by character type",
    };
  }

  async getVideoByCat(
    character_type: String,
    skip: number,
    limit: number,
    key: string | undefined,
  ) {
    let filter: any = { character_type };
    if (key) {

      filter.clip_name = new RegExp(".*" + key + ".*", "i");




    }
    const videos = await Video.find(filter).skip(skip).limit(limit);

    if (videos.length > 0) {
      videos.map((video) => {
        video.thumbnail = s3Service.getPreSignedUrl(
          video.thumbnail as string,
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

    const count = await Video.countDocuments(filter);
    return {
      statusCode: 200,
      count: count,
      data: videos,
      msg: `Videos with character_type '${character_type}'`,
    };
  }

  async getVideoByCatByUser(
    character_type: String,
    skip: number,
    limit: number,
    key: string | undefined,
    user_id: ObjectId | undefined,
  ) {
    let filter: any = { character_type: character_type };
    if (key) {
      filter.$or = [
        { clip_name: new RegExp(key, "i") },
        { description: new RegExp(key, "i") },
      ];
    }
    const videos = await Video.find(filter).skip(skip).limit(limit);

    if (videos.length > 0) {
      videos.map((video) => {
        video.thumbnail = s3Service.getPreSignedUrl(
          video.thumbnail as string,
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

    const favourites = await FavoriteModel.findOne({ user_id }).select(
      "video_id",
    );
    let _videos = videos.map((video) => {
      let fav =
        Boolean(
          favourites &&
          favourites.video_id &&
          favourites?.video_id?.includes(video._id.toString()),
        ) || false;
      const mainVideo = Object.assign({}, video.toObject(), {
        is_favourite: fav,
      });
      return mainVideo;
    });
    const search = await User.findById(user_id).select("searches")
    const count = await Video.countDocuments(filter);
    return {
      statusCode: 200,
      count: count,
      data: { videos: _videos, search },
      msg: `Videos with character_type '${character_type}'`,
    };
  }

  getVideosIsDraft = async (
    is_draft: boolean,
    skip: number,
    limit: number,
    key: string | undefined,
  ) => {
    let filter: any = { is_draft: is_draft };
    if (key) {
      filter.clip_name = new RegExp(".*" + key + ".*", "i");
    }
    let videos = await Video.find(filter)
      .select("created_at clip_name media_type clip_link video_clip")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    if (videos.length > 0) {
      videos.map((video) => {
        if (video.video_clip)
          video.video_clip = s3Service.getPreSignedUrl(
            video?.video_clip as string,
            "videos",
            15,
          );
      });
    }
    const totalCount = await Video.countDocuments(filter);

    return {
      statusCode: 200,
      count: totalCount,
      data: videos,
      msg: "Videos by Is Draft",
    };
  };
  async getSingleVideo(id: ObjectId) {
    const video = await Video.findById(id);
    if (!video) {
      throw new BadRequestError("Not such video found.");
    }

    video.thumbnail = s3Service.getPreSignedUrl(
      video.thumbnail as string,
      config.Aws.folder_name,
    );
    if (video.video_clip)
      video.video_clip = s3Service.getPreSignedUrl(
        video.video_clip as string,
        "videos",
        15,
      );
    // if (user_id){
    //   const favourites = await FavoriteModel.findOne(user_id).select("video_id");
    //   (favourites?.video_id.includes(video._id)) ?video.is_favorite = true :video.is_favorite = false

    // }
    const tags = [...video.tags];
    const related_videos = await Video.find({ tags: { $in: tags } }).select(
      "clip_name thumbnail description clip_length _id",
    );
    if (related_videos.length > 0) {
      related_videos.map((video) => {
        video.thumbnail = s3Service.getPreSignedUrl(
          video.thumbnail as string,
          config.Aws.folder_name,
        );

        if (video.video_clip)
          video.video_clip = s3Service.getPreSignedUrl(
            video?.video_clip as string,
            "videos",
            15,
          );
      });
    }
    return {
      statusCode: 200,
      msg: "Video",
      data: { video, related_videos },
    };
  }
  async getSingleVideoByUser(id: ObjectId, user_id: ObjectId | undefined) {
    const video = await Video.findById(id);
    if (!video) {
      throw new BadRequestError("Not such video found.");
    }

    video.thumbnail = s3Service.getPreSignedUrl(
      video.thumbnail as string,
      config.Aws.folder_name,
    );

    if (video.video_clip)
      video.video_clip = s3Service.getPreSignedUrl(
        video.video_clip as string,
        "videos",
        15,
      );
    const favourites = await FavoriteModel.findOne({ user_id }).select(
      "video_id",
    );

    let fav =
      Boolean(
        favourites &&
        favourites.video_id &&
        favourites?.video_id?.includes(video._id.toString()),
      ) || false;
    const mainVideo = Object.assign({}, video.toObject(), {
      is_favourite: fav,
    });
    const tags = [...video.tags];
    const related_videos = await Video.find({ tags: { $in: tags } }).select(
      "clip_name thumbnail description clip_length",
    );
    let related_videoss = [...related_videos];
    if (related_videos.length > 0) {
      related_videoss = related_videos.map((_video) => {
        let fav =
          Boolean(
            favourites &&
            favourites.video_id &&
            favourites?.video_id?.includes(_video._id.toString()),
          ) || false;

        _video.thumbnail = s3Service.getPreSignedUrl(
          _video.thumbnail as string,
          config.Aws.folder_name,
        );
        if (_video.video_clip)
          _video.video_clip = s3Service.getPreSignedUrl(
            video.video_clip as string,
            "videos",
            15,
          );
        const related_video = Object.assign({}, _video.toObject(), {
          is_favourite: fav,
        });
        return related_video;
      });
    }
    return {
      statusCode: 200,
      msg: "Video",
      data: { video: mainVideo, related_videos: related_videoss },
    };
  }
  async filterVideos(reqQuery: any) {
    const {
      skip = 0,
      limit = 10,
      gender,
      age,
      race,
      media_type,
      role_type,
      genre,
      arche_type,
      character_type,
      emotion_condition,
      location,
      actions,
      time_periods,
    } = reqQuery;

    let queryFilter: any = {};

    const addFilterToQuery = (field: string, values: string[] | undefined) => {
      if (values) {
        queryFilter[field] = { $in: values };
      }
    };

    addFilterToQuery("gender", gender?.split(","));
    addFilterToQuery("age", age?.split(","));
    addFilterToQuery("race", race?.split(","));
    addFilterToQuery("media_type", media_type?.split(","));
    addFilterToQuery("role_type", role_type?.split(","));
    addFilterToQuery("genre", genre?.split(","));
    addFilterToQuery("arche_type", arche_type?.split(","));
    addFilterToQuery("character_type", character_type?.split(","));
    addFilterToQuery("emotion_condition", emotion_condition?.split(","));
    addFilterToQuery("location", location?.split(","));
    addFilterToQuery("time_periods", time_periods?.split(","));
    addFilterToQuery("actions", actions?.split(","));
    console.log("queryFilter", queryFilter)
    const videos = await Video.find(queryFilter).skip(skip).limit(limit);

    const videosWithUrls = await Promise.all(
      videos.map(async (video: VideoDocument) => {
        const thumbnail = s3Service.getPreSignedUrl(
          video.thumbnail as string,
          config.Aws.folder_name,
        );
        if (video.video_clip) {
          const video_clip = s3Service.getPreSignedUrl(
            video.video_clip as string,
            "videos",
            15,
          );
          return { ...video.toObject(), thumbnail, video_clip };
        }
        return { ...video.toObject(), thumbnail };
      }),
    );

    const count = await Video.countDocuments(queryFilter);

    return {
      count,
      statusCode: 200,
      msg: "Videos filtered successfully",
      data: videosWithUrls,
    };
  }
  async deleteVideoById(id: ObjectId) {
    const video = await Video.findById(id);
    if (!video) {
      throw new BadRequestError("Video does not exist found.");
    }
    await Video.findByIdAndDelete(id);

    return {
      statusCode: 201,
      msg: "Video deleted successfully",
    };
  }
}

export default new VideoService();
