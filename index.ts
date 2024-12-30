import express, { Application } from "express";
import cors from "cors";
import env from "dotenv";
import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";
import router from "./router/userRouter";

env.config();
const app: Application = express();

app.use(express.json());

app.use(cors());
app.use(router);
mainApp(app);
app.listen(process.env.PORT, () => {
  // console.log("connected");
  dbConfig();
});
