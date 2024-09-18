import mongoose, { Document, Schema } from "mongoose";

export interface Favorite {
  user_id: mongoose.Types.ObjectId;
  video_id: mongoose.Types.ObjectId[];
}

export interface FavoriteDocument extends Favorite, Document {}

const favoriteSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  video_id: [{ type: Schema.Types.ObjectId, ref: "Video", required: true }],
});

const FavoriteModel = mongoose.model<FavoriteDocument>(
  "Favorite",
  favoriteSchema,
);

export default FavoriteModel;
