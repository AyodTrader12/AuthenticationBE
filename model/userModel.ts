import { Schema, model } from "mongoose";

interface iUser {
  name: string;
  email: string;
  age: string;
  password: string;
  isVerified: boolean;
  otp: string;
}

interface iuserData extends iUser, Document {}

const userModel = new Schema<iuserData>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,

      default: false,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<iuserData>("users", userModel);
