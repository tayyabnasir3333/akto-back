import { Request, Response, NextFunction } from "express";
import adminService from "../services/adminService";

class adminController{

    async createAdmin(req: Request, res: Response, next: NextFunction){
        try {
            const create_admin = await adminService.createAdmin(req.body);
            return res.status(create_admin!.statusCode).send({msg:create_admin?.msg})
        } catch (error) {
            return next (error)
        }
    }
    
}

export default new adminController()