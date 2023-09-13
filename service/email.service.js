const nodemailer = require("nodemailer");
const User = require("../models/user.model");
require("dotenv").config();
const config = {
  pool: true,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

const send = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Please click the link below to verify your email:<br>http://localhost:3000/api/users/verify/${verificationToken}`,
  };
  return await transporter.sendMail(emailOptions);
};

const userVerification = async (verificationToken) => {
  const response = await User.findOneAndUpdate(
    { verificationToken: verificationToken },
    { verificationToken: null, verify: true },
    { new: true }
  );
  return response;
};
module.exports = {
  send,
  userVerification,
};
