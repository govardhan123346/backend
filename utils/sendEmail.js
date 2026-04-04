const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"DriveEase" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your DriveEase account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #eee;">
        <h2 style="color:#e53935;">🚗 DriveEase</h2>
        <h3>Verify your email address</h3>
        <p>Use the OTP below to complete your registration. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#e53935;text-align:center;padding:20px;background:#fff5f5;border-radius:8px;margin:20px 0;">
          ${otp}
        </div>
        <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = sendOTPEmail;