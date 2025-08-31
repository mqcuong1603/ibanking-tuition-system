import TransactionLock from "../models/TransactionLock.js";
import { ERROR_MESSAGES } from "../config/constants.js";

export const checkLock = async (req, res, next) => {
  try {
    const { student_id } = req.body;

    if (student_id) {
      const lock = await TransactionLock.findActive(
        "student_tuition",
        student_id
      );

      if (lock) {
        return res.status(409).json({
          success: false,
          message: ERROR_MESSAGES.TRANSACTION_LOCKED,
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Clean up expired locks periodically
setInterval(async () => {
  try {
    const deleted = await TransactionLock.deleteExpired();
    if (deleted > 0) {
      console.log(`Cleaned up ${deleted} expired locks`);
    }
  } catch (error) {
    console.error("Error cleaning up locks:", error);
  }
}, 60000); // Run every minute
