import mongoose, { Schema, Document } from 'mongoose';
import { STATUS } from '../config/ENUM';

interface TransactionModel extends Document {
    ip_adrress: string;
  visit: number;
  mac_address: string;
  
}

const TransactionSchema: Schema = new Schema({
  ip_adrress: { type: String, required: true },
  visit: { type: Number, required: true },
  mac_address: { type: String, required: true },
  
 
});

const Transaction = mongoose.model<TransactionModel>('Transaction', TransactionSchema);

export default Transaction;
