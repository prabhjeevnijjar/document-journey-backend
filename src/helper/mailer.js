const nodemailer = require("nodemailer");
const { senderMail, senderMailPass } = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderMail,
    pass: senderMailPass,
  },
});

exports.sendOtpMail = async (email, otp) => {
  return transporter.sendMail({
    from: `"Document App" <${senderMail}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  });
};
