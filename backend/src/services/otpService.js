import OtpCode from "../models/OtpCode.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPEmail } from "./emailService.js";
import { config } from "../config/env.js";

export const sendOTP = async (transactionId, email) => {
  try {
    // Generate OTP
    const otpCode = generateOTP();

    // Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + config.otp.expireMinutes);

    // Save OTP to database
    await OtpCode.create(transactionId, otpCode, expiresAt);

    // Send email
    const emailSent = await sendOTPEmail(email, otpCode);

    return emailSent;
  } catch (error) {
    console.error("OTP service error:", error);
    return false;
  }
};

export const verifyOTP = async (transactionId, otpCode) => {
  try {
    // Find valid OTP
    const otp = await OtpCode.findValid(transactionId, otpCode);

    if (!otp) {
      return false;
    }

    // Mark as used
    await OtpCode.markAsUsed(otp.id);

    return true;
  } catch (error) {
    console.error("OTP verification error:", error);
    return false;
  }
};

// Clean up expired OTPs periodically
setInterval(async () => {
  try {
    const deleted = await OtpCode.deleteExpired();
    if (deleted > 0) {
      console.log(`Cleaned up ${deleted} expired OTPs`);
    }
  } catch (error) {
    console.error("Error cleaning up OTPs:", error);
  }
}, 300000); // Run every 5 minutes
