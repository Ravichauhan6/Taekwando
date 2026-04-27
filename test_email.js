const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // send to self
  subject: "Test Email from MDTA Backend",
  text: "If you receive this, Nodemailer is working perfectly!"
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Email Error:", error.message);
  } else {
    console.log("✅ Email sent successfully:", info.response);
  }
});
