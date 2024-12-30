import { Router } from "express";
import {
  createAccount,
  loginAccount,
  readAllAccount,
  readOneAccount,
  verifyAccount,
  verifyOTP,
} from "../controller/userController";

const router: any = Router();

router.route("/create-account").post(createAccount);

router.route("/login").post(loginAccount);

router.route("/read-one-user/:userID").get(readOneAccount);

router.route("/verify-account/:userID").get(verifyAccount);
router.route("/verify-otp").patch(verifyOTP);

router.route("/users").get(readAllAccount);

export default router;
