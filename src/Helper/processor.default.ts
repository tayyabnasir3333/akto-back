import { Job } from 'bullmq';
import Stripe from 'stripe';
import Transaction from '../models/Transaction';
import { config } from '../config/configBasic';
import { EventEmitter } from 'events';
import { STATUS } from '../config/ENUM';
import Subscription from '../models/Subscription';
import { User } from '../models/User';

export const paymentEvents = new EventEmitter();
enum Queues {
  DEFAULT = 'default',
}

enum JobType {
  PROCESS_PAYMENT = 'process-payment',
}

export default class DefaultProcessor {
  // private static queue = new QueueService().getQueue(Queues.DEFAULT);

  static async processPayment(job: Job) {
    console.log('Processing payment job:', job.id, 'Data:', job.data);
    const stripe = new Stripe(process.env.Stripe_Secret_Key!, { apiVersion: '2023-10-16' });
    const {  currency, user_id,token, } = job.data;
    const amount = await Subscription.findOne();
    try {
      const customer = await stripe.customers.create({
        source: token.id,
      });
    
     
      const paymentIntent = await stripe.paymentIntents.create({
        amount:Number(amount),  
        currency: 'usd',
        confirm: true,
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        
      });
  
      console.log('Payment processing completed');
    
      if (paymentIntent.status === 'succeeded') {
        await this.saveTransactionData({
          user_id: user_id, 
          amount:Number(amount)/100,
          currency:"usd",
          digits: token.card.last4,
          status:STATUS.APPROVED
        });
        console.log('Payment succeeded:', paymentIntent);
        await User.findByIdAndUpdate({_id:user_id},{premium:true});
        paymentEvents.emit('paymentSuccess', { userId: user_id, amount: Number(amount) });

      } else {
        paymentEvents.emit('paymentFailure', { userId: user_id, amount: Number(amount) });
        console.error('Payment failed:', paymentIntent);
      }
      
      
    } catch (error) {
      console.error('Error processing payment:', error);

      // If payment fails, update transaction status to 'failed'
      await this.updateTransactionStatus(job.data.user_id, STATUS.REJECTED);
      paymentEvents.emit('paymentFailure', { userId: user_id, amount: Number(amount) });
    }
  }

  private static async updateTransactionStatus(user_id: string, status: string) {
    // Update transaction status in the database
    await Transaction.findOneAndUpdate(
      { user_id },
      { $set: { status } },
      { new: true, upsert: true }
    );
      
    console.log(`Transaction status updated for user ${user_id} - Status: ${status}`);
  }

  private static async saveTransactionData(data: any) {
    const transaction = new Transaction(data);
    await transaction.save();
  }
}
