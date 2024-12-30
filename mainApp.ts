import { Application } from "express";
import userRouter from "./router/userRouter";
export const mainApp = async (app: Application) => {
  try {
    app.use("/api", userRouter);
  } catch (error) {
    return error;
  }
};
