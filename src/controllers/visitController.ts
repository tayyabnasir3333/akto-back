
import { Request, Response, NextFunction } from "express";
import visitServices from "../services/visitServices";

class VisitController{

    // async addVisit(req: Request, res: Response, next: NextFunction){
    //     try {
    //         const visit = await visitServices.addVisit(req.headers['user-agent'], req.ip);
    //     } catch (error) {
    //         return next(error)
    //     }
    // }
}

export default new VisitController();