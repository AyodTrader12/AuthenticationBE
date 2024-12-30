import { connect } from "mongoose";
import env from "dotenv";

export const dbConfig = async () => {
  try {
    await connect(process.env.MONGO_LIVE_URL as string).then(() => {
      console.clear();
      console.log("server connected..👍✌🤞");
    });
  } catch (error) {
    return error;
  }
};
