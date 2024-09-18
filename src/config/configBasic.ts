import path from "path";
require("dotenv").config({ path: path.join(__dirname, ".env") });
export const config = {
  MONGODB: {
    MONGOURI: process.env.MongoUri,
  },
  jwt: {
    jwtSecret: process.env.JWT_KEY,
    saltRounds: process.env.saltRounds,
  },
  Redis: {
    HOST: process.env.redis_host,
    PORT: process.env.redis_port,
  },
  Stripe: {
    secret_key: process.env.Stripe_Secret_key,
  },
  Jwt_keys: {
    JWT_key: process.env.JWT_KEY,
  },
  Aws: {
    access_key: process.env.AWS_Access_Key,
    secret_key: process.env.Aws_Secret_Key,
    bucket_name: process.env.Aws_Bucket_Name,
    folder_name: process.env.Folder_Name,
  },

  verificationTokenSize: process.env.verificationTokenSize,
  investor_url: process.env.INVESTOR_URL,
  mailTrap: {
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_AUTH_USER,
      pass: process.env.MAILTRAP_AUTH_PASS,
    },
    fromEmail: process.env.MAILTRAP_FROM_EMAIL,
  },
  front_server_urls: {
    front_end_url: process.env.SERVER_URL,
  },
};
