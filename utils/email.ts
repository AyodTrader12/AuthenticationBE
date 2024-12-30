import { google } from "googleapis";
import nodemailer from "nodemailer";
import env from "dotenv";
import jwt from "jsonwebtoken";

import path from "path";
import ejs from "ejs";
import { log } from "console";

env.config();

export const createAccountEmail = async (user: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER as string,
      pass: process.env.GOOGLE_KEY as string,
    },
  });

  let pathFile = path.join(__dirname, "../views/createAccount.ejs");
  const html = await ejs.renderFile(pathFile, {
    name: user?.name,
  });

  console.log("send t");
  const url = "http://localhost:5173/auth/verify";
  const mailer = {
    to: user.email,
    from: `Account Creation <${process.env.MAIL_USER as string}>`,
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
};

export const verifyAccountEmail = async (user: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER as string,
      pass: process.env.GOOGLE_KEY as string,
    },
  });

  console.log("sent");
  const url = "http://localhost:5173/auth/login";
  const mailer = {
    to: user.email,
    from: `ibrahim <${process.env.MAIL_USER as string}>`,
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
};
