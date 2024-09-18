import { Request, Response, NextFunction } from "express";
import notificationServices from "../services/notificationServices";

class NotificationController{
    async getNotification(req: Request, res: Response, next: NextFunction){
        try {
            const {skip=0, limit=10}=req.query;
            const get_notifications = await notificationServices.getNotification(+skip,+limit);
            return res.status(get_notifications.statusCode).send({data:get_notifications.data,msg:get_notifications.msg})
        } catch (error) {
            return next(error)
        }

    }
}

export default new NotificationController();