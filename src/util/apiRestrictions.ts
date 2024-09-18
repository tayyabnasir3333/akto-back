import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { SearchLimit } from "../models/SearchLimit";
const apiHits = new Map<string, number>();

export const apiRestrictions = async (
  currentUser: any,
  res: Response,
  next: NextFunction,
) => {
  // const userIP =
  //   req.headers["x-forwarded-for"] || (req.connection.remoteAddress as any);
  // const ipv4Match = userIP.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
  // const ipv4Address = ipv4Match ? ipv4Match[1] : userIP;

  const user = currentUser ? await User.findById(currentUser.id) : null;
  const freeSearches = await SearchLimit.findOne();
  const limit: any = user ? freeSearches?.freeSearches : 3;
  const hitCount = (user && user.searches) || 0;
  if(user?.premium){
    return true
  }
  // if (hitCount >= limit) {
  //   return false;
  // }

  if (user) {
    user.searches = hitCount + 1;
    await user.save();
  } else {
    // apiHits.set(ipv4Address, hitCount + 1);
  }
  return true;
};
