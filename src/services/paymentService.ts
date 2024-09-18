import { ObjectId, Types } from "mongoose";
import { JobType, Queues } from "../Helper/processQueue";
import QueueService from "../Helper/queueService";
import { paymentEvents } from "../Helper/processor.default";
import Transaction from "../models/Transaction";
import Subscription from "../models/Subscription";
import Stripe from "stripe";
import { User } from "../models/User";
import { STATUS } from "../config/ENUM";
import { BadRequestError } from "../errors";

class PaymentService {
  async processPayment(token: any, amount: number, user_id: Types.ObjectId) {
    //   const queueService = new QueueService();
    // queueService.instantiateQueues();
    // const queue = new QueueService().getQueue(Queues.DEFAULT);

    // return new Promise((resolve, reject) => {

    //   paymentEvents.on('paymentSuccess', (data) => {
    //     console.log(`Payment succeeded for user ${data.userId} - Amount: ${data.amount}`);

    //     cleanupEventListeners();

    //     resolve({
    //       statusCode: 200,
    //       msg: "Payment has been Succeed"
    //     });
    //   });

    //   paymentEvents.on('paymentFailure', (data) => {
    //     console.log(`Payment failed for user ${data.userId} - Amount: ${data.amount}`);
    //     // Clean up event listeners
    //     cleanupEventListeners();
    //     // Reject the promise with failure data
    //     reject({
    //       statusCode: 400,
    //       msg: "Payment has been Failed"
    //     });
    //   });

    //   // Function to clean up event listeners
    //   const cleanupEventListeners = () => {
    //     paymentEvents.removeAllListeners('paymentSuccess');
    //     paymentEvents.removeAllListeners('paymentFailure');
    //   };

    //   // Add job to the queue
    //   queue.add(JobType.PROCESS_PAYMENT, { amount, token, user_id });
    // });
    try {
      const amount = await Subscription.findOne().select("amount");
      if (!amount) {
        throw new BadRequestError("the amount is incorrect");
      }
      console.log(amount, typeof amount);
      const stripe = new Stripe(process.env.Stripe_Secret_Key!, {
        apiVersion: "2023-10-16",
      });
      const customer = await stripe.customers.create({
        source: token.id,
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: +amount.amount,
        currency: "usd",
        confirm: true,
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });
      if (paymentIntent.status === "succeeded") {
        await this.saveTransactionData({
          user_id: user_id,
          amount: +amount.amount / 100,
          currency: "usd",
          digits: token.card.last4,
          status: STATUS.APPROVED,
        });
        console.log("Payment succeeded:", paymentIntent);
        let date = new Date();
        date.setDate(date.getDate() + 30);
        await User.findByIdAndUpdate({ _id: user_id }, { premium: true, premium_expiry: date });
        return {
          statusCode: 201,
          msg: "Payment has been Succeed",
        };
      }
    } catch (error: any) {
      await this.updateTransactionStatus(
        user_id as unknown as ObjectId,
        STATUS.REJECTED,
      );
      throw new BadRequestError(error.message);
    }
  }
  async updateTransactionStatus(user_id: ObjectId, status: string) {
    await Transaction.findOneAndUpdate(
      { user_id },
      { $set: { status } },
      { new: true, upsert: true },
    );
  }
  async saveTransactionData(data: any) {
    const transaction = new Transaction(data);
    await transaction.save();
  }
  async getUserSubscription(user_id: Types.ObjectId) {
    const transaction = await Transaction.find({user_id});
    return {
      statusCode: 200,
      transaction,
      msg: "All transactions.",
    };
  }
  async updateSubscriptionAmount(amount: number) {
    const subscription = await Subscription.findOne({ amount: amount });
    let save;
    if (subscription) {
      save = await Subscription.findByIdAndUpdate(subscription._id, {
        amount: amount,
      });
    } else {
      save = await Subscription.create({ amount: amount });
    }
    if (save) {
      return {
        statusCode: 200,
        msg: `The subscription is updated to ${amount}`,
      };
    }
  }

  async getAllSubscription(skip: number, limit: number) {
    const subscription = await Transaction.find().sort({created_at:-1}).skip(skip).limit(limit);
    const count = await Transaction.countDocuments();
    
    return {
      statusCode: 200,
      data: { subscription, count },
      msg: "All user Subscriptions",
    };
  }

  async getSubs() {
    const subs = await Subscription.findOne();
    if (!subs) {
      return {
        statusCode: 404,
        msg: "Subscription not found",
      };
    }
    return {
      statusCode: 200,
      amount: subs,
      msg: "subs amount",
    };
  }
}

export default new PaymentService();
