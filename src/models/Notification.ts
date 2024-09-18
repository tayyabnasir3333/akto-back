import mongoose, { Schema, Document } from 'mongoose';

interface NotificationAttributes extends Document {
    message: string;
  
}
export interface NotificationCreationAttributes
  extends NotificationAttributes {}
const NotificationSchema = new Schema<NotificationAttributes>({
  
  message: { type: String, required: true },
  
  
 
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },});

const Notification = mongoose.model<NotificationAttributes>('Notifications', NotificationSchema);

export default Notification;
