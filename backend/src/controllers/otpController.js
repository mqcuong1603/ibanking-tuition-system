import { sendOTP } from "../services/otpService.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { TRANSACTION_STATUS, SUCCESS_MESSAGES } from "../config/constants.js";

export const resendOTP = async (req, res, next) => {
  try {
    const { transaction_id } = req.body;
    const userId = req.user.id;

    // Verify transaction ownership
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction || transaction.payer_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Check transaction status
    if (transaction.status === TRANSACTION_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: "Transaction already completed",
      });
    }

    // Get user email
    const user = await User.findById(userId);

    // Resend OTP
    const otpSent = await sendOTP(transaction_id, user.email);

    if (otpSent) {
      res.json({
        success: true,
        message: SUCCESS_MESSAGES.OTP_SENT,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
  } catch (error) {
    next(error);
  }
};
