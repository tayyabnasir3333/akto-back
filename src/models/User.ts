import mongoose, { Aggregate, Schema } from "mongoose";
import Password from "../util/Password";
import {
  ROLES,
  ETHNICITY,
  PROFESSION,
  GENDER,
  PRONOUNS,
  AGE_RANGE,
} from "../config/ENUM";

interface UserAttributes {
  email_verified?: boolean;
  role: string;
  full_name: string;
  email: string;
  password: string;
  searches: number;
  premium: boolean;
  premium_expiry?: Date;
  profession?: string;
  ethnicity?: string;
  gender?: string;
  pronouns?: string;
  age_range?: string;
  about_you?: string;
  token?: string;
  notification?:boolean
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, "email_verified" | "token"> {}

const userSchema = new Schema<UserAttributes>(
  {
    full_name: { type: String, required: true },

    password: { type: String, required: true },
    email_verified: { type: Boolean, required: true, default: false },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ROLES,
      values: [ROLES.USER, ROLES.ADMIN],
      default: ROLES.USER,
      required: true,
    },
    searches: {
      type: Number,
      default: 0,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    premium_expiry: {
      type: Date,
      required: false,
    },
    profession: {
      type: String,
      enum: Object.values(PROFESSION),
      default: null,
      required: false,
    },
    ethnicity: {
      type: String,
      enum: Object.values(ETHNICITY),
      default: null,
      required: false,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
      default: null,
      required: false,
    },
    pronouns: {
      type: String,
      enum: Object.values(PRONOUNS),
      default: null,
      required: false,
    },
    age_range: {
      type: String,
      enum: Object.values(AGE_RANGE),
      default: null,
      required: false,
    },
    about_you: { type: String, required: false },
    token: { type: String, required: false },
    notification:{type:Boolean, defaultValue:true}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const hash = await Password.toHash(this.password);
  this.password = hash;
});
export const User = mongoose.model<UserAttributes>("User", userSchema);
