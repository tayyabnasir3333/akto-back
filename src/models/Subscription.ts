import mongoose, { Schema, Document } from 'mongoose';

interface SubscriptionModel extends Document {
    amount: number;
  
}

const SubscriptionSchema: Schema = new Schema({
  
  amount: { type: Number, required: true },
  
  
 
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },});

const Subscription = mongoose.model<SubscriptionModel>('Subscription', SubscriptionSchema);

export default Subscription;
