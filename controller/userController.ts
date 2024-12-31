import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import { createAccountEmail, verifyAccountEmail } from "../utils/email";
import crypto from "crypto";
export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, email, age, password } = req.body;

    const salt = await bcrypt.genSalt(9);
    const hashed = await bcrypt.hash(password, salt);

    const GenerateOtp = crypto.randomInt(100000, 999999).toString();
    const user = await userModel.create({
      name,
      email,
      age,
      password: hashed,
      otp: GenerateOtp,
    });

    await createAccountEmail(user);
    return res.status(201).json({
      message: "your account has been created successfully",
      data: user,
      status: 201,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
      status: 404,
    });
  }
};

export const readOneAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID);
    return res.status(201).json({
      message: "account fetched successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "errror fetching account",
      status: 404,
    });
  }
};

export const readAllAccount = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find();
    return res.status(201).json({
      message: " all users account fetched successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "errror fetching  users account",
      status: 404,
    });
  }
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        isVerified: true,
        otp: "",
      },
      { new: true }
    );
    return res.status(201).json({
      message: "account verified successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({
      message: "error vrifying account",
      status: 404,
    });
  }
};

export const loginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({
      email,
    });
    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        if (user.password && user.otp === "") {
          const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: process.env.JWT_TIME as string,
            }
          );
          return res.status(201).json({
            message: "account logged in succesful",
            data: token,
            status: 201,
          });
        } else {
          return res.status(404).json({
            message: "please verify your account",
            status: 404,
          });
        }
      } else {
        return res.status(404).json({
          message: "error with email",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "error with password",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "error logging in account",
      status: 404,
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(404).json({ message: "OTP is required" });
    }

    const user = await userModel.findOne({ otp });

    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    await verifyAccountEmail(user);
    user.isVerified = true;
    user.otp = "";

    await user.save();
    return res.status(201).json({
      message: "account verified",
      status: 201,
    });
  } catch (error) {
    return error;
  }
};
