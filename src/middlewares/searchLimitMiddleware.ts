import { NextFunction, Request, Response } from "express";
import { SearchLimit } from "../models/SearchLimit";
import { BadRequestError, NotAuthorizedError } from "../errors";
import { IpAddress } from "../models/IpAddress";

export const searchLimitRestriction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userIP =
    req.headers["x-forwarded-for"] || (req.socket?.remoteAddress as any);
  const ipv4Match = userIP?.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
  const ip_address = ipv4Match ? ipv4Match[1] : userIP;

  let ipRecord = await IpAddress.findOne({ ip_address });
  if (!ipRecord) {
    ipRecord = new IpAddress({ ip_address });
  }

  const searchLimit = await SearchLimit.findOne();
  const limit: number = searchLimit?.guestSearch || 3;

  if (ipRecord.hits >= limit) {
    throw new BadRequestError("Limit exceeds as guest user, Please Sign Up");
  }

  ipRecord.hits += 1;
  await ipRecord.save();

  return next();
};
