"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP =
  exports.loginAccount =
  exports.verifyAccount =
  exports.readAllAccount =
  exports.readOneAccount =
  exports.createAccount =
    void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
const createAccount = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { name, email, age, password } = req.body;
      const salt = yield bcrypt_1.default.genSalt(9);
      const hashed = yield bcrypt_1.default.hash(password, salt);
      const GenerateOtp = crypto_1.default.randomInt(100000, 999999).toString();
      const user = yield userModel_1.default.create({
        name,
        email,
        age,
        password: hashed,
        otp: GenerateOtp,
      });
      yield (0, email_1.createAccountEmail)(user);
      return res.status(201).json({
        message: "your account has been created successfully",
        data: user,
        status: 201,
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
        status: 404,
      });
    }
  });
exports.createAccount = createAccount;
const readOneAccount = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userID } = req.params;
      const user = yield userModel_1.default.findById(userID);
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
  });
exports.readOneAccount = readOneAccount;
const readAllAccount = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const user = yield userModel_1.default.find();
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
  });
exports.readAllAccount = readAllAccount;
const verifyAccount = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userID } = req.params;
      const user = yield userModel_1.default.findByIdAndUpdate(
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
  });
exports.verifyAccount = verifyAccount;
const loginAccount = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      const user = yield userModel_1.default.findOne({
        email,
      });
      if (user) {
        const check = yield bcrypt_1.default.compare(password, user.password);
        if (check) {
          if (user.password && user.otp === "") {
            const token = jsonwebtoken_1.default.sign(
              { id: user.id },
              process.env.JWT_SECRET,
              {
                expiresIn: process.env.JWT_TIME,
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
  });
exports.loginAccount = loginAccount;
const verifyOTP = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { otp } = req.body;
      if (!otp) {
        return res.status(404).json({ message: "OTP is required" });
      }
      const user = yield userModel_1.default.findOne({ otp });
      if (!user) {
        return res.status(404).json({ message: "Invalid OTP" });
      }
      yield (0, email_1.verifyAccountEmail)(user);
      user.isVerified = true;
      user.otp = "";
      yield user.save();
      return res.status(201).json({
        message: "account verified",
        status: 201,
      });
    } catch (error) {
      return error;
    }
  });
exports.verifyOTP = verifyOTP;
