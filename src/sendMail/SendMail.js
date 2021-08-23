"use strict";
const nodemailer = require("nodemailer");

const sendMail = async (link, receiver) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: "leo.hudson210@gmail.com",
        pass: "Strugbits2018",
      },
    });

    await transporter.sendMail({
      from: "leo.hudson210@gmail.com",
      to: receiver,
      subject: "Email Verification Link",
      text: "Click on the link to verify your email " + link,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendMail;
