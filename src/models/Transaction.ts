import mongoose, { Schema, Document } from 'mongoose';
import { STATUS } from '../config/ENUM';

interface TransactionModel extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  digits: string;
  status:string;
}

const TransactionSchema: Schema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  digits: { type: String, required: true },
  status:{type: String, enum:STATUS,
    values:[STATUS.APPROVED,STATUS.PENDING, STATUS.REJECTED],
    default:STATUS.PENDING, 
    required:true}
 
},{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
},);

const Transaction = mongoose.model<TransactionModel>('Transaction', TransactionSchema);

export default Transaction;
