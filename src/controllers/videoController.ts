// controllers/videoController.ts
import { Request, Response, NextFunction } from "express";
import videoService from "../services/videoService";
import { BadRequestError, NotFoundError } from "../errors";
import { apiRestrictions } from "../util/apiRestrictions";
import { ObjectId, Types } from "mongoose";

class VideoController {
  async addVideo(req: Request, res: Response, next: NextFunction) {

    try {
      const file: any = req.files;

      if (!req.body.is_draft || req.body.is_draft === 'false') {
        if (!file.thumbnail) {
          throw new BadRequestError("Thumbnail is required");
        }
        if (!file.video) {
          throw new BadRequestError("Video is required");
        }
      }
      const result = await videoService.addVideo(req.body, file);
      return res.status(201).send({ result });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async updateVideo(req: Request, res: Response, next: NextFunction) {
    const file = req.files;
    const { video_id } = req.body;

    try {
      const result = await videoService.updateVideo(video_id, req.body, file);
      return res.status(result.statusCode).send({ result });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getSearchVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, skip = 0, limit = 10 } = req.query;
      if (!key || !skip || !limit) {
        throw new BadRequestError("All the keys are mandatory");
      }

      const videos = await videoService.getSearchVideo(
        String(key),
        Number(skip),
        Number(limit),
      );
      return res
        .status(videos.statusCode)
        .send({ msg: videos.msg, data: videos.data });
    } catch (error) {
      return next(error);
    }
  }

  async getSearchVideosUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, skip = 0, limit = 10 } = req.query;
      if (!key || !skip || !limit) {
        throw new BadRequestError("All the keys are mandatory");
      }
      if (key) {
        const result = await apiRestrictions(req.currentUser, res, next);
        if (!result) {
          throw new BadRequestError(
            "Free search limit exceeded, Please upgrade your account",
          );
        }
      }
      const videos = await videoService.getSearchVideo(
        String(key),
        Number(skip),
        Number(limit),
      );
      return res
        .status(videos.statusCode)
        .send({ msg: videos.msg, data: videos.data });
    } catch (error) {
      return next(error);
    }
  }

  async getVideos(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.query.query) {
        const result = await apiRestrictions(req.currentUser, res, next);
        if (!result) {
          throw new BadRequestError(
            "Free search limit exceeded, Please upgrade your account",
          );
        }
      }
      const videos = await videoService.getVideos(req.query);
      return res.status(videos.statusCode).send(videos);
    } catch (error) {
      return next(error);
    }
  }
  async getCategoriesVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip = 0, limit = 10, key } = req.query;
      const videos = await videoService.getCategoriesVideo(
        +skip,
        +limit,
        key as string,
      );
      return res
        .status(videos.statusCode)
        .send({ data: videos.data, msg: videos.msg });
    } catch (error) {
      return next(error);
    }
  }

  async getVideosIsDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const { is_draft, skip = 0, limit = 10, key } = req.query;
      if (!is_draft) {
        throw new BadRequestError("is_draft query is mandatory");
      }
      const isDraftQueryParam = is_draft === "true" ? true : false;
      console.log("isDraftQueryParam", isDraftQueryParam);
      const videos = await videoService.getVideosIsDraft(
        isDraftQueryParam,
        Number(skip),
        Number(limit),
        key?.toString(),
      );
      console.log(videos);
      return res
        .status(videos.statusCode)
        .send({ count: videos.count, data: videos.data, msg: videos.msg });
    } catch (error) {
      return next(error);
    }
  }
  async getVideoByCat(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip = 0, limit = 10, key } = req.query;
      const { character_type } = req.params;

      if (!character_type) {
        throw new BadRequestError("Character type is mandatory.");
      }

      const videos = await videoService.getVideoByCat(
        character_type,
        +skip,
        +limit,
        key?.toString(),
      );
      return res
        .status(videos.statusCode)
        .send({ count: videos.count, data: videos.data, msg: videos.msg });
    } catch (error) {
      return next(error);
    }
  }
  async getVideoByCatByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip = 0, limit = 10, key } = req.query;
      const { character_type } = req.params;

      if (!character_type) {
        throw new BadRequestError("Character type is mandatory.");
      }
      if (key?.toString()) {
        const result = await apiRestrictions(req.currentUser, res, next);
        if (!result) {
          throw new BadRequestError(
            "Free search limit exceeded, Please upgrade your account",
          );
        }
      }
      const videos = await videoService.getVideoByCatByUser(
        character_type,
        +skip,
        +limit,
        key?.toString(),
        req.currentUser?.id as unknown as ObjectId,
      );
      return res
        .status(videos.statusCode)
        .send({ count: videos.count, data: videos.data, msg: videos.msg });
    } catch (error) {
      return next(error);
    }
  }
  async getSingleVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const video = await videoService.getSingleVideo(
        id as unknown as ObjectId,
      );
      return res
        .status(video.statusCode)
        .send({ data: video.data, msg: video.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  async getSingleVideoByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("id is mandatory");
      }

      const video = await videoService.getSingleVideoByUser(
        id as unknown as ObjectId,
        req.currentUser!.id as unknown as ObjectId,
      );
      return res
        .status(video.statusCode)
        .send({ data: video.data, msg: video.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  async filterVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const videos = await videoService.filterVideos(req.query);
      return res
        .status(videos.statusCode)
        .send({ count: videos.count, data: videos.data, msg: videos.msg });
    } catch (error) {
      return next(error);
    }
  }
  async filterVideosUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await apiRestrictions(req.currentUser, res, next);
      if (!result) {
        throw new BadRequestError(
          "Free search limit exceeded, Please upgrade your account",
        );
      }
      const videos = await videoService.filterVideos(req.query);
      return res
        .status(videos.statusCode)
        .send({ count: videos.count, data: videos.data, msg: videos.msg });
    } catch (error) {
      return next(error);
    }
  }
  async deleteVideoById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const result = await videoService.deleteVideoById(
        id as unknown as ObjectId,
      );
      return res.status(result.statusCode).send({ msg: result.msg });
    } catch (error) {
      return next(error);
    }
  }
}

export default new VideoController();
