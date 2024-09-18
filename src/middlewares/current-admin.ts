// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface UserPayload {
//   username: string;
//   id: number;
//   role:string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: UserPayload;
//     }
//   }
// }

// export const currentAdmin = (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const currentUser = req.currentUser;
//     if (currentUser && currentUser.role === 'admin') {
//       req.currentUser = currentUser;
//       return next();
//     } else {
//       return res.status(401).send({ message: 'Not authorized as admin.' });
//     }
//   };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

interface AdminPayload {
  username: string;
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      currentAdmin?: AdminPayload;
    }
  }
}

export const currentAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers["authorization"];

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next();
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as AdminPayload;
    if (payload.role === "admin") {
      req.currentUser = payload;
    }
  } catch (e) {}

  return next();
};
