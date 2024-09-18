import { Request, Response, NextFunction } from "express";
import paymentService from "../services/paymentService";
import { Types } from "mongoose";

class Paymentcontroller {
  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, amount } = req.body;
      const userId = req.currentUser?.id;

      const user_id = new Types.ObjectId(userId);
      const paymentPromise = paymentService.processPayment(
        token,
        amount,
        user_id,
      );
      paymentPromise
        .then((payment: any) => {
          return res.status(payment.statusCode).send({ msg: payment.msg });
        })
        .catch((error) => {
          console.error("Payment error:", error);
          return res.status(500).send({ msg: "Internal Server Error" });
        });
    } catch (error) {
      return next(error);
    }
  }

  async getUserSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser?.id;
      const user_id = new Types.ObjectId(userId);
      const subscription = await paymentService.getUserSubscription(user_id);
      return res.status(subscription.statusCode).send({
        msg: subscription.msg,
        transactions: subscription.transaction,
      });
    } catch (error) {
      return next(error);
    }
  }
  async updateSubscriptionPrice(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { amount } = req.body;
      const update_amount = await paymentService.updateSubscriptionAmount(
        amount,
      );
      return res
        .status(update_amount!.statusCode)
        .send({ msg: update_amount!.msg });
    } catch (error) {
      return next(error);
    }
  }
  async getAllSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip = 0, limit = 10 } = req.query;
      console.log("here")
      const transaction = await paymentService.getAllSubscription(
        +skip,
        +limit,
      );
      return res
        .status(transaction.statusCode)
        .send({ data: transaction.data, msg: transaction.msg });
    } catch (error) {
      return next(error)
    }
  }

  async getSubs(req: Request, res: Response, next: NextFunction) {
    try {
      const subs = await paymentService.getSubs();
      return res
        .status(subs.statusCode)
        .send({ amount: subs.amount, msg: subs.msg });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

export default new Paymentcontroller();
