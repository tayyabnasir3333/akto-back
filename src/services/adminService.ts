import { ROLES } from "../config/ENUM";
import { BadRequestError } from "../errors";
import { User, UserCreationAttributes } from "../models/User";


class adminService{
    async createAdmin(admin:UserCreationAttributes){
        const existingUser =  await User.findOne({email:admin.email});
        if (existingUser){
            throw new BadRequestError("Email already exist")
        }
        admin.role = ROLES.ADMIN
        const new_admin = await User.create(admin);
        if (new_admin){
            return {
                statusCode:201,
                msg:"Admin created Successfully",

            }
        }

    }

}

export default new adminService();