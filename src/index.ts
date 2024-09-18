require("dotenv").config();
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  const port = process.env.PORT || 5000;
  try {
    //@ts-ignore
    app.listen(port, () => {
      console.log(`Listening on ${port}!!`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
