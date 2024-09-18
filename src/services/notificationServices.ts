
import Notification, { NotificationCreationAttributes } from "../models/Notification";


class NotificationServices{

    async addNotification(message:NotificationCreationAttributes){
        const new_notification =  await Notification.create(message);
       
        return new_notification  as NotificationCreationAttributes
    }

    async getNotification(skip=0, limit=10){
        const notifications = await Notification.find().sort({created_at:-1}).skip(skip).limit(limit)
        const counts = await Notification.countDocuments();
        return {
            data:{notifications,counts},
            msg:"Notifications",
            statusCode:200
        }

    }
}

export default new NotificationServices()