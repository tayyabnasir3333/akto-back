import mongoose, { Document, Schema } from "mongoose";

export interface Playlist {
  name: string;
  user_id: mongoose.Types.ObjectId;
  video_id: mongoose.Types.ObjectId[];
}

export interface PlaylistDocument extends Playlist, Document {}

const playlistSchema = new Schema({
  name: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  video_id: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});

const PlaylistModel = mongoose.model<PlaylistDocument>(
  "Playlist",
  playlistSchema,
);

export default PlaylistModel;
