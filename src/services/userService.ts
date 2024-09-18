/** @format */

import { User, UserCreationAttributes } from "../models/User";
import { messageStrings } from "../config/strings";
import { BadRequestError } from "../errors/BadRequestError";
import jwt from "jsonwebtoken";
import generator from "generate-password";
import Email from "../util/Email";
import Password from "../util/Password";
import { NotAuthorizedError } from "../errors/NotAuthorizeError";
import { ObjectId, Types } from "mongoose";
import { config } from "../config/configBasic";

class UserService {
  async signUp(reqBody: UserCreationAttributes) {
    let {
      email,
      password,
      full_name,
      profession,
      ethnicity,
      gender,
      pronouns,
      age_range,
      about_you,
    } = reqBody;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already exists.");
    }

    let generateCode = generator.generate({ length: 8, numbers: true });
    let token = jwt.sign(generateCode, String(config.Jwt_keys.JWT_key));
    let user = new User({
      email,
      password,
      full_name,
      profession,
      ethnicity,
      gender,
      pronouns,
      age_range,
      about_you,
      token,
    });
    const new_user = await user.save();

    let link = `${config.front_server_urls.front_end_url}/verify/email/${token}`;
    await Email({
      to: email,
      subject: "Email Verification",
      text: "Hi! Click on the following link to verify your email",
      html: `Hi!  Click on the following link to verify your email. <br> <a href="${link}">${link}</a>`,
    });

    //   return email ;
    if (new_user) {
      return {
        statusCode: 201,
        user: new_user,
        msg: "Signed Up Successfully, Please verify your email",
      };
    }
  }
  async createToken(id: string, role: string, email: string) {
    let expires;
    expires = "24h";
    const token = jwt.sign(
      {
        id: id,
        role: role,
        email,
      },
      config.Jwt_keys.JWT_key!,
      { expiresIn: expires }
    );

    return token;
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ token });
    if (!user) {
      throw new BadRequestError("User doesn't exist.");
    }
    if (user?.email_verified) {
      throw new BadRequestError("Email already verified.");
    }

    const verifyUser = await User.updateOne(
      { email: user?.email },
      { email_verified: true }
    );

    const authorisedToken = await this.createToken(
      user.id,
      user.role,
      user.email
    );
    return {
      token: authorisedToken,
      msg: "Email successfully Verified",
      statusCode: 200,
    };
  }

  async signIn(reqBody: UserCreationAttributes) {
    const { email, password } = reqBody;
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      throw new BadRequestError("User Not exist");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Password did not match");
    }

    if (!existingUser.email_verified) {
      throw new BadRequestError("Please verify your email");
    }

    const token = await this.createToken(
      existingUser.id,
      existingUser.role,
      existingUser.email
    );
    return {
      statusCode: 200,
      token: token,
      role: existingUser.role,
      id: existingUser._id,
      msg: "Signed In Successfully",
    };
  }
  async updatePassword(
    new_password: string,
    current_password: string,
    id: string
  ) {
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequestError("No, such user found");
    }

    const current_passwords_match = await Password.compare(
      user.password,
      current_password
    );
    if (!current_passwords_match) {
      throw new BadRequestError("Current password does not match");
    }

    const passwords_match = await Password.compare(user.password, new_password);
    if (passwords_match) {
      throw new BadRequestError("Current and new password cannot be same");
    }

    user.password = new_password;
    const password_update = await user.save();
    if (password_update) {
      return {
        statusCode: 200,
        msg: "password updated Successfully",
      };
    }
  }

  async contactUs(message: string, email: string, contact: string) {
    await Email({
      from: "",
      to: "",
      subject: "New Message",
      text: `A new message has been received from Contact No:${contact} and Email ${email}:\n\n${message} `,
    });
    return {
      statusCode: 200,
      msg: "Email sent successfully",
    };
  }

  async getProfile(id: Types.ObjectId) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new BadRequestError("No such user found");
    }
    return {
      statusCode: 200,
      msg: "User profile",
      data: user,
    };
  }

  async forgetPassword(email: string) {
    const existingUser = await User.findOne({
      email,
    });
    if (!existingUser) {
      throw new BadRequestError("User does not exist.");
    }

    let generateCode = generator.generate({ length: 8, numbers: true });
    let token = jwt.sign(
      { code: generateCode },
      String(config.Jwt_keys.JWT_key),
      {
        expiresIn: "15m",
      }
    );

    existingUser.token = token;
    await existingUser.save();

    let link = `${config.front_server_urls.front_end_url}/verify/forgetPassword/${token}`;
    const sent = await Email({
      to: email,
      subject: "Forgot Password Verification",
      text: "Hi! Click on the following link to update your password",
      html: `Hi! Click on the following link to update your password. <br> <a href="${link}">${link}</a>`,
    });

    if (!sent) {
      throw new BadRequestError("Email not sent for resetting password");
    }
    return {
      statusCode: 201,
      msg: "Forget Password link has been sent to your email. Kindly check your inbox!",
    };
  }

  async verifyForgetPassword(token: string, new_password: string) {
    const existingUser = await User.findOne({ token });
    if (!existingUser) {
      throw new BadRequestError("User doesn't exist.");
    }
    try {
      if (!existingUser.token) {
        throw new BadRequestError("Token not available in DB!");
      }
      const decodedToken = jwt.verify(
        existingUser.token,
        String(config.Jwt_keys.JWT_key)
      );
    } catch (error) {
      throw new BadRequestError("Password reset token has expired.");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      new_password
    );

    if (passwordsMatch) {
      throw new BadRequestError(
        "New password should not match Previous password!"
      );
    }

    existingUser.password = new_password;
    const password_update = await existingUser.save();

    if (!password_update) {
      throw new BadRequestError("Password not updated");
    }
    return {
      statusCode: 200,
      msg: "password reset Successfully, go to login",
    };
  }
  async changeName(updatedName: string, id: ObjectId) {
    const user = await User.findById(id);
    if (!user) {
      throw new BadRequestError("No, such user found");
    }
    if (updatedName == user.full_name) {
      throw new BadRequestError("Name can not be same as previous name");
    }
    user.full_name = updatedName;
    await user.save();
    return {
      statusCode: 200,
      msg: "Name has been updated",
    };
  }
  async changeNotification(notification: boolean, id: ObjectId) {
    const user = await User.findByIdAndUpdate(id, { notification });
    return {
      statusCode: 200,
      msg: "Notification has been updated",
    };
  }
}

export default new UserService();
