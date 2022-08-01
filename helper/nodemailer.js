const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "handev.co@gmail.com",
    pass: "bpnkzzbmouvkdflp",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
