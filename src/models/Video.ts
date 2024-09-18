/** @format */

import mongoose, { Document, Schema } from "mongoose";
import {
  CHARACTER_ACTIONS,
  CHARACTER_ARCHTYPE,
  CHARACTER_TYPE,
  EMOTION_CONDITION,
  ETHNICITY,
  GENDER,
  MEDIA_TYPE,
  ROLE_TYPE,
  LOCATION,
  TIME_PERIODS,
  GENRE,
} from "../config/ENUM";

// interface AvailableOn {
//   netflix: boolean;
//   amazon: boolean;
// }

// interface AvailableOn {
//   [platform: string]: boolean;
// }

interface AvailableOn {
  [platform: string]: boolean;
}


interface Crew {
  director: string[];
  writer: string[];
  producer: string[];
  studio: string[];
}
interface Video {
  clip_name: string;
  product_title: string;
  release_year: number;
  rating: string;
  clip_link: String;
  just_watch_link?: String;
  description: string;
  crew: Crew;
  genre: GENRE[];
  cast: string[];
  tags: string[];
  is_premium: boolean;
  is_draft: boolean;
  available_on?: AvailableOn;
  watch_for: string;
  time_stamp: string;
  clip_length: string;
  gender: GENDER[];
  age: String[];
  race: ETHNICITY[];
  media_type: MEDIA_TYPE[];
  role_type: ROLE_TYPE[];
  arche_type: CHARACTER_ARCHTYPE[];
  character_type: CHARACTER_TYPE;
  emotion_condition: EMOTION_CONDITION[];
  location: string;
  location_type: LOCATION[];
  time_periods: TIME_PERIODS[];
  // actions: CHARACTER_ACTIONS;
  actions: CHARACTER_ACTIONS[];

  thumbnail: String;
  video_clip: String;
  is_favorite: Boolean;
}

export interface VideoDocument extends Video, Document { }

const videoSchema = new Schema<VideoDocument>(
  {
    clip_name: { type: String, required: true },

    media_type: {
      type: [String],

      enum: Object.values(MEDIA_TYPE),
      required: false,
    },
    genre: {
      type: [String],
      enum: Object.values(GENRE),
      required: false,
    },
    product_title: { type: String, required: false },
    release_year: { type: Number, required: false },
    rating: { type: String, required: false },
    clip_link: { type: String, required: false },

    description: { type: String, required: false },
    tags: { type: [String], required: false },
    crew: {
      type: {
        director: { type: [String], required: false },
        writer: { type: [String], required: false },
        producer: { type: [String], required: false },
        studio: { type: [String], required: false },
      },
      required: false,
    },

    // location: { type: String, required: true },
    location: { type: String, required: false },

    gender: { type: [String], enum: Object.values(GENDER), required: false },
    race: { type: [String], enum: Object.values(ETHNICITY), required: false },

    actions: {
      type: [String],
      enum: Object.values(CHARACTER_ACTIONS),
      required: false,
    },
    emotion_condition: {
      type: [String],
      enum: Object.values(EMOTION_CONDITION),
      required: false,
    },
    character_type: {
      type: String,
      enum: Object.values(CHARACTER_TYPE),
      required: false,
    },
    arche_type: {
      type: [String],
      enum: Object.values(CHARACTER_ARCHTYPE),
      required: false,
    },
    location_type: {
      type: [String],
      enum: Object.values(LOCATION),
      required: false,
    },
    time_periods: {
      type: [String],
      enum: Object.values(TIME_PERIODS),
      required: false,
    },
    role_type: {
      type: [String],
      enum: Object.values(ROLE_TYPE),
      required: false,
    },
    age: { type: [String], required: false },
    cast: { type: [String], required: false },
    is_premium: { type: Boolean, required: false, default: false },
    is_draft: { type: Boolean, required: false, default: false },
    // available_on: {
    //   netflix: { type: Boolean, required: false },
    //   amazon_prime_video: { type: Boolean, required: false },
    //   acorn_tv: { type: Boolean, required: false },
    //   allblk: { type: Boolean, required: false },
    //   dust: { type: Boolean, required: false },
    //   vix: { type: Boolean, required: false },
    // },

    available_on: {
      type: Object,
      required: false,
    },

    // available_on: {
    //   type: Map,
    //   of: Boolean,
    //   required: false,
    // },
    thumbnail: { type: String, required: false },
    video_clip: { type: String, required: false },
    watch_for: { type: String, required: false },
    time_stamp: { type: String, required: false },
    clip_length: { type: String, required: false },
    just_watch_link: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Video = mongoose.model<VideoDocument>("Video", videoSchema);
