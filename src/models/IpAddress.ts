import mongoose, { Schema, Document } from "mongoose";

interface IpAddress extends Document {
  ip_address: string;
  hits: number;
}

const IpAddressSchema: Schema = new Schema(
  {
    ip_address: { type: String, required: true },
    hits: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

export const IpAddress = mongoose.model<IpAddress>(
  "IpAddress",
  IpAddressSchema,
);
