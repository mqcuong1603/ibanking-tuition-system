export const TRANSACTION_STATUS = {
  PENDING: "pending",
  OTP_SENT: "otp_sent",
  COMPLETED: "completed",
  FAILED: "failed",
};

export const LOCK_RESOURCE_TYPE = {
  USER_ACCOUNT: "user_account",
  STUDENT_TUITION: "student_tuition",
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid username or password",
  UNAUTHORIZED: "Unauthorized access",
  STUDENT_NOT_FOUND: "Student not found",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  TUITION_ALREADY_PAID: "Tuition already paid",
  INVALID_OTP: "Invalid OTP code",
  OTP_EXPIRED: "OTP code has expired",
  TRANSACTION_LOCKED: "Transaction is locked by another process",
  SERVER_ERROR: "Internal server error",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  OTP_SENT: "OTP sent to your email",
  TRANSACTION_SUCCESS: "Transaction completed successfully",
  LOGOUT_SUCCESS: "Logout successful",
};
