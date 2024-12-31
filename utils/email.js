"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountEmail = exports.createAccountEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
dotenv_1.default.config();
const createAccountEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.GOOGLE_KEY,
        },
    });
    let pathFile = path_1.default.join(__dirname, "../views/createAccount.ejs");
    const html = yield ejs_1.default.renderFile(pathFile, {
        name: user === null || user === void 0 ? void 0 : user.name,
    });
    console.log("send t");
    const url = "http://localhost:5173/auth/verify";
    const mailer = {
        to: user.email,
        from: `Account Creation <${process.env.MAIL_USER}>`,
        subject: "Account Verification",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"></a>
    </div>
    <p style="font-size:1.1em">Hi,${user.name}</p>
    <p>Thank you for choosing our brand Use the following OTP to complete your Sign Up procedures.please hit the button below to verify yout account</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${user.otp}</h2>
    <p style="font-size:0.9em;">Regards,<br/>popoola ibrahim </p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;">
      <a href="${url}">
      <buttton style = "border-radius:5px; color:white background-color:purple width:max--content">verify OTP<button>
      </a>
    </div>
  </div>
</div>`,
    };
    transporter.sendMail(mailer).then(() => {
        console.log("send");
    });
});
exports.createAccountEmail = createAccountEmail;
const verifyAccountEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.GOOGLE_KEY,
        },
    });
    console.log("sent");
    const url = "http://localhost:5173/auth/login";
    const mailer = {
        to: user.email,
        from: `ibrahim <${process.env.MAIL_USER}>`,
        subject: "verification succesful",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"></a>
    </div>
    <p style="font-size:1.1em">Hi,${user.name}</p>
    <p>Congratulations your account has been verified hit the button below to sign in</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"></h2>
    <p style="font-size:0.9em;">Regards,<br /></p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <a href="${url}">
      <buttton style = "border-radius:5px; color:white background-color:purple width:max--content">sign in your account<button>
      </a>
    </div>
  </div>
</div>`,
    };
    transporter.sendMail(mailer).then(() => {
        console.log("mail sent");
    });
});
exports.verifyAccountEmail = verifyAccountEmail;
