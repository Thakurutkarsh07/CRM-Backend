const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return 'SENT';
  } catch (err) {
    console.error(`Email failed to ${to}:`, err.message);
    return 'FAILED';
  }
};

module.exports = { sendEmail };
