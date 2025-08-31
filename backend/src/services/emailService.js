import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"iBanking TDTU" <${config.email.user}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

export const sendOTPEmail = async (email, otp) => {
  const subject = "OTP xác thực giao dịch - iBanking TDTU";
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Xác thực giao dịch</h2>
            <p>Mã OTP của bạn là:</p>
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p style="color: #666;">Mã OTP này có hiệu lực trong 5 phút.</p>
            <p style="color: #666;">Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">Email này được gửi tự động từ hệ thống iBanking TDTU.</p>
        </div>
    `;

  return sendEmail(email, subject, html);
};

export const sendTransactionEmail = async (email, transactionInfo) => {
  const subject = "Giao dịch thành công - iBanking TDTU";
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Giao dịch thành công!</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Mã giao dịch:</strong> ${
                  transactionInfo.transaction_id
                }</p>
                <p><strong>Mã sinh viên:</strong> ${
                  transactionInfo.student_id
                }</p>
                <p><strong>Tên sinh viên:</strong> ${
                  transactionInfo.student_name
                }</p>
                <p><strong>Số tiền:</strong> ${transactionInfo.amount.toLocaleString(
                  "vi-VN"
                )} VND</p>
                <p><strong>Số dư còn lại:</strong> ${transactionInfo.balance_after.toLocaleString(
                  "vi-VN"
                )} VND</p>
            </div>
            <p style="color: #666;">Cảm ơn bạn đã sử dụng dịch vụ iBanking TDTU.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">Email này được gửi tự động từ hệ thống iBanking TDTU.</p>
        </div>
    `;

  return sendEmail(email, subject, html);
};
