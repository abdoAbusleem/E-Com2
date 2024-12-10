const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  address: "smtp.gmail.com",
  domain: "gmail.com",
  authentication: "plain",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

const sendResetcodeToMail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Your App Name" <${process.env.email}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = {
  sendResetcodeToMail,
};
