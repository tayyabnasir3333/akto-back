/** @format */

import { ObjectId } from "mongoose";
import s3Service from "../Helper/s3.service";
import { Blog } from "../models/Blog";
import crypto from "crypto";
import { BadRequestError } from "../errors";

class BlogService {
  async addBlog(reqBody: any, file: any) {
    console.log("IMAGE", file.blogImage[0]);

    const data = await s3Service.uploadFile(
      file.blogImage[0],
      crypto.randomUUID(),
      "blogs"
    );

    reqBody.blogImage = data.uuid;
    let blog = new Blog(reqBody);

    await blog.save();
    try {
      return { statusCode: 201, msg: "Blogs added successfully", data: blog };
    } catch (error) {}
  }

  async updateBlog(blog_id: ObjectId, updateData: any, file: any) {
    const blog = await Blog.findById(blog_id);
    if (!blog) {
      throw new BadRequestError("Blog does not exist");
    }
    if (file?.blogImage && file?.blogImage[0]) {
      const details = await s3Service.uploadFile(
        file.blogImage[0],
        crypto.randomUUID(),
        "blogs"
      );
      updateData.blogImage = details.uuid;
    } else {
      updateData.blogImage = blog.blogImage;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blog_id, updateData, {
      new: true,
    });
    return {
      statusCode: 201,
      msg: "Blogs updated successfully",
      data: updatedBlog,
    };
  }

  async getBlogs(reqQuery: any) {
    try {
      const { query, skip = 0, limit = 10 } = reqQuery;

      let queryFilter = {};
      if (query) {
        queryFilter = {
          $or: [{ title: { $regex: query, $options: "i" } }],
        };
      }

      const blogs = await Blog.find(queryFilter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      console.log("BLOGS", blogs);

      if (blogs.length > 0) {
        blogs.map((b) => {
          if (b.blogImage) {
            b.blogImage = s3Service.getPreSignedUrl(
              b.blogImage as string,
              "blogs",
              360
            );
          }
        });
      }
      const count = await Blog.countDocuments(queryFilter);

      return {
        statusCode: 200,
        count,
        data: blogs,
        msg: "All blogs",
      };
    } catch (error) {
      console.log("SEARCH", error);

      return {
        statusCode: 500,
        msg: "Internal server error",
      };
    }
  }

  async getSingleBlog(id: ObjectId) {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new BadRequestError("Not such blog found");
    }

    blog.blogImage = s3Service.getPreSignedUrl(
      blog.blogImage as string,
      "blogs"
    );

    return {
      statusCode: 200,
      msg: "Blog",
      data: { blog },
    };
  }

  async deleteBlogById(id: ObjectId) {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new BadRequestError("Not such blog found");
    }

    await Blog.findByIdAndDelete(id);
    return {
      statusCode: 201,
      msg: "Blog deleted successfully",
    };
  }
}

export default new BlogService();
