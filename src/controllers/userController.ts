/** @format */

import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { ObjectId, Types, isValidObjectId } from "mongoose";
import sgMail from "@sendgrid/mail";
import Email from "../util/Email";

class UserController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.email = req.body.email.toLowerCase();
      const result = await userService.signUp(req.body);
      if (result)
        return res.status(result?.statusCode).send({
          user: result?.user,
          msg: result?.msg,
        });
    } catch (error) {
      return next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.verifyEmail(req.body.token);

      return res.status(result.statusCode).send({
        msg: result.msg,
        token: result.token,
      });
    } catch (error) {
      return next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.email = req.body.email.toLowerCase();
      const result = await userService.signIn(req.body);
      if (result) {
        return res.status(result.statusCode).send({
          token: result.token,
          role: result.role,
          id: result.id,
          msg: result.msg,
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { new_password, current_password } = req.body;
      const id = req.currentUser!.id.toString();

      const update_password = await userService.updatePassword(
        new_password,
        current_password,
        id
      );

      if (update_password)
        return res
          .status(update_password.statusCode)
          .send({ msg: update_password.msg });
    } catch (error) {
      return next(error);
    }
  }
  async contactUs(req: Request, res: Response, next: NextFunction) {
    const { message, contact } = req.body;
    const { email } = req.currentUser as any;
    try {
      const result = await userService.contactUs(message, email, contact);
      return res.status(200).send({
        result,
      });
    } catch (error) {
      return next(error);
    }
  }
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new Types.ObjectId(req.currentUser!.id.toString());
      const user = await userService.getProfile(id);
      return res
        .status(user.statusCode)
        .send({ data: user.data, msg: user.msg });
    } catch (error) {
      return next(error);
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const forget = await userService.forgetPassword(email);
      return res.status(forget.statusCode).send({ msg: forget.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async verifyForgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, new_password } = req.body;
      const updated = await userService.verifyForgetPassword(
        token,
        new_password
      );
      return res.status(updated.statusCode).send({ msg: updated.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async changeName(req: Request, res: Response, next: NextFunction) {
    try {
      const { update_name } = req.body;
      const id = req.currentUser!.id as unknown as ObjectId;
      const updated = await userService.changeName(update_name, id);
      return res.status(updated.statusCode).send({ msg: updated.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  async changeNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { notification } = req.body;
      const id = req.currentUser!.id as unknown as ObjectId;
      const updated = await userService.changeNotification(notification, id);
      return res.status(updated.statusCode).send({ msg: updated.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

export default new UserController();
