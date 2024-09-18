/** @format */

import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";
import blogService from "../services/blogService";
import { ObjectId } from "mongoose";

class BlogController {
  async addBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const file: any = req.files;
      console.log("IMAGE", file);
      if (!file.blogImage) {
        throw new BadRequestError("Image is required");
      }

      const result = await blogService.addBlog(req.body, file);
      return res.status(201).send({ result });
    } catch (error) {
      console.log("Blog Error", error);
      return next(error);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    const file: any = req.files;
    const { blog_id } = req.body;
    try {
      const result = await blogService.updateBlog(blog_id, req.body, file);
      return res.status(result.statusCode).send({ result });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async getBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("QUERY", req.query);

      const blogs = await blogService.getBlogs(req.query);
      return res.status(blogs.statusCode).send(blogs);
    } catch (error) {
      return next(error);
    }
  }

  async getSingleBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blog = await blogService.getSingleBlog(id as unknown as ObjectId);
      return res
        .status(blog.statusCode)
        .send({ data: blog.data, msg: blog.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async deleteBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blog = await blogService.deleteBlogById(id as unknown as ObjectId);
      return res.status(blog.statusCode).send({ msg: blog.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

export default new BlogController();
