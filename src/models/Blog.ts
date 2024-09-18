/** @format */

import mongoose, { Schema } from "mongoose";

interface BlogAttributes {
  title: string;
  description: string;
  blogImage: String;
}

const blogSchema = new Schema<BlogAttributes>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    blogImage: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const Blog = mongoose.model<BlogAttributes>("Blog", blogSchema);
