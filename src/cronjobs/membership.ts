import cron from "cron";
import { User } from "../models/User";

const job = new cron.CronJob(
  '0 0 * * *',
  async () => {
    try {
      const expiredUsers = await User.find({ premium_expiry: { $lte: new Date() } });

      await User.updateMany(
        { _id: { $in: expiredUsers.map(user => user._id) } },
        { premium: false }
      );

      console.log('Premium status updated for expired users.');
    } catch (error: any) {
      console.error('Error updating premium status:', error.message);
    }
  },
  null,
  true, 
  'America/New_York' 
);

job.start();
