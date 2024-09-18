import mongoose, { Schema, Document } from "mongoose";

interface SearchLimitModel extends Document {
  freeSearches: number;
  guestSearch: number;
}

const SearchLimitSchema: Schema = new Schema({
  freeSearches: { type: Number, required: true, default: 0 },
  guestSearch: { type: Number, required: true, default: 0 },
});

export const SearchLimit = mongoose.model<SearchLimitModel>(
  "SearchLimit",
  SearchLimitSchema,
);
