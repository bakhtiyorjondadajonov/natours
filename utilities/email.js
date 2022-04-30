const nodemailer = require('nodemailer');
const sendEmail = async function (options) {
  // 1) Create a transporter | TRANSPORTER IS THE SERVICE THAT ACTUALLY SENDS THE EMAIL
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_ADR_PSW,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Bakhtiyorjon Dadajonov <bakhtiyorjondadajonov@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
